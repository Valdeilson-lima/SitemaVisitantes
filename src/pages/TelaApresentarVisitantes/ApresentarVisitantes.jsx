import './ApresentarVisitantes.css';
import { Link } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';
import { useState, useEffect } from 'react'; // Importando useState e useEffect
import { db } from '../../../firebaseConfig'; // Certifique-se de que a configuração do Firebase esteja correta
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'; // Importando as funções necessárias do Firestore

function ApresentarVisitantes() {
    const [visitantes, setVisitantes] = useState([]); // Estado para armazenar os visitantes
    const [erro, setErro] = useState(null); // Estado para gerenciar erros

    // Carregar dados quando o componente for montado
    useEffect(() => {
        const fetchVisitantes = async () => {
            try {
                // Busca a coleção "visitantes" no Firestore
                const querySnapshot = await getDocs(collection(db, 'visitantes'));

                // Mapeia os documentos para um array de objetos
                const visitantesList = querySnapshot.docs.map(doc => ({
                    id: doc.id, // Adiciona o ID do documento
                    ...doc.data(), // Adiciona os dados do documento
                }));

                // Atualiza o estado com os visitantes
                setVisitantes(visitantesList);
            } catch (error) {
                console.error('Erro ao carregar os visitantes:', error);
                setErro('Não foi possível carregar os visitantes'); // Mensagem de erro
            }
        };

        fetchVisitantes(); // Chama a função para buscar os dados
    }, []); // O efeito será chamado uma única vez quando o componente for montado


    const dataHoje = new Date().toLocaleDateString('pt-BR');

    const visitantesDoDia = visitantes.filter(v => {
        if (!v.data_cadastro) return false; // Protege contra visitante sem data
        const dataVisita = new Date(v.data_cadastro.seconds * 1000).toLocaleDateString('pt-BR');
        return dataVisita === dataHoje;
    });

    // Função para atualizar o campo 'apresentado' para 'true' no Firestore
    const handleApresentar = async (idVisitante) => {
        try {
            const visitanteRef = doc(db, "visitantes", idVisitante); // Referência ao documento do visitante
            await updateDoc(visitanteRef, {
                apresentado: true // Atualiza o campo 'apresentado' para 'true'
            });

            // Atualiza o estado local sem precisar recarregar a página
            setVisitantes((prevVisitantes) =>
                prevVisitantes.map((visitante) =>
                    visitante.id === idVisitante
                        ? { ...visitante, apresentado: true } // Atualiza o visitante específico
                        : visitante
                )
            );

            console.log("Visitante apresentado com sucesso!");
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
                        <h2>{visitante.nome_completo}</h2>
                        <p className="cidade">{visitante.cidade_estado}</p>
                        <p className="denominacao">{visitante.denominacao || 'Sem Denominação'}</p>
                        <p className="data">
                            {visitante.data_cadastro
                                ? new Date(visitante.data_cadastro.seconds * 1000).toLocaleDateString('pt-BR')
                                : 'Data inválida'}
                        </p>

                        <div className="status-linhas">
                            <span className={visitante.evangelico ? "verde" : "vermelho"}>
                                {visitante.evangelico ? 'Evangélico' : 'Não Evangélico'}
                            </span>


                            <button
                                className={`botao-apresentado ${visitante.apresentado ? 'verde' : ''}`}
                                onClick={() => handleApresentar(visitante.id)}
                                disabled={visitante.apresentado} // Desabilita o botão se o visitante já foi apresentado
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
