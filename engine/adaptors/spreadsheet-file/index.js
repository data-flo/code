const XLSX = require("xlsx");

module.exports = async function (args, context) {
  const filePath = await context.utils.file.path(args.file);
  const workbook = XLSX.readFile(
    filePath, {
      raw: true,
    });
  if (args.sheetname && !workbook.SheetNames.includes(args.sheetname)) {
    throw new Error(`Workbook does not include a sheet named '${args.sheetname}'`);
  }
  const worksheet = workbook.Sheets[args.sheetname || workbook.SheetNames[0]];
  const range = (Number.parseInt(args.range, 10) - 1) || args.range || undefined;
  const rows = XLSX.utils.sheet_to_json(
    worksheet,
    {
      range,
      raw: false,
      header: 0,
    }
  );
  const [ columns ] = XLSX.utils.sheet_to_json(
    worksheet,
    {
      range,
      header: 1,
    }
  );
  return {
    data: {
      columns,
      rows,
    },
  };
};
