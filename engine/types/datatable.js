const Papaparse = require("papaparse");

class Datatable {

  constructor(columns, rows) {
    this.columns = [];
    for (const column of columns) {
      this.columns.push(column.trim());
    }
    this.rows = [];
    for (const rawRow of rows) {
      const row = {};
      for (const column of columns) {
        const value = rawRow[column];
        if (typeof value === "string") {
          row[column.trim()] = value.trim();
        }
        else {
          row[column.trim()] = value;
        }
      }
      this.rows.push(row);
    }
  }

  size() {
    return this.rows.length;
  }

  addColumn(columnName, valueGetter) {
    if (!this.columns.includes(columnName)) {
      this.columns.push(columnName);
    }

    for (const row of this.rows) {
      row[columnName] = valueGetter.call(row, row);
    }
    return this;
  }

  clone() {
    return new Datatable(this.columns, this.rows);
  }

  hasColumn(columnName) {
    return this.columns.includes(columnName);
  }

  getColumn(columnName) {
    if (!this.columns.includes(columnName)) {
      throw new Error(`datatable does not include a column named ${columnName}. Columns are: ${this.columns}.`);
    }
    return columnName;
  }

  forEachRow(callback) {
    return this.rows.forEach(callback);
  }

  map(callback) {
    return this.rows.map(callback);
  }

}

module.exports = function createDatatable(value) {
  if (value instanceof Datatable) {
    return value;
  }

  if (typeof value === "string") {
    const results = Papaparse.parse(
      value.replace(/\r\n/g, "\n"),
      {
        skipEmptyLines: true,
        header: true,
      }
    );
    if (results.errors && results.errors.length) {
      throw results.errors;
    }
    return new Datatable(results.meta.fields, results.data);
  }

  if (Array.isArray(value)) {
    return new Datatable(
      value.length ? Object.keys(value[0]) : [],
      value
    );
  }

  if (!value.columns) {
    throw new Error(`Cannot convert value '${value}' to datatable: missing columns.`);
  }

  if (!value.rows) {
    throw new Error(`Cannot convert value '${value}' to datatable: missing rows.`);
  }

  return new Datatable(value.columns, value.rows);
};
