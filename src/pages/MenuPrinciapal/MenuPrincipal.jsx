import './MenuPrincipal.css'
import { signOut } from 'firebase/auth'
import { auth } from '../../../firebaseConfig'
import { toast } from 'react-toastify'


import { Link, useNavigate } from 'react-router-dom'



function MenuPrincipal() {
    const navigate = useNavigate();

  
    const handleLogout = async () => {
        try {
            await signOut(auth);  // Faz o logout do Firebase
            toast.success('Logout realizado com sucesso!');
            navigate('/login'); // Redireciona o usuário para a página de login
        } catch (error) {
            console.log(error);
            toast.error('Erro ao fazer logout!');
        }
    };


    return (
        <div className='menu-principal'>
            <h1>Menu Principal</h1>

            <div className='menu'>
                <Link to="/cadastrovisitante"><button>Cadastrar</button></Link>
            </div>

            <div className='menu'>
                <Link to="/listarVisitantes"><button>Visualizar</button></Link>
            </div>

            <div className='menu'>
                <Link to="/apresentarVisitantes"><button>Apresentar</button></Link>
            </div>

            <button className='logaout' onClick={handleLogout}>Sair</button>
        </div>

    )
}

export default MenuPrincipal
