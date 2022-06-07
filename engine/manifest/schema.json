{
  "definitions": {},
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "http://data-flo.io/dataflow.json",
  "type": "object",
  "title": "The Root Schema",
  "required": [
    "input",
    "output",
    "transform",
    "version"
  ],
  "properties": {
    "input": {
      "$id": "#/properties/input",
      "type": "array",
      "title": "The Input Schema",
      "items": {
        "$id": "#/properties/input/items",
        "type": "object",
        "title": "The Items Schema",
        "required": [
          "isRequired",
          "name",
          "type"
        ],
        "properties": {
          "isRequired": {
            "$id": "#/properties/input/items/properties/isRequired",
            "type": "boolean",
            "title": "The isRequired Schema",
            "default": true
          },
          "isSecret": {
            "$id": "#/properties/input/items/properties/isSecret",
            "type": "boolean",
            "title": "The isSecret Schema",
            "default": false
          },
          "ui": {
            "$id": "#/properties/input/items/properties/ui",
            "type": "object",
            "title": "The Ui Schema",
            "required": [
              "x",
              "y"
            ],
            "properties": {
              "x": {
                "$id": "#/properties/input/items/properties/ui/properties/x",
                "type": "integer",
                "title": "The X Schema"
              },
              "y": {
                "$id": "#/properties/input/items/properties/ui/properties/y",
                "type": "integer",
                "title": "The Y Schema"
              }
            }
          },
          "name": {
            "$id": "#/properties/input/items/properties/name",
            "type": "string",
            "title": "The Name Schema",
            "default": "",
            "examples": [
              "input-file"
            ],
            "pattern": "^(.*)$"
          },
          "type": {
            "$id": "#/properties/input/items/properties/type",
            "type": "string",
            "enum": [
              "boolean",
              "datatable",
              "date",
              "file",
              "graph",
              "integer",
              "list",
              "map",
              "number",
              "regex",
              "text",
              "url"
            ],
            "title": "The Type Schema",
            "examples": [
              "boolean",
              "datatable",
              "date",
              "file",
              "graph",
              "integer",
              "list",
              "map",
              "number",
              "regex",
              "text",
              "url"
            ]
          },
          "description": {
            "$id": "#/properties/input/items/properties/description",
            "type": "string",
            "title": "The Description Schema",
            "default": "",
            "examples": [
              "A `.csv` file."
            ],
            "pattern": "^(.*)$"
          },
          "default": {
            "$id": "#/properties/input/items/properties/default",
            "type": [
              "object",
              "array",
              "boolean",
              "string",
              "number",
              "integer",
              "null"
            ],
            "title": "The Default Schema",
            "default": null
          }
        }
      }
    },
    "output": {
      "$id": "#/properties/output",
      "type": "array",
      "title": "The Output Schema",
      "items": {
        "$id": "#/properties/output/items",
        "type": "object",
        "title": "The Items Schema",
        "required": [
          "argument",
          "name",
          "transformation",
          "type"
        ],
        "properties": {
          "ui": {
            "$id": "#/properties/output/items/properties/ui",
            "type": "object",
            "title": "The Ui Schema",
            "required": [
              "x",
              "y"
            ],
            "properties": {
              "x": {
                "$id": "#/properties/output/items/properties/ui/properties/x",
                "type": "integer",
                "title": "The X Schema"
              },
              "y": {
                "$id": "#/properties/output/items/properties/ui/properties/y",
                "type": "integer",
                "title": "The Y Schema"
              }
            }
          },
          "argument": {
            "$id": "#/properties/output/items/properties/argument",
            "type": "string",
            "title": "The Argument Schema",
            "pattern": "^(.*)$"
          },
          "description": {
            "$id": "#/properties/output/items/properties/description",
            "type": "string",
            "title": "The Description Schema",
            "pattern": "^(.*)$"
          },
          "name": {
            "$id": "#/properties/output/items/properties/name",
            "type": "string",
            "title": "The Name Schema",
            "default": "",
            "examples": [
              "output-file"
            ],
            "pattern": "^(.*)$"
          },
          "transformation": {
            "$id": "#/properties/output/items/properties/transformation",
            "type": "string",
            "title": "The Transformation Schema",
            "pattern": "^(.*)$"
          },
          "type": {
            "$id": "#/properties/input/items/properties/type",
            "type": "string",
            "enum": [
              "boolean",
              "datatable",
              "date",
              "file",
              "graph",
              "integer",
              "list",
              "map",
              "number",
              "regex",
              "text",
              "url"
            ],
            "title": "The Type Schema",
            "examples": [
              "boolean",
              "datatable",
              "date",
              "file",
              "graph",
              "integer",
              "list",
              "map",
              "number",
              "regex",
              "text",
              "url"
            ]
          }
        }
      }
    },
    "transform": {
      "$id": "#/properties/transform",
      "type": "array",
      "title": "The Transform Schema",
      "items": {
        "$id": "#/properties/transform/items",
        "type": "object",
        "title": "The Items Schema",
        "required": [
          "binding",
          "name",
          "type"
        ],
        "properties": {
          "ui": {
            "$id": "#/properties/transform/items/properties/ui",
            "type": "object",
            "title": "The Ui Schema",
            "required": [
              "x",
              "y"
            ],
            "properties": {
              "x": {
                "$id": "#/properties/transform/items/properties/ui/properties/x",
                "type": "integer",
                "title": "The X Schema"
              },
              "y": {
                "$id": "#/properties/transform/items/properties/ui/properties/y",
                "type": "integer",
                "title": "The Y Schema"
              }
            }
          },
          "binding": {
            "$id": "#/properties/transform/items/properties/binding",
            "type": "array",
            "title": "The Binding Schema",
            "items": {
              "$id": "#/properties/transform/items/properties/binding/items",
              "type": "object",
              "title": "The Items Schema",
              "required": [
                "target",
                "type"
              ],
              "properties": {
                "target": {
                  "$id": "#/properties/transform/items/properties/binding/items/properties/target",
                  "type": "string",
                  "title": "The Target Schema",
                  "pattern": "^(.*)$"
                },
                "type": {
                  "$id": "#/properties/transform/items/properties/binding/items/properties/type",
                  "type": "string",
                  "enum": [
                    "input",
                    "transformation",
                    "value"
                  ],
                  "title": "The Type Schema"
                }
              },
              "oneOf": [
                {
                  "type": "object",
                  "title": "Input Binding Schema",
                  "required": [
                    "input",
                    "type",
                  ],
                  "properties": {
                    "input": {
                      "type": "string",
                      "title": "The Input Schema",
                      "pattern": "^(.*)$"
                    },
                    "type": {
                      "type": "string",
                      "title": "The Type Schema",
                      "enum": [
                        "input"
                      ]
                    }
                  }
                },
                {
                  "type": "object",
                  "title": "Transformation Binding Schema",
                  "required": [
                    "argument",
                    "transformation",
                    "type"
                  ],
                  "properties": {
                    "argument": {
                      "type": "string",
                      "title": "The Argument Schema",
                      "pattern": "^(.*)$"
                    },
                    "type": {
                      "type": "string",
                      "title": "The Type Schema",
                      "enum": [
                        "transformation"
                      ]
                    },
                    "transformation": {
                      "type": "string",
                      "title": "The Transformation Schema",
                      "pattern": "^(.*)$"
                    }
                  }
                },
                {
                  "type": "object",
                  "title": "Value Binding Schema",
                  "required": [
                    "type",
                    "value"
                  ],
                  "properties": {
                    "type": {
                      "type": "string",
                      "title": "The Type Schema",
                      "enum": [
                        "value"
                      ]
                    },
                    "value": {
                      "type": [
                        "object",
                        "array",
                        "boolean",
                        "string",
                        "number",
                        "integer",
                        "null"
                      ],
                      "title": "The Value Schema"
                    }
                  }
                }
              ]
            }
          },
          "name": {
            "$id": "#/properties/transform/items/properties/name",
            "type": "string",
            "title": "The Name Schema",
            "default": "",
            "examples": [
              "transformation-1"
            ],
            "pattern": "^(\\S+)$"
          },
          "type": {
            "$id": "#/properties/transform/items/properties/type",
            "type": "string",
            "enum": [
              "adaptor",
              "dataflow"
            ],
            "title": "The Type Schema"
          },
          "description": {
            "$id": "#/properties/transform/items/properties/description",
            "type": [
              "null",
              "string"
            ],
            "title": "The Description Schema",
            "pattern": "^(.*)$"
          }
        },
        "oneOf": [
          {
            "type": "object",
            "title": "Adaptor Transform Schema",
            "required": [
              "adaptor"
            ],
            "properties": {
              "adaptor": {
                "$id": "#/properties/transform/items/properties/adaptor",
                "type": "string",
                "enum": [
                  "append-to-list",
                  "ariba-file",
                  "change-column-case",
                  "columns-concatenation",
                  "concatenate-text",
                  "csv-file-to-datatable",
                  "csv-to-datatable",
                  "datatable-columns",
                  "datatable-to-csv",
                  "datatable-to-graph",
                  "datatable-to-list",
                  "dbf-file",
                  "dot-to-graph",
                  "dropbox-file",
                  "epicollect-project",
                  "extend-datatable",
                  "figshare-file",
                  "file-to-text",
                  "fill-series",
                  "filter-list",
                  "filter-rows",
                  "find-value",
                  "force-directed-layout",
                  "format-date-column",
                  "forward-geocoding",
                  "ftp-file",
                  "google-drive-file",
                  "google-spreadsheet",
                  "graph-to-dot",
                  "join-datatables",
                  "list-element",
                  "list-to-datatable",
                  "merge-lists",
                  "merge-rows",
                  "microreact-project",
                  "mysql-database",
                  "prepend-to-list",
                  "rename-column",
                  "rename-columns",
                  "replace-column-values",
                  "reverse-geocoding",
                  "search-text",
                  "slice-list",
                  "sort-list",
                  "split-date-column",
                  "split-text",
                  "spreadsheet-file",
                  "sql-server-database",
                  "text-to-file",
                  "update-google-spreadsheet",
                  "upload-to-microreact",
                  "url-builder",
                  "whonet-epicollect-form",
                  "whonet-file",
                  "whonet-lab-file"                  
                ],
                "title": "The Adaptor Schema"
              }
            }
          },
          {
            "type": "object",
            "title": "Adaptor Transform Schema",
            "required": [
              "dataflow"
            ],
            "properties": {
              "dataflow": {
                "$id": "#/properties/transform/items/properties/adaptor",
                "type": "string",
                "title": "The Dataflow Schema",
                "pattern": "^(.*)$"
              }
            }
          }
        ]
      }
    },
    "version": {
      "$id": "#/properties/version",
      "type": "integer",
      "title": "The Version Schema",
      "minimum": 0.0,
      "maximum": 2.0
    }
  }
}