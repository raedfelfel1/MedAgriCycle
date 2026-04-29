const nodemailer = require('nodemailer');

// ✅ CONFIG SMTP CORRECTE (PAS service: gmail)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000
});

// 🔍 Vérifier la connexion (optionnel mais utile)
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP ERROR:", error);
  } else {
    console.log("✅ SMTP prêt");
  }
});

// 📩 ENVOI CODE MFA
const sendVerificationCode = async (to, code) => {
  try {
    await transporter.sendMail({
      from: `"MedAgriCycle" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Code de vérification',
      html: `
        <h2>Votre code de vérification</h2>
        <p>Votre code est : <strong style="font-size: 24px">${code}</strong></p>
        <p>Ce code expire dans 10 minutes.</p>
      `
    });
  } catch (error) {
    console.error("❌ EMAIL MFA ERROR:", error.message);
  }
};

// 📩 EMAIL VERIFICATION
const sendVerificationEmail = async (to, token) => {
  try {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

    await transporter.sendMail({
      from: `"MedAgriCycle" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Vérifiez votre adresse email',
      html: `
        <h2>Bienvenue sur MedAgriCycle !</h2>
        <p>Cliquez sur le lien ci-dessous :</p>
        <a href="${verificationUrl}" style="
          background-color: #4CAF50;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
        ">Vérifier mon email</a>
      `
    });
  } catch (error) {
    console.error("❌ EMAIL VERIFICATION ERROR:", error.message);
  }
};

// 📩 RESET PASSWORD
const sendResetPasswordEmail = async (to, token) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await transporter.sendMail({
      from: `"MedAgriCycle" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Réinitialisation de mot de passe',
      html: `
        <h2>Réinitialisation de mot de passe</h2>
        <a href="${resetUrl}" style="
          background-color: #4CAF50;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
        ">Réinitialiser</a>
      `
    });
  } catch (error) {
    console.error("❌ EMAIL RESET ERROR:", error.message);
  }
};

// utilitaire
const getCurrentFamId = (req, res) => {
  const { currentFarmId } = req.params;
  console.log(currentFarmId);
  return currentFarmId;
};

module.exports = {
  getCurrentFamId,
  sendVerificationCode,
  sendVerificationEmail,
  sendResetPasswordEmail
};