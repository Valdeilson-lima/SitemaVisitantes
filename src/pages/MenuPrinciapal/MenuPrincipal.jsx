import './MenuPrincipal.css'
import { signOut } from 'firebase/auth'
import { auth } from '../../../firebaseConfig'
import { toast } from 'react-toastify'


import { Link, useNavigate } from 'react-router-dom'



function MenuPrincipal() {
    const navigate = useNavigate();
    const usuario = auth.currentUser;


    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success('Logout realizado com sucesso!');
            navigate('/login');
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

            <div className='menu'>
                <Link to="/CadastrarAviso"><button>Cadastrar Avisos</button></Link>
            </div>

            <div className='menu'>
                <Link to="/ListarAvisos"><button>Visulizar Avisos</button></Link>
            </div>


           


            <button className='logaout' onClick={handleLogout}>Sair</button>
        </div>

    )
}

export default MenuPrincipal
