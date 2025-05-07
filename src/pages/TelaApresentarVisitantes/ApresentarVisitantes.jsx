import './ApresentarVisitantes.css';
import { Link } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';
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


                setVisitantes(visitantesList);
            } catch (error) {
                console.error('Erro ao carregar os visitantes:', error);
                setErro('Não foi possível carregar os visitantes');
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


    const handleApresentar = async (idVisitante) => {
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
                auth.currentUser.uid, nomeUsuario || 'Usuário sem nome',
                'Realizou apresentação do visitante.'
            );

            toast.success("Visitante apresentado com sucesso!");
        } catch (erro) {
            console.error("Erro ao apresentar o visitante:", erro);
        }
    };

    return (
        <div className='apresentar-visitantes'>
            <h1>Apresentar Visitantes</h1>
            {erro && <p className="erro">{erro}</p>}
            <ul className="lista-visitantes">
                {visitantesDoDia.map((visitante) => (
                    <li key={visitante.id} className="visitante-card">
                        <h3><strong>Nome:</strong> {visitante.nome_completo}</h3>
                        <p className="cidade"><strong>Cidade:</strong>  {visitante.cidade_estado}</p>
                        <p className="denominacao"><strong>Denominação: </strong>{visitante.denominacao || 'Sem Denominação'}</p>
                        <p className="data"> <strong>Data:  </strong> {visitante.data_cadastro
                            ? new Date(visitante.data_cadastro.seconds * 1000).toLocaleDateString('pt-BR')
                            : 'Data inválida'}
                        </p>
                        <p className="observacao"><strong>Observação:</strong>  {visitante.observacao || 'Sem observacao'}</p>

                        <div className="status-linhas">
                            <span className={visitante.evangelico ? "verde" : "vermelho"}>
                                {visitante.evangelico ? 'Evangélico' : 'Não Evangélico'}
                            </span>


                            <button
                                className={`botao-apresentado ${visitante.apresentado ? 'verde' : ''}`}
                                onClick={() => handleApresentar(visitante.id)}
                                disabled={visitante.apresentado}
                            >
                                {visitante.apresentado ? <><FaCheck /> Apresentado</> : ' Apresentar'}
                            </button>

                        </div>


                    </li>
                ))}
            </ul>
            <Link to="/home">
                <button className='btn-voltar'>Voltar ao Menu</button>
            </Link>
        </div>
    );
}

export default ApresentarVisitantes;
