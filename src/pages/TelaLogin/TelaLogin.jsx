import './TelaLogin.css'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../../firebaseConfig'
import { salvarLog, buscarNomeUsuario } from '../../services/loginServices';
import { toast } from 'react-toastify'

function TelaLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);


  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  async function handleLogin(event) {
    event.preventDefault();

    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos!');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Por favor, insira um e-mail válido!');
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
      navigate('/home');
    } catch (error) {
      console.log(error);
      toast.error('Erro ao fazer login!');
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
          <input type="email" name="email" id="email" placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='form-control'>
          <label htmlFor="senha">Senha</label>
          <input type="password" name="senha" id="senha" placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

        </div>
        <button type="submit">Acessar</button>

      </form>



    </div>
  )
}

export default TelaLogin
