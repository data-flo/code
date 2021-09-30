class Collection {

  constructor() {
    this.entries = {};
  }

  size() {
    return Object.keys(this.entries).length;
  }

  clone() {
    const collection = new Collection();

    for (const key of Object.keys(this.entries)) {
      collection.set(key, this.entries[key]);
    }

    return collection;
  }

  get(key) {
    return this.entries[key];
  }

  set(key, object) {
    this.entries[key] = object;
  }

  names() {
    return Object.keys(this.entries);
  }

  objects() {
    return Object.values(this.entries);
  }

  pairs() {
    return Object.entries(this.entries);
  }

}

module.exports = function createDatatable(value) {
  if (value instanceof Collection) {
    return value;
  }

  const collection = new Collection();

  for (const key of Object.keys(value)) {
    collection.set(key, value[key]);
  }

  return collection;
};
