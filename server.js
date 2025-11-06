const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 12;

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('/var/www/html/'));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
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
        const sql = 'SELECT * FROM Utilisateur WHERE Login = ? LIMIT 1';
        db.query(sql, [login], (err, results) => {
            if (err) return callback(err, null);
            if (results.length === 0) return callback(null, null);

            const user = results[0];
            bcrypt.compare(password, user.Password, (cmpErr, ok) => {
                if (cmpErr) return callback(cmpErr, null);
                if (!ok) return callback(null, null);
                callback(null, user);
            });
        });
    },

    inscription: (login, password, callback) => {
        bcrypt.hash(password, SALT_ROUNDS, (hashErr, hash) => {
            if (hashErr) return callback(hashErr, null);
            const sql = 'INSERT INTO Utilisateur (Login, Password) VALUES (?, ?)';
            db.query(sql, [login, hash], (err, results) => {
                if (err) return callback(err, null);
                callback(null, results.insertId);
            });
        });
    },
};


// CORRECTION : Les fichiers sont dans le même dossier, donc utiliser './'
const loginRoute = require('./Utilisateur')(db, Utilisateur);
const registerRoute = require('./Inscription')(db, Utilisateur);

app.use('/TP1', loginRoute);
app.use('/TP1', registerRoute);

app.get('/', (req, res) => {
    res.sendFile(path.join('/var/www/html/', 'index.html'));
});

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
    console.error('Erreur serveur:', err);
    res.status(500).json({ success: false, message: 'Erreur serveur interne' });
});

app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
