module.exports = function (slug, mapIndex, format) {
  return `https://five.epicollect.net/api/export/entries/${slug}?format=${format}&map_index=${mapIndex}`;
};
