const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const { sendVerificationCode } = require('../services/utils');
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require('../serviceAccountKey.json'))
  });
}

const pendingCodes = new Map();

exports.sendMfaCode = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Génère un code à 6 chiffres
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Stocke le code avec expiration 10 minutes
    pendingCodes.set(email, {
      code,
      expires: Date.now() + 10 * 60 * 1000
    });

    await sendVerificationCode(email, code);

    return res.status(200).json({ message: "Code envoyé." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.verifyMfaCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    const pending = pendingCodes.get(email);
    if (!pending) {
      return res.status(400).json({ message: "Aucun code demandé." });
    }

    if (Date.now() > pending.expires) {
      pendingCodes.delete(email);
      return res.status(400).json({ message: "Code expiré." });
    }

    if (pending.code !== code) {
      return res.status(400).json({ message: "Code incorrect." });
    }

    pendingCodes.delete(email);

    // Récupère l'user et génère le JWT
    const user = await User.findOne({ email });
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      token,
      user: { userId: user._id, firstName: user.firstName, lastName: user.lastName }
    });

  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur." });
  }
};
exports.loginWithGoogle = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const { idToken } = req.body;
    // token firebase
    const decoded = await admin.auth().verifyIdToken(idToken);
    const { email, name, uid } = decoded;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        firstName: name?.split(' ')[0] || 'Utilisateur',
        lastName: name?.split(' ').slice(1).join(' ') || 'Google',
        email,
        emailVerified:true,
        password: await bcrypt.hash(uid, 10), 
        googleUid: uid,
      });
     
    }
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    return res.status(200).json({
      token,
      user: { userId: user._id, firstName: user.firstName, lastName: user.lastName }
    });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid google token." });
  }
};
exports.login = async (req, res) => {
  const { login, password } = req.body;
  console.log("tentative de co")
  try {
    const user = await User.findOne({
  $or: [
    { email: login },
    { phoneNumber: login }
  ]
});
    if (!user) {
      return res.status(403).json({ message: "Utilisateur non trouvé." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({ message: "Mot de passe incorrect." });
    }
    //if (!user.emailVerified) {
      //return res.status(403).json({ message: "Veuillez vérifier votre email avant de vous connecter." });
    //}
    const token = jwt.sign(
      { userId: user._id, contact: user.contact },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({ token, user: { userId:user._id, firstName: user.firstName, lastName: user.lastName, contact: user.contact } });
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur." });
  }
};
