const IniConfigParser = require("ini-config-parser");

function dropdownOptions(dict, context, keyIndex = 0, titleIndex = 1) {
  const list = (
    Object.keys(dict)
      .map(
        (key) => {
          const [fields] = context.utils.data.parseCsv(key, { headers: false });
          return {
            code: fields[keyIndex],
            name: fields[titleIndex],
          };
        }
      )
  );
  return {
    rows: list,
    columns: [
      "code",
      "name",
    ],
  };
}

function getAntibiotics(antibioticsSection, context) {
  const list = [];
  for (const [key, value] of Object.entries(antibioticsSection)) {
    if (value === "") {
      const [[code, info]] = context.utils.data.parseCsv(key, { headers: false });
      const [name, , test] = info.split("_");
      list.push({
        code,
        name,
        test,
      });
    }
  }
  return {
    rows: list,
    columns: [
      "code",
      "name",
      "test",
    ],
  };
}

module.exports = async function (args, context) {
  const lab = IniConfigParser.parse(args.lab);
  return {
    laboratoryName: lab["WHONET Configuration File"]["Laboratory Name"],
    laboratoryType: lab["WHONET Configuration File"]["Laboratory Type"],
    wards: dropdownOptions(lab.Wards, context),
    departments: dropdownOptions(lab.Departments, context),
    institutions: dropdownOptions(lab.Institutions, context),
    antibiotics: getAntibiotics(lab.Antibiotics, context),
  };
};
