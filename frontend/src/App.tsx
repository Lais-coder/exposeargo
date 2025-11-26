import { useState, useEffect } from 'react'
import fundoImage from './assets/Fundo 1.1.png'
import whatsappIcon from './assets/icons8-whatsapp-50.png'
import './App.css'

function App() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [displayedText, setDisplayedText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const fullText = 'FALECONOSCO'

  useEffect(() => {
    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(typingInterval)
        // Esconder cursor após 1 segundo
        setTimeout(() => setShowCursor(false), 1000)
      }
    }, 150) // Velocidade da digitação

    return () => clearInterval(typingInterval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      // Usar proxy do Nginx em produção ou URL direta em desenvolvimento
      const apiBase = 'http://faleconosco.grupoargo.tech:8000';
      const response = await fetch(`${apiBase}/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone: phone || undefined }),
      })

      const data = await response.json()

      // Status 207 = Lead salvo mas email falhou
      if (response.status === 207) {
        let warningMessage = 'Cadastro realizado, mas houve um problema ao enviar o email.'
        if (data.emailError?.message) {
          warningMessage += ` ${data.emailError.message}`
        }
        setMessage({ type: 'error', text: warningMessage })
        setName('')
        setEmail('')
        setPhone('')
      } else if (response.ok) {
        // Verificar se email foi enviado
        if (data.emailSent === false) {
          setMessage({ type: 'error', text: 'Cadastro realizado, mas o email não foi enviado. Tente novamente mais tarde.' })
        } else {
          setMessage({ type: 'success', text: 'Portfólio enviado com sucesso! Verifique seu e-mail.' })
        }
        setName('')
        setEmail('')
        setPhone('')
      } else {
        // Tratamento específico de erros
        let errorMessage = 'Erro ao enviar. Tente novamente.'

        if (data.code === 'DUPLICATE_EMAIL') {
          errorMessage = 'Este email já está cadastrado. Use outro email.'
        } else if (data.details && Array.isArray(data.details)) {
          errorMessage = data.details.join(', ')
        } else if (data.error) {
          errorMessage = data.error
        }

        setMessage({ type: 'error', text: errorMessage })
      }
    } catch {
      setMessage({ type: 'error', text: 'Erro ao conectar com o servidor. Verifique se o servidor está rodando.' })
    } finally {
      setLoading(false)
    }
  }

  return (

    <div className="contact-container" style={{ backgroundImage: `url(${fundoImage})` }}>
      <h1 className="main-hashtag">
        <span className="hashtag-symbol">#</span>
        <span className="hashtag-text">{displayedText}</span>
        {showCursor && <span className="typing-cursor">|</span>}
      </h1>
      <div className="contact-wrapper">
        <div className="contact-info">
          <div className="contact-item">
            <img src={whatsappIcon} alt="WhatsApp" className="contact-icon whatsapp-icon" />
            <span className="contact-text">0800 680 6868</span>
          </div>

          <div className="contact-item">
            <svg className="contact-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="contact-text-wrapper">
              <span className="contact-text">Av. Desembargador Moreira, 1300</span>
              <span className="contact-text-p">Torre Norte, 812 Ceará. Brasil</span>
            </div>
          </div>

          <div className="contact-item">
            <svg className="contact-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="contact-text-wrapper">
              <span className="contact-text">99 Wall Street</span>
              <span className="contact-text-p">New York, NY 10005</span>
            </div>
          </div>
        </div>

        {/* Seção Direita - Formulário */}
        <div className="contact-form-section">
          <div className="purple-graphic"></div>
          <div className="form-wrapper">
            <form onSubmit={handleSubmit} className="contact-form">
              <input
                type="text"
                placeholder="digite aqui seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                className="form-input"
              />

              <input
                type="email"
                placeholder="digite aqui seu gmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
              />

              <input
                type="tel"
                placeholder="digite aqui seu número"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input"
              />

              {message && (
                <div className={`form-message ${message.type}`}>
                  {message.text}
                </div>
              )}

              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
