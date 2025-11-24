module.exports = (name) => `
  <div style="font-family:Arial,sans-serif">
    <h2>Olá, ${name}!</h2>
    <p>Obrigado pelo interesse. Aqui está nosso portfólio e informações institucionais.</p>
    <p>
      • Portfólio: <a href="${process.env.PORTFOLIO_URL}">${process.env.PORTFOLIO_URL}</a><br/>
      • Site: <a href="https://grupoargo.tech">grupoargo.tech</a>
    </p>
    <p>Se tiver dúvidas, basta responder este e-mail.</p>
    <hr/>
    <small>Você recebeu este e-mail porque preencheu o formulário em grupoargo.tech/exposeargo.</small>
  </div>
`;
