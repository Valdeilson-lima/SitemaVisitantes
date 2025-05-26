import { useState } from 'react';
import { auth, db } from '../../../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { salvarLog, buscarNomeUsuario } from '../../services/loginServices';
import { FaUserPlus, FaArrowLeft, FaSpinner, FaUser, FaEnvelope, FaLock, FaUserTag } from 'react-icons/fa';
import './CadastroUsuario.css';

function CadastroUsuario() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [tipo, setTipo] = useState('Recepcao');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    // Guardar credenciais do admin atual
    const currentUser = auth.currentUser;
    const currentEmail = currentUser?.email;

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateSenha = (senha) => {
        return senha.length >= 6 && /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(senha);
    };

    const handleNomeChange = (e) => {
        const newNome = e.target.value;
        setNome(newNome);
        
        if (!newNome.trim()) {
            setErrors(prev => ({
                ...prev,
                nome: 'Nome é obrigatório'
            }));
        } else if (newNome.trim().length < 3) {
            setErrors(prev => ({
                ...prev,
                nome: 'Nome deve ter pelo menos 3 letras'
            }));
        } else {
            setErrors(prev => ({
                ...prev,
                nome: null
            }));
        }
    };

    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        
        if (newEmail && !validateEmail(newEmail)) {
            setErrors(prev => ({
                ...prev,
                email: 'Email inválido'
            }));
        } else {
            setErrors(prev => ({
                ...prev,
                email: null
            }));
        }
    };

    const handleSenhaChange = (e) => {
        const newSenha = e.target.value;
        setSenha(newSenha);
        
        if (!newSenha) {
            setErrors(prev => ({
                ...prev,
                senha: 'Senha é obrigatória'
            }));
        } else if (newSenha.length < 6) {
            setErrors(prev => ({
                ...prev,
                senha: 'Senha deve ter pelo menos 6 caracteres'
            }));
        } else if (!validateSenha(newSenha)) {
            setErrors(prev => ({
                ...prev,
                senha: 'Senha deve conter letras e números'
            }));
        } else {
            setErrors(prev => ({
                ...prev,
                senha: null
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!nome.trim()) {
            newErrors.nome = 'Nome é obrigatório';
        } else if (nome.trim().length < 3) {
            newErrors.nome = 'Nome deve ter pelo menos 3 letras';
        }
        
        if (!email) {
            newErrors.email = 'Email é obrigatório';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Email inválido';
        }
        
        if (!senha) {
            newErrors.senha = 'Senha é obrigatória';
        } else if (!validateSenha(senha)) {
            newErrors.senha = 'Senha deve conter letras e números e ter pelo menos 6 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCadastrar = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Salvar senha do admin atual antes de logout implícito
            const adminSenha = prompt('Digite sua senha novamente para manter seu login após o cadastro:');

            // Cria o novo usuário (isso desloga o admin)
            const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
            const user = userCredential.user;

            // Cadastra o novo usuário no Firestore
            await setDoc(doc(db, "usuarios", user.uid), {
                nome,
                email,
                tipo
            });

            toast.success('Usuário cadastrado com sucesso!');

            // Volta a autenticar como admin
            if (currentEmail && adminSenha) {
                await signInWithEmailAndPassword(auth, currentEmail, adminSenha);
                toast.success('Reautenticado como admin!');
            }

            setNome('');
            setEmail('');
            setSenha('');
            setTipo('Recepcao');
            navigate('/menu');

            const nomeUsuario = await buscarNomeUsuario(auth.currentUser.uid);
            await salvarLog(
                auth.currentUser.uid, nomeUsuario || 'Usuário sem nome',
                'Realizou Cadastro de um usuário.'
            );

        } catch (error) {
            console.error(error);
            toast.error('Erro ao cadastrar usuário!');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLimpar = () => {
        setNome('');
        setEmail('');
        setSenha('');
        setTipo('Recepcao');
        setErrors({});
    };

    return (
        <div className="cadastro-usuario">
            <h2>
                <FaUserPlus className="title-icon" /> Novo Usuário
            </h2>
            <form onSubmit={handleCadastrar} className='form'>
                <div className={`form-control ${errors.nome ? 'error' : ''}`}>
                    <label htmlFor="nome">
                        Nome
                    </label>
                    <input
                        type="text"
                        id='nome'
                        placeholder="Digite o nome do usuário (mínimo 3 letras)"
                        value={nome}
                        onChange={handleNomeChange}
                    />
                    {errors.nome && <span className="error-message">{errors.nome}</span>}
                </div>

                <div className={`form-control ${errors.email ? 'error' : ''}`}>
                    <label htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        id='email'
                        placeholder="Digite um email válido (exemplo@email.com)"
                        value={email}
                        onChange={handleEmailChange}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className={`form-control ${errors.senha ? 'error' : ''}`}>
                    <label htmlFor="senha">
                        Senha
                    </label>
                    <input
                        type="password"
                        id="senha"
                        placeholder="Digite uma senha (mínimo 6 caracteres, letras e números)"
                        value={senha}
                        onChange={handleSenhaChange}
                    />
                    {errors.senha && <span className="error-message">{errors.senha}</span>}
                </div>

                <div className="form-control">
                    <label htmlFor="tipo">
                        Tipo de Usuário
                    </label>
                    <select 
                        id="tipo" 
                        name="tipo" 
                        value={tipo} 
                        onChange={(e) => setTipo(e.target.value)}
                    >
                        <option value="Recepcao">Recepção</option>
                        <option value="Pastor">Pastor</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>

                <div className="buttons-container">
                    <button 
                        type="button" 
                        onClick={handleLimpar}
                        className="btn-limpar"
                    >
                        Limpar
                    </button>
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className={isLoading ? 'loading-button' : ''}
                    >
                        {isLoading ? (
                            <>
                                <FaSpinner className="spinner-icon" />
                                Cadastrando...
                            </>
                        ) : 'Cadastrar'}
                    </button>
                </div>
                <Link to="/menu">
                    <button type="button" className="btn-voltar">
                        <FaArrowLeft /> Voltar ao Menu
                    </button>
                </Link>
            </form>
        </div>
    );
}

export default CadastroUsuario;
