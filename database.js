const mysql = require('mysql2');

// MySQL bağlantı ayarları
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodedb'
});

// Bağlantıyı aç
connection.connect((err) => {
  if (err) {
    console.error('Failed to connect to database: ' + err.stack);
    return;
  }

  console.log('Connected to database, connection ID: ' + connection.threadId);
});

module.exports = connection;
