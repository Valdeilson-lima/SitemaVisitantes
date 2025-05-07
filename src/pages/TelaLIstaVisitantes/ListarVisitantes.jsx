import React, { useState, useEffect } from 'react';
import './ListarVisitantes.css';
import { Link } from 'react-router-dom';
import { db } from '../../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

import { toast } from 'react-toastify'; 

function ListarVisitantes() {
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
        toast.error('Erro ao carregar os visitantes'); 
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


  return (
    <div className="listar-visitantes">
      <h1>Visitantes</h1>

      {erro && <p className="erro">{erro}</p>} 

      <ul className="lista-visitantes">
        {visitantesDoDia.length === 0 ? (
          <p>Não há visitantes cadastrados para esse dia.</p> 
        ) : (
          visitantesDoDia.map((visitante) => (
            <li key={visitante.id} className="visitante-card">
              <h3>Nome: {visitante.nome_completo}</h3>
              <p className="cidade"><strong>Cidade:</strong> {visitante.cidade_estado}</p>
              <p className="denominacao"><strong>Denominação:</strong> {visitante.denominacao || 'Sem Denominação'}</p>
              <p className="data"><strong>Data:</strong> {visitante.data_cadastro ?
                  new Date(visitante.data_cadastro.seconds * 1000).toLocaleDateString('pt-BR')
                  : 'Data inválida'}
              </p>
              <p className="observacao"><strong>Observação:</strong>  {visitante.observacao || 'Sem observação'}</p>

              <div className="status-linhas">
                <span className={visitante.evangelico ? "verde" : "vermelho"}>
                  {visitante.evangelico ? 'Evangélico' : 'Não Evangélico'}
                </span>

                <Link to={`/EditarVisitante/${visitante.id}`}>
                  <button className="btn-editar">Editar</button>
                </Link>

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
