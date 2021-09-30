module.exports = async function (projectUrl, clientId, clientSecret, context) {
  if (!clientId || !clientSecret) {
    throw new Error("Both `client id` and `client secret` are required.");
  }

  const url = "https://five.epicollect.net/api/oauth/token";
  const data = {
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  };
  const response = await context.request.postHttp(url, data);
  const token = response.access_token;

  return { Authorization: `Bearer ${token}` };
};
