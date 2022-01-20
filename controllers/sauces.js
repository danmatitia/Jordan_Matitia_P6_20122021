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

exports.createLikes = (req, res, next) => {
  const like = req.body.like;
  const user =  req.body.userId;

  Sauce.findOne({ _id: req.params.id })//récuprération de la sauce
  .then(sauce => {

    if (sauce.usersLiked.includes(user)) {//Si le user aime deja la sauce et qu'il clic à nouveau sur le btn j'aime
      Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: user }, $inc: { likes: -1 } }) // alors je l'enleve des userLiked et je décrémente le compteur de like de 1
      .catch(error => res.status(400).json({ error }));
    }

    if (sauce.usersDisliked.includes(user)) {//Si le user n'aime deja pas la sauce et qu'il clic à nouveau sur le btn je n'aime pas 
        
      Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: user }, $inc: { dislikes: -1 } }) // alors je l'enleve des userDisliked et je décrémente le compteur de Dislike de 1
      .catch(error => res.status(400).json({ error }));
    }
  })
  .then(() => {
    if (like === 1) {//si le user aime la sauce

      Sauce.updateOne({ _id: req.params.id }, { $push: { usersLiked: user }, $inc: { likes: 1 } })//alors je met l'user dans le tableau des userLiked et j'incrémente le compteur de likes de 1
      
      .then(() => res.status(200).json({ message: user + " j'aime " }))
      .catch(error => res.status(400).json({ error }));
        
    } else if (like === -1) {//si le user n'aime pas la sauce

      Sauce.updateOne({ _id: req.params.id }, { $push: { usersDisliked: user }, $inc: { dislikes: 1 } })//alors je met l'user dans le tableau des userDisliked et j'incrémente le compteur de Dislikes de 1
      
      .then(() => res.status(200).json({ message: user + " je n'aime pas " }))
      .catch(error => res.status(400).json({ error }));
    }

    if (like === 0) {//le user est neutre
      res.status(200).json({ message: user + " je suis neutre " })
    }

  }).catch(error => res.status(404).json({ error }));
};