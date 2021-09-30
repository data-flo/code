const fs = require("fs");

module.exports = {
  log(msg) {
    const parsedMsg = (typeof msg === "object") ? JSON.stringify(msg, null, 4) : msg;
    const DateTime = new Date();
    const output = `[${DateTime}] ${parsedMsg}\n`;
    fs.writeFile("./../api.log", output, {
      flag: "a+",
    }, (err) => {
      if (err) throw err;
    });
  },
};
