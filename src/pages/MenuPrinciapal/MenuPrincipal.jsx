import './MenuPrincipal.css';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

function MenuPrincipal() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);

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

    useEffect(() => {
        async function fetchUser() {
            const user = auth.currentUser;
            if (user) {
                const docRef = doc(db, 'usuarios', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                }
            }
        }

        fetchUser();
    }, []);

    if (!userData) {
        return <p>Carregando menu...</p>;
    }

    return (
        <div className='menu-principal'>
            <h1>Menu Principal</h1>

            {(userData.tipo === 'Admin' || userData.tipo === 'Recepcao') && (
                <div className='menu'>
                    <Link to="/cadastroVisitante"><button>Cadastrar Visitante</button></Link>
                </div>
            )}

            {(userData.tipo === 'Admin' || userData.tipo === 'Recepcao') && (
                <div className='menu'>
                    <Link to="/listarVisitantes"><button>Visualizar Visitantes</button></Link>
                </div>
            )}

            {(userData.tipo === 'Admin' || userData.tipo === 'Pastor') && (
                <div className='menu'>
                    <Link to="/apresentarVisitantes"><button>Apresentar Visitantes</button></Link>
                </div>
            )}

            {(userData.tipo === 'Admin' || userData.tipo === 'Recepcao') && (
                <div className='menu'>
                    <Link to="/CadastrarAviso"><button>Cadastrar Avisos</button></Link>
                </div>
            )}

            {(userData.tipo === 'Admin' || userData.tipo === 'Recepcao' || userData.tipo === 'Pastor') && (
                <div className='menu'>
                    <Link to="/ListarAvisos"><button>Visualizar Avisos</button></Link>
                </div>
            )}

            {userData.tipo === 'Admin' && (
                <div className='menu'>
                    <Link to="/cadastrarUsuario"><button>Gerenciar Usuários</button></Link>
                </div>
            )}

            {userData.tipo === 'Admin' && (
                <div className='menu'>
                    <Link to="/ListarLogs"><button>Logs de Usuários</button></Link>
                </div>
            )}

            <button className='logaout' onClick={handleLogout}>Sair</button>
        </div>
    );
}

export default MenuPrincipal;
