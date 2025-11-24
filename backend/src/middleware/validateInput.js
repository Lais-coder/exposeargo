module.exports = (req, res, next) => {
  const { name, email } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || name.length < 2 || !emailRegex.test(email)) {
    return res.status(400).json({ error: 'Dados inválidos' });
  }
  next();
};
