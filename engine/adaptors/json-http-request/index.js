const axios = require("axios");

module.exports = async function uploadToMicroreact(args, context) {
  const headers = {
    "Content-Type": "application/json",
  };
  if (args.headers) {
    for (const [key, value] of args.headers.entries()) {
      headers[key] = value;
    }
  }

  let response;
  const responses = [];

  if (args["multi request"]) {
    const requests = args.data.get(args["multi request"]);
    if (Array.isArray(requests)) {
      for (const data of requests) {
        try {
          response = await (
            axios({
              url: args.url,
              method: args.method,
              headers,
              data,
            })
          );
          responses.push(response);
        }
        catch (err) {
          response = err.response;
          break;
        }
      }
    }
    else {
      throw new Error("Invalid value for `multi request`.");
    }
  }
  else {
    response = await (
      axios({
        url: args.url,
        method: args.method,
        headers,
        data: args.data.entries,
      })
        .catch((err) => err.response)
    );
  }

  return {
    "status code": response.status,
    "status text": response.statusText,
    headers: response.headers,
    data: response.data || {},
    responses,
  };
};
