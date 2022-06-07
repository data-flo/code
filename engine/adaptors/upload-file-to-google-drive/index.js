const { google } = require("googleapis");

const urlToId = require("../create-google-drive-folder/utils/folder-url-to-id");

async function getClient() {
  return google.auth.getClient({
    scopes: [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/drive.appdata",
      "https://www.googleapis.com/auth/spreadsheets",
    ],
  });
}

function idToUrl(folderId) {
  return `https://drive.google.com/file/d/${folderId}`;
}

module.exports = async function (args) {
  let fileId;
  if (args["file url"]) {
    fileId = urlToId(args["file url"]);
  }
  const authClient = await getClient();
  const drive = google.drive({ version: "v3", auth: authClient });

  try {
    const method = fileId ? "update" : "create";
    const parents = fileId ? undefined : [ urlToId(args.folder) ];
    const response = await drive.files[method]({
      resource: {
        name: args.name || args.file.name || "Untitled",
        parents,
      },
      fileId,
      media: {
        mimeType: args.file.mediaType || "application/octet-stream",
        body: args.file,
      },
      fields: "id",
    });

    return {
      id: response.data.id,
      url: idToUrl(response.data.id),
    };
  }
  catch (error) {
    if (error.code === 404 && error.message.startsWith("File not found: ")) {
      throw new Error(`Cannot access Google Drive folder ${args.folder}. Make sure it exists and it has been shared with ${authClient.email}.`);
    }
    else {
      throw error;
    }
  }
};
