const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const crypto = require('crypto');
const { sendVerificationCode, sendVerificationEmail,sendResetPasswordEmail } = require('../services/utils');

exports.creerUtilisateur = async (req, res) => {
  try {
    const { firstName, lastName, age, phone, email, location, address, password } = req.body;

    if (!firstName || !lastName || !phone || !email || !password) {
      return res.status(400).json({ message: "Champs obligatoires manquants." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = new User({
      firstName, lastName, age, phone, email,
      location, address,
      password: hashedPassword,
      emailVerificationToken: verificationToken,
      emailVerified: false,
      emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000
    });

    await newUser.save();

    await sendVerificationEmail(email, verificationToken);

    return res.status(201).json({ message: "Inscription réussie. Vérifiez votre email." });

  } catch (err) {
    console.error("Erreur complète :", err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email ou téléphone déjà utilisé." });
    }
    return res.status(500).json({ message: err.message });
  }
};
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) {
      return res.status(400).json({ message: "Token invalide ou expiré." });
    }
    else if (user.emailVerificationExpires < Date.now()) {
      return res.status(400).json({ message: "Lien expiré." });
    }
    user.emailVerified = true;
    user.emailVerificationToken = null;
    await user.save();

    return res.status(200).json({ message: "Email vérifié avec succès." });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // On ne dit pas si l'email existe ou non (sécurité)
      return res.status(200).json({ message: "Si cet email existe, un lien a été envoyé." });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save();

    await sendResetPasswordEmail(user.email, resetToken);

    return res.status(200).json({ message: "Si cet email existe, un lien a été envoyé." });
  } catch (err) {
    console.error("Erreur forgotPassword :", err);
    return res.status(500).json({ message: "Erreur serveur : impossible d'envoyer l'email de réinitialisation." });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Lien invalide ou expiré." });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.status(200).json({ message: "Mot de passe mis à jour avec succès." });
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur." });
  }
};
// Lister tous les utilisateurs
exports.afficherLesUtilisateurs = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // ne pas retourner les mots de passe
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Supprimer un utilisateur
exports.supprimerUtilisateur = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    return res.json({
      success: true,
      message: "Utilisateur supprimé avec succès",
      data: deletedUser
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Modifier un utilisateur
exports.modifierUtilisateur = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.password) delete updates.password; // Mot de passe ne doit pas être changé ici

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    return res.json(updatedUser);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Changer le mot de passe
exports.changerMotDePasse = async (req, res) => {
  try {
    const { id } = req.params;
    const { ancienMotDePasse, nouveauMotDePasse } = req.body;

    if (!ancienMotDePasse || !nouveauMotDePasse) {
      return res.status(400).json({ message: "Les deux mots de passe sont requis." });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const motDePasseValide = await bcrypt.compare(ancienMotDePasse, user.password);
    if (!motDePasseValide) {
      return res.status(401).json({ message: "Ancien mot de passe incorrect" });
    }

    user.password = await bcrypt.hash(nouveauMotDePasse, 10);
    await user.save();

    return res.json({ message: "Mot de passe mis à jour avec succès" });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Authentifier un utilisateur et retourner son profil (sans mot de passe)
exports.authentifierUtilisateur = async (req, res) => {
  try {
    const { user_id, password } = req.body;

    if (!user_id || !password) {
      return res.status(400).json({ message: "user_id et mot de passe requis" });
    }

    const user = await User.findOne({ user_id });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // Enlever le mot de passe de la réponse
    const { password: _, ...userSansMotDePasse } = user.toObject();

    return res.json({
      message: "Authentification réussie",
      user: userSansMotDePasse
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Récupérer un utilisateur par son ID
exports.afficherUnUtilisateur = async (req, res) => {
  console.log("USER")

  try {
    const { id } = req.params;

    // Vérifier si l'ID est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID utilisateur invalide" });
    }

    const utilisateur = await User.findById(id);

    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    console.log("user retourné : ",utilisateur)
    return res.status(200).json(utilisateur); 
    
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};
