const Sauce = require('../models/Sauces');
const fs = require('fs'); //  expose des méthodes pour interagir avec le système de fichier du serveur.

exports.createSauce = (req, res, next) => {
  const saucesObject = JSON.parse(req.body.sauce);
  delete saucesObject._id;
  const sauce = new Sauce({
    ...saucesObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked:  [ ' ' ],
    usersDisliked:  [ ' ' ],
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
  .then((sauce) => {res.status(200).json(sauce);})
  .catch(
    (error) => {res.status(404).json({error: error})
    ;}
  );
};

exports.modifySauces = (req, res, next) => {
  if (req.file) {
    Sauce.findOne({ _id: req.params.id })

    .then((sauce) => {
      // On supprime l'ancienne image du serveur
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlinkSync(`images/${filename}`)
    });

    sauceObject = {
      // On ajoute la nouvelle image
      ...JSON.parse(req.body.sauce),//permet de récupérer le corps de la requêtte en json utilisable 
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    };
  } else {
    // Si la modification ne contient pas de nouvelle image alors on modifie le corps de la requette
    sauceObject = { ...req.body }
  };

  Sauce.updateOne(
    // On applique les paramètre de sauceObject
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
  .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
  .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauces = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => { // permet de supprimer un fichier du système de fichier.
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
  .then((sauces) => {res.status(200).json(sauces);}
  ).catch((error) => {res.status(400).json({error: error});
  }
  );
};