const sqlite3 = require('sqlite3')

class DB {
  constructor() {
    this.db = new sqlite3.Database('demo-app.db', (err) => {
      if (err) {
        console.log('[DB] could not connect to database ', err)
      } else {
        console.log('[DB] Connected to database')
      }
    })
  }

  shutdown() {
    this.db.close();
    console.log('[DB.shutdown]');
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          resolve(err)
        }
      })
    });
  }

  /*setupEmployeeTable() {
    const query = `CREATE TABLE IF NOT EXISTS employee (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        first_name TEXT,
        last_name TEXT,
        company_email TEXT,
        personal_email TEXT,
        phone TEXT,
        date_of_birth TEXT,
        start_date TEXT,
        term_date TEXT,
        department TEXT,
        manager INTEGER,
        salary INTEGER,
        medical TEXT,
        profile_picture BLOB,
        dl_picture BLOB,
        ssn TEXT,
        status INTEGER,
        FOREIGN KEY(manager) REFERENCES employee(id))`

    this.db.run(query, (err) => {
      if (err) {
        // table already created
        console.log('[DB.setupEmployeeTable] table exists')
      } else {
        console.log('[DB.setupEmployeeTable] table created')
        const idxquery = `CREATE UNIQUE INDEX IF NOT EXISTS idx_employee_pemail
          ON employee (personal_email)`

        this.db.run(idxquery)
        console.log('[DB.setupEmployeeTable] index created')
      }
    });
  }*/

  async setupEmployeeTable() {
    const query = `CREATE TABLE employee (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        first_name TEXT,
        last_name TEXT,
        company_email TEXT,
        personal_email TEXT,
        phone TEXT,
        date_of_birth TEXT,
        start_date TEXT,
        term_date TEXT,
        department TEXT,
        manager INTEGER,
        salary INTEGER,
        medical TEXT,
        profile_picture BLOB,
        dl_picture BLOB,
        ssn TEXT,
        status INTEGER,
        FOREIGN KEY(manager) REFERENCES employee(id))`

    try {
      await this.run(query)
    } catch (e) {
      console.log('[DB.setupEmployeeTable] datastore error')
      return false;
    }

    const idxquery = `CREATE UNIQUE INDEX IF NOT EXISTS idx_employee_pemail
        ON employee (personal_email)`

    try {
      await this.run(idxquery);
    } catch (e) {
      console.log('[DB.setupEmployeeTable] idx creation error')
      return false
    }
    return true;
  }
}

module.exports = DB
