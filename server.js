const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());
dotenv.config();

// Connexion à la base de données
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',       
  password: 'S1obju72CaoJGDmO',
  database: 'TP1'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connecté à la base de données MySQL');
});

// Importation des routes
const login = require('./TP1/Utilisateur');

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/TP1/login', login);

// Objet Utilisateur 
const Utilisateur = {

  // Méthode pour vérifier les identifiants
  verifierIdentifiants: (login, password, callback) => {
    const sql = 'SELECT * FROM Utilisateur WHERE Login = ? AND Password = ?';
    db.query(sql, [login, password], (err, results) => {
      if (err) return callback(err, null);
      if (results.length > 0) {
        callback(null, results[0]); // Utilisateur trouvé
      } else {
        callback(null, null); // Aucun utilisateur trouvé
      }
    });
  }
};




app.get('/', (req, res) => {
    res.send('Le serveur fonctionne !');
});

app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});