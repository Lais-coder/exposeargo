module.exports = (req, res, next) => {
  const { name, email, phone } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Regex para telefone: aceita números, espaços, parênteses, hífens e +
  // Exemplos válidos: (85) 99999-9999, +55 85 99999-9999, 85999999999
  const phoneRegex = /^[\d\s\(\)\-\+]+$/;

  const errors = [];

  // Validação de nome
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Nome deve ter pelo menos 2 caracteres');
  }

  // Validação de email
  if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
    errors.push('Email inválido');
  }

  // Validação de telefone (opcional, mas se fornecido deve ser válido)
  if (phone && typeof phone === 'string' && phone.trim().length > 0) {
    const cleanPhone = phone.replace(/\s/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 15 || !phoneRegex.test(phone)) {
      errors.push('Telefone inválido');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      error: 'Dados inválidos',
      details: errors
    });
  }

  next();
};
