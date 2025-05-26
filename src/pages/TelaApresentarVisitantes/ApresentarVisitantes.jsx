import './ApresentarVisitantes.css';
import { Link } from 'react-router-dom';
import { FaCheck, FaTimes, FaUser, FaMapMarkerAlt, FaChurch, FaCalendarAlt, FaCommentAlt, FaArrowLeft, FaUserFriends, FaHandshake } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { db, auth } from '../../../firebaseConfig';
import { salvarLog, buscarNomeUsuario } from '../../services/loginServices';
import { toast } from 'react-toastify';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

function ApresentarVisitantes() {
    const [visitantes, setVisitantes] = useState([]);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        const fetchVisitantes = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'visitantes'));
                const visitantesList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                // Ordenar por não evangélicos primeiro e depois por nome
                const visitantesOrdenados = visitantesList.sort((a, b) => {
                    if (a.evangelico === b.evangelico) {
                        return a.nome_completo.localeCompare(b.nome_completo);
                    }
                    return a.evangelico ? 1 : -1;
                });

                setVisitantes(visitantesOrdenados);
            } catch (error) {
                console.error('Erro ao carregar os visitantes:', error);
                setErro('Não foi possível carregar os visitantes');
                toast.error(
                    <div>
                        <strong style={{ fontWeight: 'bold', fontSize: '16px' }}>Erro!</strong>
                        <p style={{ marginTop: '5px', fontSize: '15px' }}>
                            Não foi possível carregar os visitantes.
                        </p>
                    </div>
                );
            }
        };

        fetchVisitantes();
    }, []);

    const dataHoje = new Date().toLocaleDateString('pt-BR');

    const visitantesDoDia = visitantes.filter(v => {
        if (!v.data_cadastro) return false;
        const dataVisita = new Date(v.data_cadastro.seconds * 1000).toLocaleDateString('pt-BR');
        return dataVisita === dataHoje;
    });

    const handleApresentar = async (idVisitante, nomeVisitante) => {
        try {
            const visitanteRef = doc(db, "visitantes", idVisitante);
            await updateDoc(visitanteRef, {
                apresentado: true
            });

            setVisitantes((prevVisitantes) =>
                prevVisitantes.map((visitante) =>
                    visitante.id === idVisitante
                        ? { ...visitante, apresentado: true }
                        : visitante
                )
            );

            const nomeUsuario = await buscarNomeUsuario(auth.currentUser.uid);
            await salvarLog(
                auth.currentUser.uid,
                nomeUsuario || 'Usuário sem nome',
                'Realizou apresentação do visitante.'
            );

            toast.success(
                <div>
                    <strong style={{ fontWeight: 'bold', fontSize: '16px' }}>Sucesso!</strong>
                    <p style={{ marginTop: '5px', fontSize: '15px' }}>
                        Visitante {nomeVisitante} apresentado com sucesso!
                    </p>
                </div>
            );
        } catch (erro) {
            console.error("Erro ao apresentar o visitante:", erro);
            toast.error(
                <div>
                    <strong style={{ fontWeight: 'bold', fontSize: '16px' }}>Erro!</strong>
                    <p style={{ marginTop: '5px', fontSize: '15px' }}>
                        Não foi possível apresentar o visitante.
                    </p>
                </div>
            );
        }
    };

    return (
        <div className="listar-visitantes-container">
            <div className="listar-visitantes">
                <h1><FaUserFriends /> Apresentar Visitantes</h1>
                {erro && <p className="erro">{erro}</p>}

                {visitantesDoDia.length === 0 ? (
                    <p className="mensagem-vazia">Nenhum visitante cadastrado para hoje.</p>
                ) : (
                    <ul className="lista-visitantes">
                        {visitantesDoDia.map((visitante) => (
                            <li key={visitante.id} className="visitante-card">
                                <h3><FaUser /> {visitante.nome_completo}</h3>
                                <div className="visitante-info">
                                    <div className="info-item">
                                        <strong><FaMapMarkerAlt /> Cidade</strong>
                                        <p>{visitante.cidade_estado || 'Não informado'}</p>
                                    </div>
                                    <div className="info-item">
                                        <strong><FaChurch /> Denominação</strong>
                                        <p>{visitante.denominacao || 'Sem Denominação'}</p>
                                    </div>
                                    
                                    <div className="info-item">
                                        <strong><FaCommentAlt /> Observação</strong>
                                        <p>{visitante.observacao || 'Sem observação'}</p>
                                    </div>
                                </div>

                                <div className="status-linhas">
                                    <span className={visitante.evangelico ? "verde" : "vermelho"}>
                                        {visitante.evangelico ? <><FaCheck /> Evangélico</> : <><FaTimes /> Não Evangélico</>}
                                    </span>

                                    <button
                                        className={`btn-editar ${visitante.apresentado ? 'verde' : ''}`}
                                        onClick={() => handleApresentar(visitante.id, visitante.nome_completo)}
                                        disabled={visitante.apresentado}
                                    >
                                        {visitante.apresentado ? <><FaCheck /> Apresentado</> : <><FaHandshake /> Apresentar</>}
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                <Link to="/menu" className="btn-voltar">
                    <FaArrowLeft /> Voltar ao Menu
                </Link>
            </div>
        </div>
    );
}

export default ApresentarVisitantes;
