const express = require('express');
const router = express.Router();

module.exports = (db, Utilisateur) => {
    router.post('/inscription', (req, res) => {
        const { login, password } = req.body;
        
        if (!login || !password) {
            return res.status(400).json({ success: false, message: 'Champs manquants' });
        }
        
        Utilisateur.inscription(login, password, (err, insertId) => {
            if (err) {
                console.error('Erreur inscription:', err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ success: false, message: 'Utilisateur déjà existant' });
                }
                return res.status(500).json({ success: false, message: 'Erreur serveur' });
            }
            res.json({ success: true, userId: insertId });
        });
    });
    
    return router; 
};
