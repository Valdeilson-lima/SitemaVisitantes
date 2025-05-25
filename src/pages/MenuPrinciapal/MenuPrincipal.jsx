import './MenuPrincipal.css';
import { signOut, onAuthStateChanged } from 'firebase/auth';
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
    FaSignOutAlt,
    FaHistory,
    FaSpinner 
} from 'react-icons/fa';

function MenuPrincipal() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success('Logout realizado com sucesso!');
            navigate('/');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            toast.error('Erro ao fazer logout!');
        }
    };

    useEffect(() => {
        let timeoutId;
        let unsubscribe;
        
        const fetchUserData = async (user) => {
            try {
                if (!user) {
                    setError('Usuário não autenticado');
                    setLoading(false);
                    navigate('/');
                    return;
                }

                // Adiciona timeout de 10 segundos
                const timeoutPromise = new Promise((_, reject) => {
                    timeoutId = setTimeout(() => {
                        reject(new Error('Tempo limite excedido ao carregar dados do usuário'));
                    }, 10000);
                });

                const fetchPromise = getDoc(doc(db, 'usuarios', user.uid));
                const docSnap = await Promise.race([fetchPromise, timeoutPromise]);

                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                } else {
                    setError('Dados do usuário não encontrados');
                }
            } catch (error) {
                console.error('Erro ao carregar dados do usuário:', error);
                setError('Erro ao carregar dados do usuário');
                toast.error('Erro ao carregar dados do usuário. Tente novamente.');
            } finally {
                setLoading(false);
            }
        };

        // Listener de autenticação
        unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchUserData(user);
            } else {
                setError('Usuário não autenticado');
                setLoading(false);
                navigate('/login');
            }
        });

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [navigate]);

    if (loading) {
        return (
            <div className="menu-principal loading">
                <FaSpinner className="spinner" />
                <p>Carregando menu...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="menu-principal error">
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>
                    Tentar Novamente
                </button>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="menu-principal error">
                <p>Não foi possível carregar os dados do usuário</p>
                <button onClick={() => window.location.reload()}>
                    Tentar Novamente
                </button>
            </div>
        );
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
                    <Link to="/cadastrar-usuario">
                        <button>
                            <FaUserCog />
                            Gerenciar Usuários
                        </button>
                    </Link>
                </div>
            )}

            {userData.tipo === 'Admin' && (
                <div className='menu'>
                    <Link to="/listar-logs">
                        <button>
                            <FaHistory />
                            Logs de Usuários
                        </button>
                    </Link>
                </div>
            )}

            <button className='logaout' onClick={handleLogout}>
                <FaSignOutAlt />
                Sair
            </button>
        </div>
    );
}

export default MenuPrincipal;
