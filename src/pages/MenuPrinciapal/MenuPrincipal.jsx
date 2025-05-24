import './MenuPrincipal.css';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { 
    FaUserPlus, 
    FaUsers, 
    FaUserFriends, 
    FaBell, 
    FaListAlt, 
    FaUserCog, 
    FaSignOutAlt 
} from 'react-icons/fa';

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
                    <Link to="/cadastro-visitante">
                        <button>
                            <FaUserPlus />
                            Cadastrar Visitante
                        </button>
                    </Link>
                </div>
            )}

            {(userData.tipo === 'Admin' || userData.tipo === 'Recepcao') && (
                <div className='menu'>
                    <Link to="/listar-visitantes">
                        <button>
                            <FaUsers />
                            Visualizar Visitantes
                        </button>
                    </Link>
                </div>
            )}

            {(userData.tipo === 'Admin' || userData.tipo === 'Pastor') && (
                <div className='menu'>
                    <Link to="/apresentar-visitante">
                        <button>
                            <FaUserFriends />
                            Apresentar Visitantes
                        </button>
                    </Link>
                </div>
            )}

            {(userData.tipo === 'Admin' || userData.tipo === 'Recepcao') && (
                <div className='menu'>
                    <Link to="/cadastrar-aviso">
                        <button>
                            <FaBell />
                            Cadastrar Avisos
                        </button>
                    </Link>
                </div>
            )}

            {(userData.tipo === 'Admin' || userData.tipo === 'Recepcao' || userData.tipo === 'Pastor') && (
                <div className='menu'>
                    <Link to="/listar-avisos">
                        <button>
                            <FaListAlt />
                            Visualizar Avisos
                        </button>
                    </Link>
                </div>
            )}

            {userData.tipo === 'Admin' && (
                <div className='menu'>
                    <Link to="/cadastrarUsuario">
                        <button>
                            <FaUserCog />
                            Gerenciar Usuários
                        </button>
                    </Link>
                </div>
            )}

            {/* {userData.tipo === 'Admin' && (
                <div className='menu'>
                    <Link to="/ListarLogs"><button>Logs de Usuários</button></Link>
                </div>
            )} */}

            <button className='logaout' onClick={handleLogout}>
                <FaSignOutAlt />
                Sair
            </button>
        </div>
    );
}

export default MenuPrincipal;
