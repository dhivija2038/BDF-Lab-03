
const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'books.db');

const openDatabase = async () => {
    const db = await sqlite.open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    return db;
};

module.exports = openDatabase;
