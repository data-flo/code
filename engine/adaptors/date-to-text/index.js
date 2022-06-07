const moment = require("moment");

module.exports = function (args) {
  const momentValue = moment(args.value || new Date());

  if (momentValue.isValid()) {
    if (args.locale) {
      momentValue.locale(args.locale);
    }
    return {
      text: (
        (args.format === "ISO 8601")
          ?
          momentValue.format()
          :
          momentValue.format(args.format)
      ),
    };
  }

  return {
    text: null,
  };
};
