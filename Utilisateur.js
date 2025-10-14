const express = require('express');
const router = express.Router();

module.exports = (db, Utilisateur) => {
    router.post('/login', (req, res) => {
        const { login, password } = req.body;
        
        if (!login || !password) {
            return res.status(400).json({ success: false, message: 'Champs manquants' });
        }
        
        Utilisateur.verifierIdentifiants(login, password, (err, user) => {
            if (err) {
                console.error('Erreur vérification:', err);
                return res.status(500).json({ success: false, message: 'Erreur serveur' });
            }
            
            if (user) {
                res.json({ success: true, user });
            } else {
                res.json({ success: false, message: 'Identifiants invalides' });
            }
        });
    });
    
    return router; 
};
