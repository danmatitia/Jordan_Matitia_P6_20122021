const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); // plug-in, s'assurera que deux utilisateurs ne puissent partager la même adresse e-mail.

module.exports = mongoose.model('User', userSchema);