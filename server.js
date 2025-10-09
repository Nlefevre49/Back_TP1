const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 8080;

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('/var/www/html/ProjetTP1'));

// Connexion à la base de données
const db = mysql.createConnection({
  host: 'localhost',
  user: 'p1pkj',
  password: 'av0bKmjH6a7iuHx7',
  database: 'TP1'
});

db.connect(err => {
  if (err) {
    console.error('Erreur de connexion MySQL :', err.message);
  } else {
    console.log('Connecté à la base de données MySQL');
  }
});


const Utilisateur = {
  verifierIdentifiants: (login, password, callback) => {
    const sql = 'SELECT * FROM Utilisateur WHERE Login = ? AND Password = ?';
    db.query(sql, [login, password], (err, results) => {
      if (err) return callback(err, null);
      if (results.length > 0) {
        callback(null, results[0]);
      } else {
        callback(null, null);
      }
    });
  }
};


const loginRoute = require('./TP1/Utilisateur')(db, Utilisateur);
app.use('/TP1', loginRoute);

app.get('/', (req, res) => {
  res.sendFile(path.join('/var/www/html/ProjetTP1', 'index.html'));
});

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});