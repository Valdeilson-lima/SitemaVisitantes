import './TelaLogin.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';
import { salvarLog, buscarNomeUsuario } from '../../services/loginServices';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';

function TelaLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => () => setLoading(false), []);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!form.email) newErrors.email = 'Email é obrigatório';
    else if (!validateEmail(form.email)) newErrors.email = 'Email inválido';
    if (!form.password) newErrors.password = 'Senha é obrigatória';
    else if (form.password.length < 6) newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    const timeoutId = setTimeout(() => {
      setLoading(false);
      toast.error('Tempo limite excedido. Tente novamente.');
    }, 10000);
    try {
      const { user } = await signInWithEmailAndPassword(auth, form.email, form.password);
      try {
        const nomeUsuario = await buscarNomeUsuario(user.uid);
        await salvarLog(user.uid, nomeUsuario || 'Usuário sem nome', 'Realizou login com sucesso.');
      } catch (logError) {
        console.error('Erro ao salvar log:', logError);
      }
      clearTimeout(timeoutId);
      toast.success('Login realizado com sucesso!');
      navigate('/menu');
    } catch (error) {
      console.error('Erro de autenticação:', error);
      clearTimeout(timeoutId);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        toast.error('Email ou senha incorretos!');
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('Muitas tentativas. Tente novamente mais tarde.');
      } else if (error.code === 'auth/network-request-failed') {
        toast.error('Erro de conexão. Verifique sua internet.');
      } else {
        toast.error('Erro ao fazer login. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tela-login-page">
      <h1 className="tela-login-title">Login</h1>
      <form className="tela-login-form" onSubmit={handleLogin} autoComplete="on">
        <div className="tela-login-form-control">
          <label htmlFor="email" className="tela-login-label">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Digite seu email"
            value={form.email}
            onChange={handleChange}
            className={`tela-login-input${errors.email ? ' tela-login-input-error' : ''}`}
            disabled={loading}
            autoComplete="username"
          />
          {errors.email ? (<span className="tela-login-error-message">{errors.email}</span>) : null}
        </div>
        <div className="tela-login-form-control">
          <label htmlFor="password" className="tela-login-label">Senha</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Digite sua senha"
            value={form.password}
            onChange={handleChange}
            className={`tela-login-input${errors.password ? ' tela-login-input-error' : ''}`}
            disabled={loading}
            autoComplete="current-password"
          />
          {errors.password ? (<span className="tela-login-error-message">{errors.password}</span>) : null}
        </div>
        <button type="submit" className="tela-login-btn" disabled={loading} aria-busy={loading} aria-label="Entrar">
          {loading ? (<><FaSpinner className="tela-login-spinner" /> Carregando...</>) : 'Acessar'}
        </button>
      </form>
      <p className="tela-login-link-text">
        Esqueceu a senha? <Link to="#" tabIndex={loading ? -1 : 0} className="tela-login-link">Recuperar</Link>
      </p>
    </div>
  );
}

export default TelaLogin;
