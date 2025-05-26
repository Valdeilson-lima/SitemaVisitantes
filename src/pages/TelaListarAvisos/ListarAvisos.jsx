import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaBell, FaArrowLeft, FaCheck, FaEdit, FaTrash } from 'react-icons/fa';

import { db, auth } from '../../../firebaseConfig';
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { salvarLog, buscarNomeUsuario } from '../../services/loginServices';

import './ListarAvisos.css';

function ListarAvisos() {
    const [avisos, setAvisos] = useState([]);
    const navigate = useNavigate();

    // Configuração do ToastContainer
    const toastConfig = {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
            width: 'min(90vw, 400px)',
            fontSize: 'clamp(14px, 3vw, 16px)',
            padding: 'clamp(8px, 2vw, 12px)',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        },
    };

    // Função para formatar a data para o formato local (pt-BR)
    const formatarData = (data) => {
        const dataObj = data.seconds ? new Date(data.seconds * 1000) : new Date(data);
        return dataObj.toLocaleDateString('pt-BR'); // dd/mm/aaaa
    };

    // Função para comparar se duas datas são no mesmo dia
    const isMesmoDia = (data1, data2) => {
        return data1.getDate() === data2.getDate() &&
            data1.getMonth() === data2.getMonth() &&
            data1.getFullYear() === data2.getFullYear();
    };

    // Buscar os avisos no Firestore
    useEffect(() => {
        async function buscarAvisos() {
            try {
                const querySnapshot = await getDocs(collection(db, "avisos"));
                let lista = [];

                querySnapshot.forEach((doc) => {
                    lista.push({ id: doc.id, ...doc.data() });
                });

                // Ordenar: não feitos primeiro
                lista.sort((a, b) => (a.feito === b.feito) ? 0 : a.feito ? 1 : -1);

                setAvisos(lista);
            } catch (error) {
                toast.error("Erro ao buscar avisos.");
            }
        }

        buscarAvisos();
    }, []);

    // Marcar aviso como feito
    const marcarComoFeito = async (id) => {
        const avisoRef = doc(db, "avisos", id);
        try {
            await updateDoc(avisoRef, { feito: true });

            // Atualiza localmente
            setAvisos(prev =>
                prev.map(aviso =>
                    aviso.id === id ? { ...aviso, feito: true } : aviso
                )
            );

            const nomeUsuario = await buscarNomeUsuario(auth.currentUser.uid);
            await salvarLog(
                auth.currentUser.uid,
                nomeUsuario || 'Usuário sem nome',
                'Realizou a marcação de aviso como feito.'
            );

            toast.success("Aviso marcado como feito!");
        } catch (error) {
            toast.error("Erro ao atualizar aviso!");
        }
    };

    // Função para excluir aviso
    const excluirAviso = async (id) => {
        toast.info(
            <div style={{
                padding: 'clamp(10px, 3vw, 15px)',
                textAlign: 'center',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <p style={{
                    fontSize: 'clamp(14px, 3vw, 16px)',
                    marginBottom: 'clamp(10px, 3vw, 15px)',
                    color: '#333',
                    fontWeight: '500',
                    lineHeight: '1.4'
                }}>
                    Deseja realmente excluir este aviso?
                </p>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 'clamp(8px, 2vw, 10px)',
                    marginTop: 'clamp(10px, 3vw, 15px)',
                    flexWrap: 'wrap'
                }}>
                    <button
                        onClick={async () => {
                            try {
                                await deleteDoc(doc(db, "avisos", id));
                                setAvisos(prev => prev.filter(aviso => aviso.id !== id));
                                const nomeUsuario = await buscarNomeUsuario(auth.currentUser.uid);
                                await salvarLog(
                                    auth.currentUser.uid,
                                    nomeUsuario || 'Usuário sem nome',
                                    'Excluiu um aviso.'
                                );
                                toast.dismiss();
                                toast.success("Aviso excluído com sucesso!", toastConfig);
                            } catch (error) {
                                toast.error("Erro ao excluir aviso!", toastConfig);
                            }
                        }}
                        style={{
                            padding: 'clamp(8px, 2vw, 10px) clamp(12px, 3vw, 20px)',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: 'clamp(12px, 2.5vw, 14px)',
                            fontWeight: '500',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            minWidth: '120px',
                            flex: '1 1 auto',
                            maxWidth: '200px',
                            touchAction: 'manipulation',
                            WebkitTapHighlightColor: 'transparent'
                        }}
                    >
                        Sim, Excluir
                    </button>
                    <button
                        onClick={() => toast.dismiss()}
                        style={{
                            padding: 'clamp(8px, 2vw, 10px) clamp(12px, 3vw, 20px)',
                            backgroundColor: '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: 'clamp(12px, 2.5vw, 14px)',
                            fontWeight: '500',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            minWidth: '120px',
                            flex: '1 1 auto',
                            maxWidth: '200px',
                            touchAction: 'manipulation',
                            WebkitTapHighlightColor: 'transparent'
                        }}
                    >
                        Não, Cancelar
                    </button>
                </div>
            </div>,
            {
                position: "top-center",
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                closeButton: false,
                style: {
                    background: 'white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    borderRadius: '8px',
                    padding: '0',
                    width: 'min(90vw, 400px)',
                    margin: '10px'
                }
            }
        );
    };

    // Função para editar aviso
    const editarAviso = (aviso) => {
        navigate(`/editar-aviso/${aviso.id}`, { state: { aviso } });
    };

    // Filtrar apenas avisos do dia atual
    const hoje = new Date();
    const avisosDoDia = avisos.filter(aviso => {
        if (!aviso.dataCriacao) return false;
        const dataAviso = aviso.dataCriacao.seconds
            ? new Date(aviso.dataCriacao.seconds * 1000)
            : new Date(aviso.dataCriacao);
        return isMesmoDia(dataAviso, hoje);
    });

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
                <h1><FaBell className="title-icon" /> Avisos</h1>

                <ul className="lista-avisos">
                    {avisosDoDia.length === 0 ? (
                        <p className="mensagem-vazia">Nenhum aviso cadastrado para esse dia.</p>
                    ) : (
                        avisosDoDia.map((aviso) => (
                            <li key={aviso.id} className="aviso-card">
                                <h3>{aviso.titulo}</h3>
                                <div className="aviso-info">
                                    <div className="info-item">
                                        <strong>Descrição</strong>
                                        <p>{aviso.descricao}</p>
                                    </div>
                                </div>

                                {!aviso.feito ? (
                                    <div className="botoes-aviso">
                                        <button
                                            onClick={() => marcarComoFeito(aviso.id)}
                                            className="botao-feito"
                                            aria-label="Marcar aviso como feito"
                                        >
                                            <FaCheck /> Marcar como feito
                                        </button>
                                        <div className="botoes-acoes">
                                            <button
                                                onClick={() => editarAviso(aviso)}
                                                className="botao-editar"
                                                aria-label="Editar aviso"
                                            >
                                                <FaEdit /> Editar
                                            </button>
                                            <button
                                                onClick={() => excluirAviso(aviso.id)}
                                                className="botao-excluir"
                                                aria-label="Excluir aviso"
                                            >
                                                <FaTrash /> Excluir
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="botoes-aviso">
                                        <span className="aviso-feito">
                                            <FaCheck /> Aviso concluído
                                        </span>
                                        <div className="botoes-acoes">
                                            <button
                                                onClick={() => editarAviso(aviso)}
                                                className="botao-editar"
                                                aria-label="Editar aviso"
                                            >
                                                <FaEdit /> Editar
                                            </button>
                                            <button
                                                onClick={() => excluirAviso(aviso.id)}
                                                className="botao-excluir"
                                                aria-label="Excluir aviso"
                                            >
                                                <FaTrash /> Excluir
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))
                    )}
                </ul>

                <Link to="/menu" className="btn-voltar">
                    <FaArrowLeft /> Voltar ao Menu
                </Link>
            </div>
        </div>
    );
}

export default ListarAvisos;
