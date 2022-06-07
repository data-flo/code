const checkSheetSize = require("./utils/check-sheet-size");
const getClient = require("../google-spreadsheet/utils/get-client");
const getSheetData = require("../google-spreadsheet/utils/get-sheet-data");
const getSheetProperties = require("../google-spreadsheet/utils/get-sheet-properties");
const getSheetRange = require("../google-spreadsheet/utils/get-sheet-range");
const mergeData = require("./utils/merge-data");
const rewriteUrl = require("../google-spreadsheet/utils/rewrite-url");
const updateSheetData = require("./utils/update-sheet-data");

module.exports = async function (args) {
  if (!args.data.hasColumn(args["id column"])) {
    throw new Error(`datatable does not include a column named '${args["id column"]}'`);
  }

  const spreadsheetId = rewriteUrl(args.url);
  const authClient = await getClient();
  try {
    const sheetProps = await getSheetProperties(authClient, spreadsheetId, args.sheetname);
    const range = getSheetRange(sheetProps);
    const sheetData = await getSheetData(authClient, spreadsheetId, range.address);

    const [ cellUpdates, updatedRowIds, createdRowId, skippedRowIds ] = mergeData(sheetData, args);

    await checkSheetSize(authClient, spreadsheetId, sheetProps, cellUpdates, args["resize sheet"]);

    const updated = await updateSheetData(authClient, spreadsheetId, sheetProps, cellUpdates);

    return {
      "updated cells": updated.totalUpdatedCells || 0,
      updated: updatedRowIds,
      created: createdRowId,
      skipped: skippedRowIds,
      data: args.data,
    };
  }
  catch (error) {
    if (error.message === "The caller does not have permission") {
      throw new Error(`Cannot access Google Spreadsheet ${args.url}. Make sure it has been shared with ${authClient.email}.`);
    }
    throw error;
  }
};
