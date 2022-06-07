/* eslint no-shadow: 0 */

const defaultBCR = {
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
  x: 0,
  y: 0,
};

const defaultAnchorBCR = {
  ...defaultBCR,
  userSet: false,
  alignment: undefined,
  arrow: false,
};

const validatorFns = {
  lengthGreaterThan: (x, y) => x.length > y,
  equals: (x, y) => x === y,
  isTrue: (x) => Boolean(x),
};


export const state = () => ({
  isVisible: false,
  index: 0,
  lastIndex: 0,
  maxIndex: 0,
  manifest: {},
  step: {},
  boundary: {
    width: 0,
    height: 0,
    scrollX: 0,
    scrollY: 0,
  },
  tutorialBCR: defaultBCR,
  anchor: {
    key: "",
    value: {},
  },
  values: {
    "dataflow-pane-name": undefined,
    "dataflow-pane-description": undefined,
    "toggle-side-pane": undefined,
    "data-sources": undefined,
    "main-transformation/transformation-1": undefined,
    "prop-pane": undefined,
    "binding-type": undefined,
    "main-input/url": undefined,
    "input-pane-name": undefined,
    "input-pane-description": undefined,
    "data-tables": undefined,
    "main-transformation/transformation-2": undefined,
    "main-transformation/transformation-3": undefined,
    "transformation-1-data-transformation-2-data": undefined,
    "transformation-1-data-transformation-3-data": undefined,
    "list-manipulation": undefined,
    "main-transformation/transformation-4": undefined,
    "main-transformation/transformation-5": undefined,
    "transformation-3-columns-transformation-4-list": undefined,
    "transformation-3-columns-transformation-5-list": undefined,
    "binding-value": undefined,
    "data-destinations": undefined,
    "main-transformation/transformation-6": undefined,
    "transformation-1-slug-transformation-6-name": undefined,
    "transformation-2-csv-transformation-6-data": undefined,
    "transformation-4-value-transformation-6-mapLatitude": undefined,
    "transformation-5-value-transformation-6-mapLongitude": undefined,
    "binding-type-output": undefined,
    "debug-input-Epicollect URL": undefined,
    "debug-success": undefined,
    "argument-selection": undefined,
  },
  validators: {
    name: [
      {
        key: "dataflow-pane-name",
        tests: [
          {
            fn: "lengthGreaterThan",
            params: [5],
          },
        ],
      },
    ],
    description: [
      {
        key: "dataflow-pane-description",
        tests: [
          {
            fn: "lengthGreaterThan",
            params: [10],
          },
        ],
      },
    ],
    openTransformations: [
      {
        key: "toggle-side-pane",
        tests: [
          {
            fn: "isTrue",
          },
        ],
      },
    ],
    selectDataSource: [
      {
        key: "data-sources",
        tests: [
          {
            fn: "isTrue",
          },
        ],
      },
    ],
    addEpicollect: [
      {
        key: "main-transformation/transformation-1",
        tests: [
          {
            fn: "isTrue",
          },
        ],
      },
    ],
    bindings: [
      {
        key: "prop-pane",
        tests: [
          {
            fn: "equals",
            params: ["argument"],
          },
        ],
      },
    ],
    bindingTypeInput: [
      {
        key: "binding-type",
        tests: [
          {
            fn: "equals",
            params: ["input"],
          },
        ],
      },
    ],
    bindingTypeInputNew: [
      {
        key: "main-input/url",
        tests: [
          {
            fn: "isTrue",
          },
        ],
      },
    ],
    selectInput: [
      {
        key: "prop-pane",
        tests: [
          {
            fn: "equals",
            params: ["input"],
          },
        ],
      },
    ],
    inputName: [
      {
        key: "input-pane-name",
        tests: [
          {
            fn: "equals",
            params: ["Epicollect URL"],
          },
        ],
      },
    ],
    inputDescription: [
      {
        key: "input-pane-description",
        tests: [
          {
            fn: "lengthGreaterThan",
            params: [10],
          },
        ],
      },
    ],
    selectDatatables: [
      {
        key: "data-tables",
        tests: [
          {
            fn: "isTrue",
          },
        ],
      },
    ],
    addDatatableToCsv: [
      {
        key: "main-transformation/transformation-2",
        tests: [
          {
            fn: "isTrue",
          },
        ],
      },
    ],
    addDatatableColumns: [
      {
        key: "main-transformation/transformation-3",
        tests: [
          {
            fn: "isTrue",
          },
        ],
      },
    ],
    epicollectOutData: [
      {
        key: "prop-pane",
        tests: [
          {
            fn: "equals",
            params: ["argument"],
          },
        ],
      },
    ],
    datatableToCsvInData: [
      {
        key: "transformation-1-data-transformation-2-data",
        tests: [
          {
            fn: "isTrue",
          },
        ],
      },
    ],
    datatableColumnsInData: [
      {
        key: "transformation-1-data-transformation-3-data",
        tests: [
          {
            fn: "isTrue",
          },
        ],
      },
    ],
    selectList: [
      {
        key: "list-manipulation",
        tests: [
          {
            fn: "isTrue",
          },
        ],
      },
    ],
    addFindValue: [
      {
        key: "main-transformation/transformation-4",
        tests: [
          {
            fn: "isTrue",
          },
        ],
      },
      {
        key: "main-transformation/transformation-5",
        tests: [
          {
            fn: "isTrue",
          },
        ],
      },
    ],
    datatableColumnsOutData: [
      {
        key: "transformation-3-columns-transformation-4-list",
        tests: [
          {
            fn: "isTrue",
          },
        ],
      },
      {
        key: "transformation-3-columns-transformation-5-list",
        tests: [
          {
            fn: "isTrue",
          },
        ],
      },
    ],
    findValuesPattern: [
      {
        key: "prop-pane",
        tests: [
          {
            fn: "equals",
            params: ["argument"],
          },
        ],
      },
      {
        key: "argument-selection",
        tests: [
          {
            fn: "equals",
            params: ["pattern"],
          },
        ],
      },
    ],
    bindingTypeValue: [
      {
        key: "binding-type",
        tests: [
          {
            fn: "equals",
            params: ["value"],
          },
        ],
      },
    ],
    bindingTypeValueTextAndRegexp: [
      {
        key: "binding-value",
        tests: [
          {
            fn: "equals",
            params: ["/^lat_/"],
          },
        ],
      },
    ],
    bindingTypeValueTextAndRegexpAgain: [
      {
        key: "binding-value",
        tests: [
          {
            fn: "equals",
            params: ["/^long_/"],
          },
        ],
      },
    ],
    selectDataDestination: [
      {
        key: "data-destinations",
        tests: [
          {
            fn: "isTrue",
          },
        ],
      },
    ],
    addUploadToMicroreact: [
      {
        key: "main-transformation/transformation-6",
        tests: [
          {
            fn: "isTrue",
          },
        ],
      },
    ],
    uploadToMicroreactId: [
      {
        key: "binding-value",
        tests: [
          {
            fn: "equals",
            params: ["ec5_uuid"],
          },
        ],
      },
    ],
    uploadToMicroreactTimelineField: [
      {
        key: "binding-value",
        tests: [
          {
            fn: "equals",
            params: ["created_at"],
          },
        ],
      },
    ],
    uploadToMicroreactTimelineFormat: [
      {
        key: "binding-value",
        tests: [
          {
            fn: "equals",
            params: ["ISO 8601"],
          },
        ],
      },
    ],
    finalTest1: [
      {
        key: "transformation-1-slug-transformation-6-name",
        tests: [
          {
            fn: "isTrue",
          },
        ],
      },
    ],
    finalTest2: [
      {
        key: "transformation-2-csv-transformation-6-data",
        tests: [
          {
            fn: "isTrue",
          },
        ],
      },
    ],
    finalTest3: [
      {
        key: "transformation-4-value-transformation-6-mapLatitude",
        tests: [
          {
            fn: "isTrue",
          },
        ],
      },
    ],
    finalTest4: [
      {
        key: "transformation-5-value-transformation-6-mapLongitude",
        tests: [
          {
            fn: "isTrue",
          },
        ],
      },
    ],
    uploadToMicroreactUrl: [
      {
        key: "prop-pane",
        tests: [
          {
            fn: "equals",
            params: ["argument"],
          },
        ],
      },
      {
        key: "argument-selection",
        tests: [
          {
            fn: "equals",
            params: ["url"],
          },
        ],
      },
    ],
    bindOutput: [
      {
        key: "binding-type-output",
        tests: [
          {
            fn: "isTrue",
          },
        ],
      },
    ],
    debug: [
      {
        key: "prop-pane",
        tests: [
          {
            fn: "equals",
            params: ["debugger"],
          },
        ],
      },
    ],
    debugInputUrl: [
      {
        key: "debug-input-Epicollect URL",
        tests: [
          {
            fn: "equals",
            params: ["https://five.epicollect.net/project/sj-dolphin-watch"],
          },
        ],
      },
    ],
    debugRun: [
      {
        key: "debug-success",
        tests: [
          {
            fn: "isTrue",
          },
        ],
      },
    ],
    debugClose: [
      {
        key: "prop-pane",
        tests: [
          {
            fn: "equals",
            params: ["dataflow"],
          },
        ],
      },
    ],
  },
  postValidatorManifests: {
    setNextIndex: {
      location: "component",
      type: "setNextIndex",
    },
  },
  postValidators: {
    name: [
      {
        key: "setNextIndex",
      },
    ],
    description: [
      {
        key: "setNextIndex",
      },
    ],
    openTransformations: [
      {
        key: "setNextIndex",
      },
    ],
    selectDataSource: [
      {
        key: "setNextIndex",
      },
    ],
    addEpicollect: [
      {
        key: "setNextIndex",
      },
    ],
    bindings: [
      {
        key: "setNextIndex",
      },
    ],
    bindingTypes: [
      {
        key: "setNextIndex",
      },
    ],
    bindingTypeInput: [
      {
        key: "setNextIndex",
      },
    ],
    bindingTypeInputNew: [
      {
        key: "setNextIndex",
      },
    ],
    selectInput: [
      {
        key: "setNextIndex",
      },
    ],
    inputName: [
      {
        key: "setNextIndex",
      },
    ],
    inputDescription: [
      {
        key: "setNextIndex",
      },
    ],
    selectDatatables: [
      {
        key: "setNextIndex",
      },
    ],
    addDatatableToCsv: [
      {
        key: "setNextIndex",
      },
    ],
    addDatatableColumns: [
      {
        key: "setNextIndex",
      },
    ],
    epicollectOutData: [
      {
        key: "setNextIndex",
      },
    ],
    datatableToCsvInData: [
      {
        key: "setNextIndex",
      },
    ],
    datatableColumnsInData: [
      {
        key: "setNextIndex",
      },
    ],
    selectList: [
      {
        key: "setNextIndex",
      },
    ],
    addFindValue: [
      {
        key: "setNextIndex",
      },
    ],
    datatableColumnsOutData: [
      {
        key: "setNextIndex",
      },
    ],
    findValuesPattern: [
      {
        key: "setNextIndex",
      },
    ],
    bindingTypeValue: [
      {
        key: "setNextIndex",
      },
    ],
    bindingTypeValueTextAndRegexp: [
      {
        key: "setNextIndex",
      },
    ],
    bindingTypeValueTextAndRegexpAgain: [
      {
        key: "setNextIndex",
      },
    ],
    selectDataDestination: [
      {
        key: "setNextIndex",
      },
    ],
    addUploadToMicroreact: [
      {
        key: "setNextIndex",
      },
    ],
    uploadToMicroreactId: [
      {
        key: "setNextIndex",
      },
    ],
    uploadToMicroreactTimelineField: [
      {
        key: "setNextIndex",
      },
    ],
    uploadToMicroreactTimelineFormat: [
      {
        key: "setNextIndex",
      },
    ],
    finalTest1: [
      {
        key: "setNextIndex",
      },
    ],
    finalTest2: [
      {
        key: "setNextIndex",
      },
    ],
    finalTest3: [
      {
        key: "setNextIndex",
      },
    ],
    finalTest4: [
      {
        key: "setNextIndex",
      },
    ],
    uploadToMicroreactUrl: [
      {
        key: "setNextIndex",
      },
    ],
    bindOutput: [
      {
        key: "setNextIndex",
      },
    ],
    debug: [
      {
        key: "setNextIndex",
      },
    ],
    debugInputUrl: [
      {
        key: "setNextIndex",
      },
    ],
    debugRun: [
      {
        key: "setNextIndex",
      },
    ],
    debugClose: [
      {
        key: "setNextIndex",
      },
    ],
  },
  steps: {
    welcome: {
      title: "Welcome to the Data-flo editor",
      body: "This tutorial will walk through an example of connecting [Epicollect](https://five.epicollect.net/), a mobile & web Application for free and easy data collection, with [Microreact](https://microreact.org/showcase), which provides open data visualization and sharing for genomic epidemiology.",
    },
    name: {
      anchor: "dataflow-pane-name",
      value: ["dataflow-pane-name"],
      title: "Give the dataflow a name",
      body: "This is the name that will be shown on the menu, so make it a good one!",
    },
    description: {
      anchor: "dataflow-pane-description",
      value: ["dataflow-pane-description"],
      title: "Add a description",
      body: "The description field is a place for you to document how your dataflow works, this will then be shown in the run page.",
    },
    openTransformations: {
      anchor: "toggle-side-pane",
      value: ["toggle-side-pane"],
      title: "Open the data transformations menu",
      body: "This menu contains the building blocks of a dataflow.",
    },
    selectDataSource: {
      anchor: "data-sources",
      value: ["data-sources"],
      title: "Data Sources",
      body: `There are many transformations categories, the Data Sources category contains transformations that pull data from external sources.

Click to expand the list.`,
    },
    addEpicollect: {
      anchor: "epicollect-project",
      value: ["main-transformation/transformation-1"],
      title: "Epicollect Project",
      body: `This transformation imports data from an Epicollect and converts it into a Dataflow datatable, we'll go into more detail about datatables later in the tutorial.

      Click to add this transformation to the Dataflow.`,
    },
    bindings: {
      anchor: "main-transformation-1-in-url",
      value: ["prop-pane"],
      title: "Bindings",
      body: `All transformation have two sets of bindings, inputs (left) and outputs (right), in the case of the Epicollect Project transformation, there is an input URL input along with two outputs, the project slug, and data.

Click the URL input to open the argument pane.`,
    },
    bindingTypeInput: {
      anchor: "binding-type-input",
      value: ["binding-type"],
      title: "Binding Types; Input",
      body: `By choosing this we are saying we want the URL argument to be an input of this Dataflow, this means when running the dataflow users will be asked to supply an Epicollect project URL.

Click here to set the binding type.`,
    },
    bindingTypeInputNew: {
      anchor: "add-input-node",
      value: ["main-input/url"],
      title: "Add the new input",
      body: `Now that you have selected the binding type to be an input we have to add the input to the dataflow.

Click the plus button.`,
    },
    selectInput: {
      anchor: "main-input-argument-url",
      value: ["prop-pane"],
      title: "Select the new input",
      body: `As long as the input and a transformation share the same data type they can be linked, inputs can be linked to many transformations at a time.

Let's edit the input, click it to open the input pane.`,
    },
    inputName: {
      anchor: "input-pane-name",
      value: ["input-pane-name"],
      title: "The inputs name",
      body: "Input names are unique, notice that when you edit the name it will also update the input on the dataflow graph, we should call this input `Epicollect URL`.",
    },
    inputDescription: {
      anchor: "input-pane-description",
      value: ["input-pane-description"],
      title: "The inputs description",
      body: "Input descriptions are displayed alongside the input on the run page, make sure to add any important details here, something along the lines of `An Epicollect 5 Project URL` would work nicely here.",
    },
    selectDatatables: {
      anchor: "data-tables",
      value: ["data-tables"],
      title: "Data Tables",
      body: `Datatables are one of dataflows custom data types, they are a JSON object made up of columns and rows, this category contains datatable specific transformations.

Click to expand the list.`,
    },
    addDatatableToCsv: {
      anchor: "datatable-to-csv",
      value: ["main-transformation/transformation-2"],
      title: "Datatable to CSV",
      body: `This transforms a datatable into a CSV format.

Lets add one to the dataflow.`,
    },
    addDatatableColumns: {
      anchor: "datatable-columns",
      value: ["main-transformation/transformation-3"],
      title: "Datatable Columns",
      body: `This transformations returns the array / list, of a datatables columns.

Lets also add one of these to the dataflow.`,
    },
    epicollectOutData: {
      anchor: "main-transformation-1-out-data",
      value: ["prop-pane"],
      title: "Epicollect data",
      body: `Now that we have added the previous two Datatable transformations to the dataflow lets link them to our Epicollect data output.

First, click the data output argument.`,
    },
    datatableToCsvInData: {
      anchor: "transformation-node-transformation-2-input-argument-data-link",
      value: ["transformation-1-data-transformation-2-data"],
      title: "Datatable to csv link",
      body: `When an argument is selected other arguments that can be linked to it will show this plus icon.

To create the link click said plus icon.`,
    },
    datatableColumnsInData: {
      anchor: "transformation-node-transformation-3-input-argument-data-link",
      value: "transformation-1-data-transformation-3-data",
      title: "Datatable columns link",
      body: "Let us also link the Epicollect data output to the Datatables Columns data input.",
    },
    selectList: {
      anchor: "list-manipulation",
      value: ["list-manipulation"],
      title: "List manipulation",
      body: `Datatables Columns output has a data type of list, so we are going to need some List Manipulation transformations to handle it.

Click to expand the list.`,
    },
    addFindValue: {
      anchor: "find-value",
      value: ["main-transformation/transformation-4", "main-transformation/transformation-5"],
      title: "Find value",
      body: `This transformation uses a Javascript regular expression to find a value in a list, we are going to use this to find the longitude and latitude column names from out Epicollect data set.

Let's add two of these to the Dataflow.`,
    },
    datatableColumnsOutData: {
      value: ["transformation-3-columns-transformation-4-list", "transformation-3-columns-transformation-5-list"],
      title: "Test time",
      body: "Link the Datatables Columns to both Find Value's list input",
    },
    findValuesPattern: {
      anchor: "main-transformation-4-in-pattern",
      value: ["prop-pane", "argument-selection"],
      title: "Find values pattern",
      body: `Both of the Find value transformations are going to need their search patterns defined, to do this we are going to use a value binding.

Select the first one.`,
    },
    bindingTypeValue: {
      anchor: "binding-type-value",
      value: ["binding-type"],
      title: "Binding Type value",
      body: `By using this binding type we are saying we want to give this argument an absolute value.

Click it.`,
    },
    bindingTypeValueTextAndRegexp: {
      anchor: "binding-value",
      value: ["binding-value"],
      title: "Source value",
      body: "With this first argument we are looking for the latitude column, todo so we are going to use the regular expression `/^lat_/`.",
    },
    bindingTypeValueTextAndRegexpAgain: {
      anchor: "main-transformation-5-in-pattern",
      value: ["binding-value"],
      title: "Test time",
      body: "As with the first Find value transformation we want to set the second to an absolute value, except this time with the regular expression `/^long_/`.",
    },
    selectDataDestination: {
      anchor: "data-destinations",
      value: ["data-destinations"],
      title: "Data Destinations",
      body: `This transformations category is the opposite of the Data Sources category it contains transformations that pushes data to external sources.

Click to expand the list.`,
    },
    addUploadToMicroreact: {
      anchor: "upload-to-microreact",
      value: ["main-transformation/transformation-6"],
      title: "Upload to microreact",
      body: `This takes values that Microreact uses to make a new project, it then returns both the projects id and URL.

Let's add one!`,
    },
    uploadToMicroreactId: {
      anchor: "main-transformation-6-in-idField",
      value: ["binding-value"],
      title: "Upload to microreact's idField input",
      body: "This field is needed when the id of the data isn't, simply id, in this case it needs to have a value binding of `ec5_uuid`.",
    },
    uploadToMicroreactTimelineField: {
      anchor: "main-transformation-6-in-timelineField",
      value: ["binding-value"],
      title: "Upload to microreact's timelineField input",
      body: "One of Microreact's many superpowers is to use temporal data to step through data in a timeline, we want to know when each record was added so this argument needs a value binding of `created_at`.",
    },
    uploadToMicroreactTimelineFormat: {
      anchor: "main-transformation-6-in-timelineFormat",
      value: ["binding-value"],
      title: "Upload to microreact's timelineFormat input",
      body: "Epicollect outputs time data in the ISO 8601 format, so that Microreact can interpret these dates correctly we need to bind this value to `ISO 8601`.",
    },
    finalTest1: {
      value: ["transformation-1-slug-transformation-6-name"],
      title: "Test time (last one we promise) part 1/4",
      body: "Link the Epicollect project's **slug** to Microreact's **name**",
    },
    finalTest2: {
      value: ["transformation-2-csv-transformation-6-data"],
      title: "Test time (last one we promise) part 2/4",
      body: "Link the Datatable to csv's **csv** to Microreact's **data**",
    },
    finalTest3: {
      value: ["transformation-4-value-transformation-6-mapLatitude"],
      title: "Test time (last one we promise) part 3/4",
      body: "Link the Find value with the pattern value of \`/^lat_/\`'s **value** to Microreact's **mapLatitude**",
    },
    finalTest4: {
      value: ["transformation-5-value-transformation-6-mapLongitude"],
      title: "Test time (last one we promise) part 4/4",
      body: "Link the Find value with the pattern \`/^lat_/\`'s **value** to Microreact\s **mapLongitude**",
    },
    uploadToMicroreactUrl: {
      anchor: "main-transformation-6-out-url",
      value: ["prop-pane", "argument-selection"],
      title: "Last but not least",
      body: "We need to give this Dataflow an output, select the Upload to microreact's output URL.",
    },
    bindOutput: {
      anchor: "binding-type-output",
      value: ["binding-type-output"],
      title: "Dataflow outputs",
      body: `By checking this we are saying that we want the URL argument to be an output of this Dataflow, in this case, it will return the URL of the new Microreact project.

Note, outputs are 1:1 meaning an output can only be linked to one transformation a time.

Check the box.`,
    },
    debug: {
      anchor: "toggle-debug",
      value: ["prop-pane"],
      title: "Debug",
      body: `When build a dataflow the possibilities are endless so it\'s best practice to test a Dataflow before sharing/using it.

Click here to show the debug pane.`,
    },
    debugInputUrl: {
      anchor: "debug-input-Epicollect URL",
      value: ["debug-input-Epicollect URL"],
      title: "Add a Epicollect 5 project url",
      body: "As we are creating a Microreact project with longitude and latitude fields we should use an Epicollect project with geodata, the SJ DOLPHIN WATCH project: `https://five.epicollect.net/project/sj-dolphin-watch` which keeps track of dolphin sightings in the Channel Islands should do the trick.",
    },
    debugRun: {
      anchor: "debug-run",
      value: ["debug-success"],
      title: "The moment of truth",
      body: "Run the Dataflow!",
    },
    debugMeta: {
      anchor: "debug-meta",
      title: "The debug meta",
      body: "Any data about the run itself will be place here.",
    },
    debugInputs: {
      anchor: "debug-inputs",
      title: "The debug runs inputs",
      body: "All the inputted data will be shown here so you can see exactly what the Dataflow received for this debug run.",
    },
    debugOutputs: {
      anchor: "debug-outputs",
      title: "The debug runs outputs",
      body: "Once the Dataflow is successful the outputs of the debug run will be listed here.",
    },
    debugSteps: {
      anchor: "debug-steps",
      title: "The debug runs steps",
      body: `Each step also returns it's running time, inputs and outputs this is to give you greater granularity when testing.

Be warned there can be a lot of data here so it might take a moment.`,
    },
    debugClose: {
      anchor: "debug-close",
      value: ["prop-pane"],
      title: "Success!",
      body: "Now that we have successfully debugged this dataflow we can close the debugger.",
    },
    run: {
      anchor: "run",
      title: "Whats next?",
      body: "If you want to run the dataflow more generally click through to the run page.",
    },
    done: {
      title: "That's all folks!",
      body: "Thank you for using Dataflo, we can't wait to see what you do with it!",
    },
  },
  manifests: {
    editor: {
      progress: 0,
      index: 0,
      validators: {},
      stepsKeys: [
        // Dataflow meta
        "welcome",
        "name",
        "description",
        // Epicollect Project
        "openTransformations",
        "selectDataSource",
        "addEpicollect",
        "bindings",
        "bindingTypeInput",
        "bindingTypeInputNew",
        "selectInput",
        "inputName",
        "inputDescription",
        // Datatable to csv and Datatable Columns
        "openTransformations",
        "selectDatatables",
        "addDatatableToCsv",
        "addDatatableColumns",
        "epicollectOutData",
        "datatableToCsvInData",
        "datatableColumnsInData",
        // Find value x2
        "openTransformations",
        "selectList",
        "addFindValue",
        "datatableColumnsOutData",
        "findValuesPattern",
        "bindingTypeValue",
        "bindingTypeValueTextAndRegexp",
        "bindingTypeValueTextAndRegexpAgain",
        // Upload to Microreact
        "openTransformations",
        "selectDataDestination",
        "addUploadToMicroreact",
        "uploadToMicroreactId",
        "uploadToMicroreactTimelineField",
        "uploadToMicroreactTimelineFormat",
        "finalTest1",
        "finalTest2",
        "finalTest3",
        "finalTest4",
        "uploadToMicroreactUrl",
        "bindOutput",
        // Debug
        "debug",
        "debugInputUrl",
        "debugRun",
        "debugMeta",
        "debugInputs",
        "debugOutputs",
        "debugSteps",
        "debugClose",
        // Summary
        "run",
        "done",
      ],
    },
  },
});

export const actions = {
  setFirstIndex({ commit }) {
    commit("setIndex", 0);
    commit("setStep");
  },
  setNextIndex({ commit, state }) {
    commit("setIndex", (state.index + 1));
    commit("setStep");
  },
  setPrevIndex({ commit, state }) {
    commit("setIndex", (state.index - 1));
    commit("setStep");
  },
  setLastIndex({ commit, state }) {
    commit("setIndex", state.lastIndex);
    commit("setStep");
  },
  setIndex({ commit }, index) {
    commit("setIndex", index);
    commit("setStep");
  },
};

export const mutations = {
  init(state, mode) {
    const { manifests = {} } = state;
    const manifest = (typeof manifests[mode] !== "undefined")
      ? manifests[mode]
      : {
        stepsKeys: [],
      };
    state.index = 0;
    state.lastIndex = 0;
    state.maxIndex = manifest.stepsKeys.length;
    state.manifest = manifest;
  },
  setIsVisible(state, visibility) {
    state.isVisible = visibility;
  },
  setIndex(state, index) {
    const { manifest = {} } = state;
    const { stepsKeys = [] } = manifest;
    if (stepsKeys.length < (index + 1)) {
      return;
    }
    if (state.lastIndex < index) {
      state.lastIndex = index;
    }
    state.index = index;
    this.$cookies.set(
      "tutorial",
      {
        index,
      },
      {
        path: "/tutorial",
        maxAge: 60 * 60 * 24 * 7,
      },
    );
  },
  setStep(state) {
    const { index, manifest, steps } = state;
    const { stepsKeys = [] } = manifest;
    const stepsSet = stepsKeys.map((key) => ({
      key,
      ...steps[key],
    }));
    const step = (typeof stepsSet[index] !== "undefined")
      ? stepsSet[index]
      : {};

    if (typeof step.anchor === "undefined") {
      state.anchor.value = defaultAnchorBCR;
    }

    state.step = step;
  },
  setAnchorValue(state, payload) {
    const { key, value } = payload;
    state.values[key] = value;
  },
  setAnchorBCR(state, payload) {
    const { key, value } = payload;
    if (
      value.bottom !== state.anchor.value.bottom
      ||
      value.height !== state.anchor.value.height
      ||
      value.left !== state.anchor.value.left
      ||
      value.right !== state.anchor.value.right
      ||
      value.top !== state.anchor.value.top
      ||
      value.width !== state.anchor.value.width
      ||
      value.x !== state.anchor.value.x
      ||
      value.y !== state.anchor.value.y
      ||
      key !== state.anchor.key
    ) {
      if (
        value.bottom === 0
        &&
        value.height === 0
        &&
        value.left === 0
        &&
        value.right === 0
        &&
        value.top === 0
        &&
        value.width === 0
        &&
        value.x === 0
        &&
        value.y === 0
      ) {
        state.anchor = {
          key,
          value: defaultAnchorBCR,
        };
      } else {
        state.anchor = {
          key,
          value,
        };
      }
    }
  },
  setDragBCR(state, bcr) {
    state.anchor.value = {
      ...state.anchor.value,
      userSet: true,
      alignment: undefined,
      arrow: false,
      x: bcr.x - (state.boundary.width / 2),
      y: bcr.y - (state.boundary.height / 2),
    };
  },
  setTutorialBCR(state, payload) {
    state.tutorialBCR = payload;
  },
  setBoundary(state, payload) {
    state.boundary = payload;
  },
};

export const getters = {
  validators({ manifest = {}, validators = {}, index = 0 }) {
    const { stepsKeys = [] } = manifest;
    const validatorsSet = stepsKeys.map((key) => validators[key]);
    const validator = (typeof validatorsSet[index] !== "undefined")
      ? validatorsSet[index]
      : [];
    return validator;
  },
  isValid({ values = {} }, { validators = [] }) {
    return validators.every(({ tests = [], key = "" }) => {
      const value = values[key];
      if (typeof value === "undefined" || value === null) {
        return false;
      }
      return tests.every(({ fn = "", params = "" }) => {
        const test = validatorFns[fn];
        if (typeof test === "function") {
          return test.apply(null, [value, ...params]);
        }
        return false;
      });
    });
  },
  postValidators({ manifest = {}, postValidators = [], postValidatorManifests = {}, index = 0 }) {
    const { stepsKeys = [] } = manifest;
    const postValidatorsSet = stepsKeys.map((key) => postValidators[key]);
    const postValidator = postValidatorsSet[index] || [];
    return postValidator.map(({ key, payload }) => ({
      ...postValidatorManifests[key],
      payload,
    }));
  },
  stepAnchor: ({ step }) => step.anchor,
  stepValue: ({ step }) => step.value,
  tutorialUi({ anchor = {}, boundary, tutorialBCR, isVisible }) {
    const anchorBCR = anchor.value;

    const arrowMargin = (anchorBCR.arrow)
      ? 8
      : 0;

    const boundaryMargin = {
      left: 10,
      up: 10,
      right: 20,
      down: 10,
    };

    const tutorial = {
      opacity: (isVisible) ? 1 : 0,
      pointerEvents: (isVisible) ? "all" : "none",
      transform: {
        x: 0,
        y: 0,
      },
    };

    const arrow = {
      transform: {
        x: 0,
        y: 0,
      },
      opacity: (anchorBCR.arrow) ? 1 : 0,
      justifyContent: "center",
      alignItems: "center",
    };

    const pageCenter = {
      x: (boundary.width / 2) - boundary.scrollX,
      y: (boundary.height / 2) - boundary.scrollY,
    };

    if (anchorBCR.userSet) {
      tutorial.transform.x = anchorBCR.x;
      tutorial.transform.y = anchorBCR.y;
    } else {
      switch (anchorBCR.alignment) {
        case "left": {
          arrow.justifyContent = "flex-end";
          arrow.alignItems = "center";
          const anchorXLeft = anchorBCR.x - (tutorialBCR.width / 2) - arrowMargin;
          const anchorYCenter = anchorBCR.y + (anchorBCR.height / 2);
          tutorial.transform.x = anchorXLeft - pageCenter.x;
          tutorial.transform.y = anchorYCenter - pageCenter.y;
          break;
        }
        case "top": {
          arrow.justifyContent = "center";
          arrow.alignItems = "flex-end";
          const anchorXCenter = anchorBCR.x + (anchorBCR.width / 2);
          const anchorYTop = anchorBCR.y - (tutorialBCR.height / 2) - arrowMargin;
          tutorial.transform.x = anchorXCenter - pageCenter.x;
          tutorial.transform.y = anchorYTop - pageCenter.y;
          break;
        }
        case "right": {
          arrow.justifyContent = "flex-start";
          arrow.alignItems = "center";
          const anchorXLeft = anchorBCR.x + anchorBCR.width + (tutorialBCR.width / 2) + arrowMargin;
          const anchorYCenter = anchorBCR.y + (anchorBCR.height / 2);
          tutorial.transform.x = anchorXLeft - pageCenter.x;
          tutorial.transform.y = anchorYCenter - pageCenter.y;
          break;
        }
        case "bottom": {
          arrow.justifyContent = "center";
          arrow.alignItems = "flex-start";
          const anchorXCenter = anchorBCR.x + (anchorBCR.width / 2);
          const anchorYBottom = anchorBCR.y + anchorBCR.height + (tutorialBCR.height / 2) + arrowMargin;
          tutorial.transform.x = anchorXCenter - pageCenter.x;
          tutorial.transform.y = anchorYBottom - pageCenter.y;
          break;
        }
      }
    }
    switch (anchorBCR.alignment) {
      case "top":
      case "bottom": {
        const anchorXCenter = anchorBCR.x + (anchorBCR.width / 2);
        // Note: the next bit wont work with the - ScrollX at the start of this getter.
        const startX = (anchorXCenter - (tutorialBCR.width / 2));
        const endX = (anchorXCenter + (tutorialBCR.width / 2));
        const pageStart = 0;
        if (pageStart > startX) { // too far left
          const newX = pageStart - pageCenter.x + (tutorialBCR.width / 2) + boundaryMargin.left;
          const diff = tutorial.transform.x - newX;
          tutorial.transform.x = newX;
          arrow.transform.x = diff;
        }
        if (boundary.width < endX) { // too far right
          const newX = pageCenter.x - (tutorialBCR.width / 2) - boundaryMargin.right;
          const diff = tutorial.transform.x - newX;
          tutorial.transform.x = newX;
          arrow.transform.x = diff;
        }
        break;
      }
      case "left":
      case "right": {
        const anchorXCenter = anchorBCR.y + (anchorBCR.height / 2);
        // Note: the next bit wont work with the - ScrollX at the start of this getter.
        const startY = (anchorXCenter - (tutorialBCR.height / 2));
        const endY = (anchorXCenter + (tutorialBCR.height / 2));
        const pageStart = 0;
        // TODO: redo as the calc is off sometimes
        if (pageStart > startY) { // too far up
          const top = (pageStart - pageCenter.y);
          const newX = top + (tutorialBCR.height / 2) - (anchorBCR.height / 2) + boundaryMargin.up;
          const diff = tutorial.transform.y - newX;
          tutorial.transform.y = newX;
          arrow.transform.y = diff;
        }
        if (boundary.height < endY) { // too far down
          const newX = pageCenter.y - (tutorialBCR.height / 2) + (anchorBCR.height / 2) - boundaryMargin.down;
          const diff = tutorial.transform.y - newX;
          tutorial.transform.y = newX;
          arrow.transform.y = diff;
        }
        break;
      }
      default:
        break;
    }
    return {
      tutorial: {
        ...tutorial,
        transform: `translate(${tutorial.transform.x}px, ${tutorial.transform.y}px)`,
      },
      arrow: {
        ...arrow,
        transform: `translate(${arrow.transform.x}px, ${arrow.transform.y}px)`,
      },
    };
  },
};
