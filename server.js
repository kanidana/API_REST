// importation des module neccessaires
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');


// Charger les variables d'environnement
dotenv.config({ path: "./.env" });


// 
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour parser les données JSON
app.use(express.json());


// Connexion à MongoDB 
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Connexion a la base de donnee'))
    .catch(err => console.log(err));


// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`En attente de requete au port ${PORT}`);
});



// ------------------------------CREATIONS DES ROUTES--------------------------------------------

// importation du shema de modele mongoose
const User = require('./models/User');


// GET : RETOURNER TOUS LES UTILISATEURS
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).send(err);
    }
});

// POST : AJOUTER UN NOUVEL UTILISATEUR À LA BASE DE DONNÉES
app.post('/users', async (req, res) => {
    try {
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        console.log('Utilisateur sauvegardé:', savedUser);
        res.json(savedUser);
    } catch (err) {
        console.error('Erreur lors de la sauvegarde de l\'utilisateur:', err);
        res.status(500).send('Erreur interne du serveur');
    }
});

// PUT : ÉDITER UN UTILISATEUR PAR ID
app.put('/users/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedUser);
    } catch (err) {
        res.status(500).send(err);
    }
});

// DELETE : SUPPRIMER UN UTILISATEUR PAR ID
app.delete('/users/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        res.json(deletedUser);
    } catch (err) {
        res.status(500).send(err);
    }
});
