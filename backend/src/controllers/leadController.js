const Lead = require('../models/leadModel');
const sgMail = require('../config/mail');
const emailTemplate = require('../utils/emailTemplate');

exports.createLead = async (req, res) => {
  const { name, email } = req.body;
  try {
    await Lead.insert(name, email);

    const msg = {
      to: email,
      from: process.env.FROM_EMAIL,
      subject: 'Portfólio • Argo Tech',
      html: emailTemplate(name)
    };
    await sgMail.send(msg);

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no servidor' });
  }
};
