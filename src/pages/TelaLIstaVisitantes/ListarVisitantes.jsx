import React, { useState, useEffect } from 'react';
import './ListarVisitantes.css';
import { Link } from 'react-router-dom';
import { db } from '../../../firebaseConfig'; // Certifique-se de que a configuração do Firebase esteja correta
import { collection, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify'; // Caso queira usar um toast para erro

function ListarVisitantes() {
  const [visitantesDoDia, setVisitantesDoDia] = useState([]); // Estado para armazenar os visitantes
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
        setVisitantesDoDia(visitantesList);
      } catch (error) {
        console.error('Erro ao carregar os visitantes:', error);
        setErro('Não foi possível carregar os visitantes'); // Mensagem de erro
        toast.error('Erro ao carregar os visitantes'); // Exemplo de notificação com toast
      }
    };

    fetchVisitantes(); // Chama a função para buscar os dados
  }, []); // O array vazio significa que esse efeito só será chamado uma vez após o primeiro render

  // const formatarData = (data) => {
  //   const [dia, mes, ano] = data.split('/'); // Supondo que a data esteja no formato DD/MM/YYYY
  //   const dataFormatada = new Date(`${ano}-${mes}-${dia}`); // Converte para o formato correto
  //   return dataFormatada.toLocaleDateString('pt-BR'); // Exibe a data formatada
  // };

  return (
    <div className="listar-visitantes">
      <h1>Visitantes</h1>

      {erro && <p className="erro">{erro}</p>} {/* Exibe o erro, se houver */}

      <ul className="lista-visitantes">
        {visitantesDoDia.length === 0 ? (
          <p>Não há visitantes cadastrados no momento.</p> // Exibe uma mensagem caso não haja visitantes
        ) : (
          visitantesDoDia.map((visitante) => (
            <li key={visitante.id} className="visitante-card">
              <h2>{visitante.nome_completo}</h2>
              <p className="cidade">{visitante.cidade_estado}</p>
              <p className="denominacao">{visitante.denominacao || 'Sem Denominação'}</p>
              {/* <p className="data">
                {visitante.data_cadastro ?
                  new Date(visitante.data_cadastro.seconds * 1000).toLocaleDateString('pt-BR')
                  : 'Data inválida'}
              </p> */}

              <div className="status-linhas">
                <span className={visitante.evangelico ? "verde" : "vermelho"}>
                  {visitante.evangelico ? 'Evangélico' : 'Não Evangélico'}
                </span>
                
                {/* <span className={visitante.autoriza_imagem ? "verde" : "vermelho"}>
                  {visitante.autoriza_imagem ? 'Termo Autorizado' : 'Termo Não Autorizado'}
                </span> */}
              </div>
            </li>
          ))
        )}
      </ul>

      <Link to="/home">
        <button className="btn-voltar">Voltar ao Menu</button>
      </Link>
    </div>
  );
}

export default ListarVisitantes;
