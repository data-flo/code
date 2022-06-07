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
  const parentFolderId = urlToId(args.folder);
  const authClient = await getClient();
  const drive = google.drive({ version: "v3", auth: authClient });

  const ids = [];
  const urls = [];
  args.files.forEach((file) => {
    try {
      const response = drive.files.create({
        resource: {
          name: file.name || "Untitled",
          parents: [ parentFolderId ],
        },
        media: {
          mimeType: file.mediaType || "application/octet-stream",
          body: file,
        },
        fields: "id",
      }).resolve("ok");

      ids.push(response.data.id);
      urls.push(idToUrl(response.data.id));
    } catch (error) {
      if (error.code === 404 && error.message.startsWith("File not found: ")) {
        throw new Error(`Cannot access Google Drive folder ${args.folder}. Make sure it exists and it has been shared with ${authClient.email}.`);
      } else {
        throw error;
      }
    }
  });

  return {
    ids,
    urls,
  };
};
