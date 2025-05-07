import { useState } from 'react';
import { auth, db } from '../../../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { salvarLog, buscarNomeUsuario } from '../../services/loginServices';
import './CadastroUsuario.css';

function CadastroUsuario() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [tipo, setTipo] = useState('Recepcao');

    const navigate = useNavigate();

    // Guardar credenciais do admin atual
    const currentUser = auth.currentUser;
    const currentEmail = currentUser?.email;

    const handleCadastrar = async (e) => {
        e.preventDefault();

        if (!nome || !email || !senha || !tipo) {
            toast.warn('Preencha todos os campos!');
            return;
        }

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
            navigate('/home');


            const nomeUsuario = await buscarNomeUsuario(auth.currentUser.uid);
            await salvarLog(
                auth.currentUser.uid, nomeUsuario || 'Usuário sem nome',
                'Realizou Cadastro de um usuário.'
            );

        } catch (error) {
            console.error(error);
            toast.error('Erro ao cadastrar usuário!');
        }
    };

    return (
        <div className="cadastro-usuario">
            <h2>Cadastrar Novo Usuário</h2>
            <form onSubmit={handleCadastrar} className='form'>

                <div className='form-control'>
                    <label htmlFor="nome">Nome</label>
                    <input
                        type="text"
                        id='nome'
                        placeholder="Nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                </div>

                <div className='form-control'>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id='email'
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className='form-control'>
                    <label htmlFor="senha">Senha</label>
                    <input
                        type="password"
                        id="senha"
                        placeholder="Senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />
                </div>

                <div className='form-control'>
                    <label htmlFor="tipo">Tipo de Usuário</label>
                    <select id="tipo" name="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                        <option value="Recepcao">Recepção</option>
                        <option value="Pastor">Pastor</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>

                <button type="submit">Cadastrar</button>
                <Link to="/home">
                    <button type="button" className="btn-voltar">Voltar ao Menu</button>
                </Link>
            </form>
        </div>
    );
}

export default CadastroUsuario;
