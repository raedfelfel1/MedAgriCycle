const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendVerificationCode = async (to, code) => {
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
};
const sendVerificationEmail = async (to, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  await transporter.sendMail({
    from: `"MedAgriCycle" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Vérifiez votre adresse email',
    html: `
      <h2>Bienvenue sur MedAgriCycle !</h2>
      <p>Cliquez sur le lien ci-dessous pour vérifier votre email :</p>
      <a href="${verificationUrl}" style="
        background-color: #4CAF50;
        color: white;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 6px;
        display: inline-block;
      ">Vérifier mon email</a>
      <p>Ce lien est valable 24h.</p>
    `
  });
};
const sendResetPasswordEmail = async (to, token) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await transporter.sendMail({
      from: `"MedAgriCycle" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Réinitialisation de mot de passe',
      html: `
        <h2>Réinitialisation de mot de passe</h2>
        <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
        <a href="${resetUrl}" style="
          background-color: #4CAF50;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          display: inline-block;
        ">Réinitialiser mon mot de passe</a>
        <p>Ce lien expire dans 30 minutes.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
      `
    });
  } catch (error) {
    console.error('Erreur envoi email réinitialisation:', error.message);
    throw error;
  }
};

const getCurrentFamId =  (req,res)=>{
    const {currentFarmId}=req.params;
    console.log(currentFarmId);
    return currentFarmId;
}

module.exports = { getCurrentFamId, sendVerificationCode, sendVerificationEmail, sendResetPasswordEmail };