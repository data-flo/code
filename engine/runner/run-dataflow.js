const { performance } = require("perf_hooks");

const castType = require("./cast-type");
const parseInputArguments = require("./parse-input-arguments");
const parseOutputArguments = require("./parse-output-arguments");
const { sortStagesByExecutionOrder } = require("./execution");

module.exports = async function (manifest, rawValues, options = {}, context) {
  const run = {
    started: performance.now(),
    steps: [],
  };

  const inDebugMode = options.debug || false;

  try {
    // check input against manifest
    const dataflowInputs = parseInputArguments(manifest.input, rawValues);
    run.inputs = dataflowInputs;

    // cache outputs of all steps
    run.outputs = {};

    const transformSteps = sortStagesByExecutionOrder(manifest.transform);

    const dependencyGraph = [];
    for (const transformation of transformSteps) {
      for (const binding of transformation.binding) {
        if (binding.type === "input") {
          dependencyGraph.push({
            transformation: transformation.name,
            dependsOn: {
              input: binding.input,
            },
          });
        }
        else if (binding.type === "transformation") {
          dependencyGraph.push({
            transformation: transformation.name,
            dependsOn: {
              transformation: binding.transformation,
              argument: binding.argument,
            },
          });
        }
      }
    }
    for (const spec of manifest.output) {
      dependencyGraph.push({
        output: spec.name,
        dependsOn: {
          transformation: spec.transformation,
          argument: spec.argument,
        },
      });
    }

    for (const transformation of transformSteps) {
      const step = {
        transformation: transformation.name,
        started: performance.now(),
      };
      run.steps.push(step);

      try {
        // Check that name is unique
        if (transformation.name in run.outputs) {
          throw new Error(`The name ${transformation.name} exists already.`);
        }

        // Get the manifest for the current transformation based on its type
        let transformationManifest = null;
        if (transformation.type === "adaptor") {
          transformationManifest = context.getAdaptorManifest(transformation.adaptor);
        }
        else if (transformation.type === "dataflow") {
          transformationManifest = await context.getDataflowManifest(transformation.dataflow);
        }
        else {
          throw new Error(`Invalid transformation type ${transformation.type}.`);
        }

        // Collect transformation inputs
        step.inputs = {};
        for (const binding of transformation.binding) {
          const inputArgumentSpec = transformationManifest.input.find((x) => x.name === binding.target);
          if (!inputArgumentSpec) {
            throw new Error(`Invalid binding for ${transformation.name}: cannot find argument named ${binding.target} in ${transformation.type} ${transformation[transformation.type]}.`);
          }

          if (binding.type === "input") {
            if (binding.input in dataflowInputs) {
              step.inputs[binding.target] = dataflowInputs[binding.input];
            }
            else {
              throw new Error(`Invalid binding for ${transformation.name}: cannot find input argument named ${binding.input}.`);
            }
          }
          else if (binding.type === "value") {
            step.inputs[binding.target] = castType(inputArgumentSpec.type, binding.value);
          }
          else if (binding.type === "transformation") {
            if (binding.transformation in run.outputs) {
              if (binding.argument in run.outputs[binding.transformation]) {
                step.inputs[binding.target] = run.outputs[binding.transformation][binding.argument];
              }
              else {
                throw new Error(`Invalid binding for ${transformation.name}: cannot find argument named ${binding.argument} in transformation ${binding.transformation}.`);
              }
            }
            else {
              throw new Error(`Invalid binding for ${transformation.name}: cannot find transformation ${binding.transformation}.`);
            }
          }
          else {
            throw new Error(`Invalid binding type for ${transformation.name}: ${binding.type}.`);
          }
        }


        // Run the transformation as an adaptor or a dataflow based on its type
        if (transformation.type === "adaptor") {
          run.outputs[transformation.name] = await context.runAdaptor(transformation.adaptor, step.inputs);
        }
        else if (transformation.type === "dataflow") {
          const stepRun = await context.runDataflow(transformationManifest, step.inputs);
          if (stepRun.status === "error") {
            throw stepRun.error;
          }
          run.outputs[transformation.name] = stepRun.outputs;
        }

        // Record execution time and mark the step as success
        step.ended = performance.now();
        step.duration = (step.ended - step.started); // in milliseconds
        step.status = "success";
        step.outputs = run.outputs[transformation.name];

        // Clean-up inputs and outputs when not in debug mode
        if (!inDebugMode) {
          step.inputs = undefined;
          step.outputs = undefined;

          // Remove outputs which will not be used
          for (const outputName of Object.keys(run.outputs[transformation.name])) {
            const inUse = dependencyGraph.some((x) => x.dependsOn.transformation === transformation.name && x.dependsOn.argument === outputName);
            if (!inUse) {
              run.outputs[transformation.name][outputName] = undefined;
            }
          }

          // Remove current step from
          for (let index = 0; index < dependencyGraph.length; index++) {
            const dependency = dependencyGraph[index];
            if (dependency.transformation === transformation.name && dependency.dependsOn.transformation) {
              const inUse = dependencyGraph.some(
                (x) =>
                  (x.transformation !== transformation.name)
                  &&
                  (x.dependsOn.transformation === dependency.dependsOn.transformation)
                  &&
                  (x.dependsOn.argument === dependency.dependsOn.argument)
              );
              if (!inUse) {
                run.outputs[dependency.dependsOn.transformation][dependency.dependsOn.argument] = undefined;
              }

              dependencyGraph.splice(index, 1);
            }
          }
        }
      }
      catch (error) {
        step.error = error.message || error;
        step.status = "error";

        // Throw to break the execution of next steps
        throw error;
      }
    }

    // Collect dataflow outputs
    const rawOutputs = {};
    for (const spec of manifest.output) {
      if (spec.transformation in run.outputs) {
        if (spec.argument in run.outputs[spec.transformation]) {
          rawOutputs[spec.name] = run.outputs[spec.transformation][spec.argument];
        }
        else {
          throw new Error(`Cannot bind output argument ${spec.name}. Cannot find argument named ${spec.argument} in transformation ${spec.transformation}.`);
        }
      }
      else {
        throw new Error(`Cannot bind output argument ${spec.name}. Cannot find transformation ${spec.transformation}.`);
      }
    }

    // check output against manifest
    run.outputs = parseOutputArguments(manifest.output, rawOutputs);
    run.status = "success";
  }
  catch (error) {
    console.error(error);
    run.error = error.message || error;
    run.status = "error";
  }

  run.ended = performance.now();
  run.duration = (run.ended - run.started); // in milliseconds

  return run;
};
