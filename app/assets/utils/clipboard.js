// See: https://github.com/DaveMBush/CrossBrowserCopyAndPaste

function copy(data) {
  const text = 
    (typeof data === "string") ?
      data :
      JSON.stringify(
        data,
        null,
        2
      );
  const textArea = document.createElement("textarea");
  textArea.setAttribute("style", "width:1px;border:0;opacity:0;");
  document.body.appendChild(textArea);
  textArea.value = text;
  textArea.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(textArea);
  return ok;
}

export default {
  copy,
};
