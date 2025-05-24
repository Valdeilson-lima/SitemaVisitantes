import './TelaLogin.css'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../../firebaseConfig'
import { salvarLog, buscarNomeUsuario } from '../../services/loginServices';
import { toast } from 'react-toastify'
import { FaSpinner } from 'react-icons/fa'

function TelaLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleLogin(event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const nomeUsuario = await buscarNomeUsuario(user.uid);
      await salvarLog(
        auth.currentUser.uid, nomeUsuario || 'Usuário sem nome',
        'Realizou login com sucesso.'
      );

      toast.success('Login realizado com sucesso!');
      navigate('/menu');
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        toast.error('Email ou senha incorretos!');
      } else {
        toast.error('Erro ao fazer login. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='tela-login'>
      <h1>Login</h1>
      <form className='form' onSubmit={handleLogin}>
        <div className='form-control'>
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            name="email" 
            id="email" 
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
        <div className='form-control'>
          <label htmlFor="senha">Senha</label>
          <input 
            type="password" 
            name="senha" 
            id="senha" 
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? 'error' : ''}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
          
        </div>
        <button type="submit" disabled={loading}>
          {loading ? (
            <>
              <FaSpinner className="spinner" /> Carregando...
            </>
          ) : (
            'Acessar'
          )}
        </button>
      </form>
    </div>
  )
}

export default TelaLogin
