/* eslint array-bracket-spacing: 0 */

const DBFFile = require("dbffile");

function getOrganismLookup(organismData) {
  const list = {};
  for (const row of organismData.rows) {
    if (row.COMMON === "X") {
      list[row.ORG] = row;
    }
  }
  return list;
}

function getMappedFieldName(fieldNames, fieldName) {
  for (let pad = 2; pad <= 3; pad++) {
    const postfix = `_${fieldName.substring(0, 20 - pad)}`;
    const fullFieldName = fieldNames.find((x) => x.endsWith(postfix));
    return (fullFieldName);
  }
  return null;
}

function convertToShotcode(rawValue) {
  if (rawValue) {
    const trimIndex = rawValue.indexOf(" - ");
    return rawValue.substring(0, trimIndex);
  }
  return null;
}

function convertToDate(rawValue) {
  if (rawValue && (/^\d{2}\/\d{2}\/\d{4}$/).test(rawValue)) {
    const [day, month, year] = rawValue.split("/");
    return new Date(
      Number.parseInt(year, 10),
      Number.parseInt(month, 10) - 1,
      Number.parseInt(day, 10),
    );
  }
  return null;
}

function getAntibioticsFieldMap(antibioticData, allFieldNames) {
  const fieldMap = [];
  for (const antibiotic of antibioticData.rows) {
    const regex = new RegExp(`^\\d+_${antibiotic.code}__`);
    const field = allFieldNames.find((x) => regex.test(x));
    if (field) {
      fieldMap.push([field, antibiotic.code]);
    } else {
      throw new Error(`Cannot find field for antibiotic ${antibiotic.code}`);
    }
  }
  return fieldMap;
}

module.exports = async function (args, context) {
  const fieldNames = args.data.columns;
  const antibioticFields = getAntibioticsFieldMap(args.antibiotics, fieldNames);
  const organismLookup = getOrganismLookup(args.organisms);
  const rows = [];

  const fieldMap = [
    // Origin
    [ "PATIENT_ID", getMappedFieldName(fieldNames, "Identification_number"), "" ],
    [ "FIRST_NAME", getMappedFieldName(fieldNames, "First_name"), "" ],
    [ "MID_NAME", getMappedFieldName(fieldNames, "Middle_name"), "" ],
    [ "LAST_NAME", getMappedFieldName(fieldNames, "Last_name"), "" ],
    [ "SEX", getMappedFieldName(fieldNames, "Sex"), "" ],
    [ "AGE", getMappedFieldName(fieldNames, "Age"), "" ],
    [ "DATE_BIRTH", getMappedFieldName(fieldNames, "Date_of_birth"), "date" ],
    [ "PAT_TYPE", getMappedFieldName(fieldNames, "Age category"), "" ],
    [ "DATE_ADMIS", getMappedFieldName(fieldNames, "Date_of_admission"), "date" ],
    [ "NOSOCOMIAL", getMappedFieldName(fieldNames, "Nosocomial_infection"), "" ],
    [ "DIAGNOSIS", getMappedFieldName(fieldNames, "Diagnosis"), "" ],
    // Location
    [ "WARD", getMappedFieldName(fieldNames, "Location"), "code" ],
    [ "INSTITUT", getMappedFieldName(fieldNames, "Institution"), "code" ],
    [ "DEPARTMENT", getMappedFieldName(fieldNames, "Department"), "code" ],
    [ "WARD_TYPE", getMappedFieldName(fieldNames, "Location_type"), "code" ],
    // Specimen
    [ "SPEC_NUM", getMappedFieldName(fieldNames, "Specimen_number"), "" ],
    [ "SPEC_DATE", getMappedFieldName(fieldNames, "Specimen_date"), "date" ],
    [ "SPEC_TYPE", getMappedFieldName(fieldNames, "Specimen_type"), "" ],
    // Microbiology
    [ "ORGANISM", getMappedFieldName(fieldNames, "Organism"), "code" ],
    [ "BETA_LACT", getMappedFieldName(fieldNames, "Betalactamse"), "code" ],
    [ "MRSA", getMappedFieldName(fieldNames, "MRSA"), "code" ],
    [ "MRSA", getMappedFieldName(fieldNames, "MRSA"), "code" ],
    [ "ESBL", getMappedFieldName(fieldNames, "ESBL"), "code" ],
    [ "URINECOUNT", getMappedFieldName(fieldNames, "Urine_colony_count"), "" ],
    [ "SEROTYPE", getMappedFieldName(fieldNames, "Serotype"), "code" ],
    [ "CARBAPENEM", getMappedFieldName(fieldNames, "Carbapenemase"), "code" ],
    [ "INDUC_CLI", getMappedFieldName(fieldNames, "Inducible_clindamycin_resistance"), "code" ],
    [ "CARBAPENEM", getMappedFieldName(fieldNames, "Carbapenemase"), "code" ],
    [ "CARBAPENEM", getMappedFieldName(fieldNames, "Carbapenemase"), "code" ],
    [ "CARBAPENEM", getMappedFieldName(fieldNames, "Carbapenemase"), "code" ],
    // Other
    [ "COMMENT", getMappedFieldName(fieldNames, "Comment"), "" ],
    [ "X_REFERRED", getMappedFieldName(fieldNames, "Referral_Isolates"), "" ],
    [ "X_RECNUM", getMappedFieldName(fieldNames, "Record_Numner"), "" ],
    [ "X_INDCLIRE", getMappedFieldName(fieldNames, "ICR"), "" ],
    [ "X_MRSAMRSE", getMappedFieldName(fieldNames, "MECA"), "" ],
    [ "X_ENTBAC", getMappedFieldName(fieldNames, "AMPC"), "" ],
    [ "X_MRSE", getMappedFieldName(fieldNames, "MRSE"), "" ],
    [ "X_CARB", getMappedFieldName(fieldNames, "CARB"), "" ],
    [ "STOCK_NUM", getMappedFieldName(fieldNames, "Stock_Number"), "" ],
    [ "MBL", getMappedFieldName(fieldNames, "MBL"), "" ],
  ];

  for (const entry of args.data.rows) {
    const row = {
      COUNTRY_A: args.countryCode,
      LABORATORY: args.laboratoryCode,
    };
    for (const [target, source, type] of fieldMap) {
      const value = entry[source];
      if (type === "date") {
        row[target] = convertToDate(value);
      } else if (type === "code") {
        row[target] = convertToShotcode(value);
      } else {
        row[target] = value;
      }
    }
    for (const [source, target] of antibioticFields) {
      row[target] = entry[source];
    }
    row.ORG_TYPE = organismLookup[row.ORGANISM].GRAM;
    rows.push(row);
  }

  const dbf = await DBFFile.open(args.dbf.path);

  const patientIds = new Set();
  for (let index = 0; index < dbf.recordCount; index++) {
    const records = await dbf.readRecords(1);
    patientIds.add(records[0].PATIENT_ID);
  }

  await dbf.append(rows.filter((x) => !patientIds.has(x.PATIENT_ID)));

  const outputFile = context.utils.file.from(
    args.dbf,
    "data.dbf",
    "application/dbf"
  );

  return {
    dbf: outputFile,
  };
};
