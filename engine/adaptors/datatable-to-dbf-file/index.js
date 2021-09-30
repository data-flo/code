const DBFFile = require("dbffile");

module.exports = async function (args, context) {
  const fieldDescriptors = [];
  for (const [ key, value ] of args.columns.entries()) {
    const [ type, size ] = value.split(" ");
    fieldDescriptors.push({
      name: key,
      type,
      size: size ? parseInt(size, 10) : undefined,
    });
  }

  const path = await context.utils.file.tmp({ postfix: ".dbf" });

  const dbf = await DBFFile.create(path, fieldDescriptors);
  await dbf.append(args.data.rows);

  const file = context.utils.file.from(path);
  file.name = args.filename;
  file.mediaType = "application/dbf";

  return {
    dbf: file,
  };
};
