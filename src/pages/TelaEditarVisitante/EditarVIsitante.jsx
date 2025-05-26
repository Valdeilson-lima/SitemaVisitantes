import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { salvarLog, buscarNomeUsuario } from '../../services/loginServices';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUserEdit, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import './EditarVisitante.css';

function EditarVisitante() {
    const [formData, setFormData] = useState({
        nome_completo: '',
        email: '',
        telefone: '',
        cidade_estado: '',
        denominacao: '',
        observacao: '',
        evangelico: false,
    });
    const [etapa, setEtapa] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVisitante = async () => {
            try {
                const docRef = doc(db, 'visitantes', id);
                const docSnapshot = await getDoc(docRef);

                if (docSnapshot.exists()) {
                    setFormData(docSnapshot.data());
                    console.log('Dados do visitante carregados:', docSnapshot.data());
                } else {
                    console.error('Visitante não encontrado');
                    toast.error('Visitante não encontrado');
                }
            } catch (error) {
                console.error('Erro ao carregar os dados do visitante:', error);
                toast.error('Erro ao carregar os dados do visitante');
            }
        };

        fetchVisitante();
    }, [id]);

    const avancarEtapa = () => {
        setEtapa((prevEtapa) => prevEtapa + 1);
    };

    const voltarEtapa = () => {
        setEtapa((prevEtapa) => prevEtapa - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const docRef = doc(db, 'visitantes', id);
            await updateDoc(docRef, formData);
            
            toast.success('Visitante atualizado com sucesso!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                closeButton: false
            });

            setTimeout(() => {
                navigate("/listar-visitantes");
            }, 1000);

            const nomeUsuario = await buscarNomeUsuario(auth.currentUser.uid);
            await salvarLog(
                auth.currentUser.uid, nomeUsuario || 'Usuário sem nome',
                'Editou um visitante.'
            );
        } catch (error) {
            console.error('Erro ao atualizar o visitante:', error);
            toast.error('Erro ao atualizar os dados do visitante');
        } finally {
            setIsLoading(false);
        }
    };

    const renderStepOne = () => (
        <div className="fade-in">
            <div className="form-control">
                <label htmlFor="nome_completo">Nome</label>
                <input
                    type="text"
                    id="nome_completo"
                    name="nome_completo"
                    placeholder="Digite o nome do visitante"
                    value={formData.nome_completo}
                    onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })}
                    required
                />
            </div>
            <div className="form-control">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Ex: email@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
            </div>
            <div className="form-control">
                <label htmlFor="telefone">Telefone</label>
                <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    placeholder="Ex: (83) 99999-9999"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    maxLength="15"
                />
            </div>
            <div className="form-control">
                <label htmlFor="cidade_estado">Localidade</label>
                <input
                    type="text"
                    id="cidade_estado"
                    name="cidade_estado"
                    placeholder="Ex: Cajazeiras - PB"
                    value={formData.cidade_estado}
                    onChange={(e) => setFormData({ ...formData, cidade_estado: e.target.value })}
                />
            </div>
            <div className="form-check">
                <input
                    type="checkbox"
                    id="evangelico"
                    name="evangelico"
                    checked={formData.evangelico}
                    onChange={(e) => setFormData({ ...formData, evangelico: e.target.checked })}
                />
                <label htmlFor="evangelico">Evangélico?</label>
            </div>
            <div className="buttons-container">
                <button type="button" onClick={avancarEtapa} disabled={isLoading}>
                    Avançar
                </button>
            </div>
            <Link to="/listar-visitantes" className="voltar">
                <FaArrowLeft /> Voltar ao Menu
            </Link>
        </div>
    );

    const renderStepTwo = () => (
        <div className="fade-in">
            <div className="form-control">
                <label htmlFor="denominacao">Denominação</label>
                <input
                    type="text"
                    id="denominacao"
                    name="denominacao"
                    placeholder="Ex: Assembleia de Deus"
                    value={formData.denominacao}
                    onChange={(e) => setFormData({ ...formData, denominacao: e.target.value })}
                />
            </div>
            <div className="form-control">
                <label htmlFor="observacao">Observação</label>
                <textarea
                    id="observacao"
                    name="observacao"
                    placeholder="Ex: Pedido de oração"
                    value={formData.observacao}
                    onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
                    rows="5"
                />
            </div>
            <div className="buttons-container">
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className={isLoading ? 'loading-button' : ''}
                >
                    {isLoading ? (
                        <>
                            <FaSpinner className="spinner-icon" />
                            Atualizando...
                        </>
                    ) : 'Atualizar'}
                </button>
                <button 
                    type="button" 
                    onClick={voltarEtapa}
                    className="btn-limpar"
                    disabled={isLoading}
                >
                    Voltar
                </button>
            </div>
        </div>
    );

    return (
        <div className="editar-visitante">
            <ToastContainer />
            <h2>
                <FaUserEdit className="title-icon" /> Editar Visitante
            </h2>
            <form className="form" onSubmit={handleSubmit}>
                {etapa === 1 ? renderStepOne() : renderStepTwo()}
            </form>
        </div>
    );
}

export default EditarVisitante;
