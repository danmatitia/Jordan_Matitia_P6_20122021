const multer = require("multer"); //gére les fichiers entrants dans les requêtes HTTP

const MIME_TYPES = { //en utilisant les MIME_TYPES, on génère les extensions du fichier en préparant un dictionniaire
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

//Création d'un objet de configuration pour multer pour enregistrer sur le disque
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(".")[0].split(" ").join("_"); //Ici on va générer un nouveau nom pour les fichiers
    const extension = MIME_TYPES[file.mimetype]; //On applique une extention au fichier qui sera l'élément de notre dictionnaire
    callback(null, name + Date.now() + "." + extension); // on appel le callback, ()on passe le 1e argument nul pour dire il n'ya pas d'erreur, et on créé un nom pour l'image
  },
});

const fileFilter = (req, file, callback) => {
  const extension = MIME_TYPES[file.mimetype]; // Recherche du type de mime du fichier téléchargé
  if (extension === "jpg" || extension === "png") {
    callback(null, true); // S'assurer qu'il s'agit d'un png ou d'un jpg
  } else {
    callback("Erreur, mauvais type de fichier", false);
  }
};

// on exporte le middleware multer en appelant le multer à laquelle on passe notre objet storage et on  appel la méthode single pour dire il sagit d'un fichier unique et on explique à multer qu'il sagit de fichier image uniquement
module.exports = multer({storage: storage}).single('image');