import './MenuPrincipal.css';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
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

// Hook personalizado para autenticação e dados do usuário
function useAuthUser(navigate) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                setError('Erro ao carregar dados do usuário');
                toast.error('Erro ao carregar dados do usuário. Tente novamente.');
            } finally {
                setLoading(false);
            }
        };
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
            if (timeoutId) clearTimeout(timeoutId);
            if (unsubscribe) unsubscribe();
        };
    }, [navigate]);
    return { userData, loading, error };
}

const MENU_ITEMS = [
    {
        label: 'Cadastrar Visitante',
        to: '/cadastro-visitante',
        icon: FaUserPlus,
        roles: ['Admin', 'Recepcao']
    },
    {
        label: 'Visualizar Visitantes',
        to: '/listar-visitantes',
        icon: FaUsers,
        roles: ['Admin', 'Recepcao']
    },
    {
        label: 'Apresentar Visitantes',
        to: '/apresentar-visitante',
        icon: FaUserFriends,
        roles: ['Admin', 'Pastor']
    },
    {
        label: 'Cadastrar Avisos',
        to: '/cadastrar-aviso',
        icon: FaBell,
        roles: ['Admin', 'Recepcao']
    },
    {
        label: 'Visualizar Avisos',
        to: '/listar-avisos',
        icon: FaListAlt,
        roles: ['Admin', 'Recepcao', 'Pastor']
    },
    {
        label: 'Gerenciar Usuários',
        to: '/cadastrar-usuario',
        icon: FaUserCog,
        roles: ['Admin']
    },
    {
        label: 'Logs de Usuários',
        to: '/listar-logs',
        icon: FaHistory,
        roles: ['Admin']
    }
];

function MenuPrincipal() {
    const navigate = useNavigate();
    const { userData, loading, error } = useAuthUser(navigate);

    const handleLogout = useCallback(async () => {
        try {
            await signOut(auth);
            toast.success('Logout realizado com sucesso!');
            navigate('/');
        } catch (error) {
            toast.error('Erro ao fazer logout!');
        }
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

    const filteredMenu = MENU_ITEMS.filter(item => item.roles.includes(userData.tipo));

    return (
        <div className="menu-principal">
            <h1>Menu Principal</h1>
            <div className="menu-list">
                {filteredMenu.map(({ label, to, icon: Icon }, idx) => (
                    <div className="menu" key={label}>
                        <Link to={to}>
                            <button>
                                <Icon />
                                {label}
                            </button>
                        </Link>
                    </div>
                ))}
            </div>
            <button className="logaout" onClick={handleLogout}>
                <FaSignOutAlt />
                Sair
            </button>
        </div>
    );
}

export default MenuPrincipal;
