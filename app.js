const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const path = require('path'); // nous donne accès à notre chemin 

//charge les variables d'environnement
const dotenv = require("dotenv");
dotenv.config();

//Helmet aide à sécuriser l'applications Express en définissant divers en-têtes HTTP. 
const helmet = require('helmet');

const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

mongoose.connect(`mongodb+srv://jordan:matitia@cluster0.9djlw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,  
{   useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(helmet());// Pour sécuriser l'app

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use (bodyParser.json()); // Il va transformer le corps de la requête en objet JS

app.use('/images', express.static(path.join(__dirname, 'images'))); //Pour dire à notre application express de servir le dossier image(backend/images)

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;