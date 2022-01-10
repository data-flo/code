/* eslint no-throw-literal: 0 */

const yn = require("yn");
const isStream = require("is-stream");
const logger = require("cgps-application-server/logger");

const DataflowModel = require("../../models/dataflow");
const engine = require("../../utils/engine");

function createInputs({ dataflow, query, files, body }) {
  const input = {};
  let fileIndex = 0;
  const fileNames = Object.keys(files || {});
  for (const spec of dataflow.manifest.input) {
    if (spec.name in query) {
      input[spec.name] = query[spec.name];
    }
    else if (spec.name in body) {
      input[spec.name] = body[spec.name];
    }
    else if (spec.type === "file" && files && files[fileIndex]) {
      input[spec.name] = Array.isArray(files) ? files[fileIndex] : files[fileNames[fileIndex]];
      fileIndex += 1;
    }
  }
  return input;
}

function encodeFile(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    stream.on("data", (chunk) => {
      chunks.push(chunk);
      size += chunk.length;
    });
    stream.on("end", () => {
      const result = Buffer.concat(chunks);
      resolve([
        size,
        result.toString("base64"),
      ]);
    });
    stream.on("error", reject);
  });
}

async function normaliseOutputs(raw) {
  const normalised = {};
  for (const [name, value] of Object.entries(raw)) {
    if (isStream(value)) {
      if (value.readable) {
        const [size, data] = await encodeFile(value);
        normalised[name] = {
          data,
          mediaType: value.mediaType || "text/plain",
          name: value.name || "Unnamed",
          size,
        };
      }
      else {
        throw `Cannot encode file output "${name}".`;
      }
    }
    else {
      normalised[name] = value;
    }
  }
  return normalised;
}

function normaliseArguments(list) {
  for (const key of Object.keys(list)) {
    const element = list[key];
    if (element instanceof Map) {
      list[key] = [];
      for (const entry of element.entries()) {
        list[key].push({ key: entry[0], value: entry[1] });
      }
    }
    else if (isStream(element)) {
      list[key] = {};
    }
  }
}

function pickOutput(outputs, outputName, mediaType, res) {
  if (outputName in outputs) {
    const value = outputs[outputName];
    if (isStream(value)) {
      res.set(
        "Content-disposition",
        `attachment; filename=dataflo-${value.name || outputName}`
      );
      res.type(mediaType || value.mediaType || "application/octet-stream");
      value.pipe(res);
    }
    else {
      res.json(value);
    }
  }
  else {
    throw new Error(`Cannot find an output named ${outputName}, valid keys are ${Object.keys(outputs)}.`);
  }
}

async function formatErrorMessage(dataflow, errorStep) {
  const stepManifest = dataflow.manifest.transform.find((x) => x.name === errorStep.transformation);
  const stepDescriptions = [];
  if (stepManifest.description) {
    stepDescriptions.push(stepManifest.description);
  }
  if (stepManifest.type === "adaptor") {
    stepDescriptions.push(`of type '${stepManifest.adaptor.replace(/-/g, " ")}'`);
  }
  else if (stepManifest.type === "dataflow") {
    const childDataflowModel = await DataflowModel.findByIdentifier(stepManifest.dataflow);
    stepDescriptions.push(`of type '${(childDataflowModel && childDataflowModel.name) || stepManifest.dataflow}'`);
  }
  const stepDescription = stepDescriptions.join(" ");
  const generalError = `An error has occurred during transformation step (${errorStep.transformation}) ${stepDescription} `;
  return dataflow.showDetailedErrors ? `${generalError}: ${errorStep.error}` : generalError;
}

module.exports = function (req, res) {
  console.log(new Date(), "Request to run Dataflow.", req.dataflow.identifier);
  const inDebugMode = yn(req.query.debug);
  Promise.resolve(req)
    .then(createInputs)
    .then((input) => engine(req).runDataflow(req.dataflow.manifest, input, { debug: inDebugMode }))
    .then(async (run) => {
      if (inDebugMode) {
        run.outputs = await normaliseOutputs(run.outputs);
        for (const step of run.steps) {
          if (step.inputs) {
            normaliseArguments(step.inputs);
          }
          if (step.outputs) {
            normaliseArguments(step.outputs);
          }
        }
        return run;
      }

      if (run.status === "success") {
        if (req.query.output) {
          return pickOutput(run.outputs, req.query.output, req.query.mediatype, res);
        }
        else {
          return normaliseOutputs(run.outputs);
        }
      }

      const errorStep = run.steps.find((x) => x.status === "error");
      if (errorStep) {
        const errorMessage = await formatErrorMessage(req.dataflow, errorStep);
        throw errorMessage;
      }
      else {
        throw req.dataflow.showDetailedErrors ? run.error : "An error has occurred";
      }
    })
    .then((output) => {
      if (output) {
        logger.info("dataflow run", { dataflow: req.dataflow.identifier, status: "success" }, { req, res });
        res.json(output);
      }
    })
    .catch((error) => {
      logger.info("dataflow run", { dataflow: req.dataflow.identifier, status: "failed", error: error?.message || error }, { req, res });
      res.status(500);
      if (error instanceof Error) {
        res.json({ error: error.message });
      }
      else {
        res.json({ error });
      }
    });
};
