import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

import { db, auth } from '../../../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { salvarLog, buscarNomeUsuario } from '../../services/loginServices';

import './EditarAviso.css';

function EditarAviso() {
    const navigate = useNavigate();
    const location = useLocation();
    const aviso = location.state?.aviso;

    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
    });

    useEffect(() => {
        if (!aviso) {
            toast.error('Aviso não encontrado', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                style: {
                    background: '#f44336',
                    color: 'white',
                    fontSize: '16px',
                    padding: '16px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }
            });
            navigate('/listar-avisos');
            return;
        }

        setFormData({
            titulo: aviso.titulo || '',
            descricao: aviso.descricao || '',
        });
    }, [aviso, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.titulo.trim() || !formData.descricao.trim()) {
            toast.error('Por favor, preencha todos os campos', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        try {
            const avisoRef = doc(db, "avisos", aviso.id);
            await updateDoc(avisoRef, {
                titulo: formData.titulo.trim(),
                descricao: formData.descricao.trim(),
                dataAtualizacao: new Date()
            });

            const nomeUsuario = await buscarNomeUsuario(auth.currentUser.uid);
            await salvarLog(
                auth.currentUser.uid,
                nomeUsuario || 'Usuário sem nome',
                'Editou um aviso.'
            );

            toast.success('Aviso atualizado com sucesso!', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            setTimeout(() => {
                navigate('/listar-avisos');
            }, 2000);
        } catch (error) {
            toast.error('Erro ao atualizar aviso. Tente novamente.', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            console.error('Erro ao atualizar aviso:', error);
        }
    };

    return (
        <div className="listar-visitantes-container">
            <div className="listar-visitantes">
                <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                    style={{
                        width: 'min(90vw, 400px)',
                        fontSize: 'clamp(14px, 3vw, 16px)',
                    }}
                />
                <h1>Editar Aviso</h1>

                <form onSubmit={handleSubmit} className="form-editar-aviso">
                    <div className="campo-form">
                        <label htmlFor="titulo">Título</label>
                        <input
                            type="text"
                            id="titulo"
                            name="titulo"
                            value={formData.titulo}
                            onChange={handleChange}
                            placeholder="Digite o título do aviso"
                            maxLength={100}
                        />
                    </div>

                    <div className="campo-form">
                        <label htmlFor="descricao">Descrição</label>
                        <textarea
                            id="descricao"
                            name="descricao"
                            value={formData.descricao}
                            onChange={handleChange}
                            placeholder="Digite a descrição do aviso"
                            rows={4}
                            maxLength={500}
                        />
                    </div>

                    <div className="botoes-form">
                        <button type="submit" className="botao-salvar">
                            <FaSave /> Salvar Alterações
                        </button>
                        <button
                            type="button"
                            className="botao-voltar"
                            onClick={() => navigate('/listar-avisos')}
                        >
                            <FaArrowLeft /> Voltar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditarAviso; 