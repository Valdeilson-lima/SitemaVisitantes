import React, { useState, useEffect } from 'react';
import './ListarVisitantes.css';
import { Link } from 'react-router-dom';
import { db } from '../../../firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { FaUsers, FaArrowLeft, FaEdit, FaTrash, FaUser, FaMapMarkerAlt, FaChurch, FaCalendarAlt, FaCommentAlt, FaCheck, FaTimes } from 'react-icons/fa';

function ListarVisitantes() {
  const [visitantes, setVisitantes] = useState([]); 
  const [erro, setErro] = useState(null); 

  const excluirVisitante = async (id) => {
    try {
      await deleteDoc(doc(db, 'visitantes', id));
      setVisitantes(visitantes.filter(visitante => visitante.id !== id));
      toast.success(
        <div>
          <strong style={{ fontWeight: 'bold', fontSize: '16px' }}>Sucesso!</strong>
          <p style={{ marginTop: '5px', fontSize: '15px' }}>
            Visitante excluído com sucesso!
          </p>
        </div>
      );
    } catch (error) {
      console.error('Erro ao excluir visitante:', error);
      toast.error(
        <div>
          <strong style={{ fontWeight: 'bold', fontSize: '16px' }}>Erro!</strong>
          <p style={{ marginTop: '5px', fontSize: '15px' }}>
            Não foi possível excluir o visitante.
          </p>
        </div>
      );
    }
  };

  const confirmarExclusao = (id, nome) => {
    toast.info(
      <div>
        <strong style={{ fontWeight: 'bold', fontSize: '16px' }}>Confirmar Exclusão</strong>
        <p style={{ marginTop: '5px', fontSize: '15px' }}>
          Deseja realmente excluir o visitante {nome}?
        </p>
        <div style={{ marginTop: '10px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => {
              toast.dismiss();
              excluirVisitante(id);
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Confirmar
          </button>
          <button
            onClick={() => toast.dismiss()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false
      }
    );
  };

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
      <h1><FaUsers /> Lista deVisitantes</h1>

      {erro && <p className="erro">{erro}</p>} 

      <ul className="lista-visitantes">
        {visitantesDoDia.length === 0 ? (
          <p>Não há visitantes cadastrados para esse dia.</p> 
        ) : (
          visitantesDoDia.map((visitante) => (
            <li key={visitante.id} className="visitante-card">
              <h3><FaUser /> {visitante.nome_completo}</h3>
              <p>
                <strong><FaMapMarkerAlt /> Cidade:</strong>
                <span>{visitante.cidade_estado || 'Não informado'}</span>
              </p>
              <p>
                <strong><FaChurch /> Denominação:</strong>
                <span>{visitante.denominacao || 'Sem Denominação'}</span>
              </p>
              <p>
                <strong><FaCalendarAlt /> Data:</strong>
                <span>
                  {visitante.data_cadastro
                    ? new Date(visitante.data_cadastro.seconds * 1000).toLocaleDateString('pt-BR')
                    : 'Data inválida'}
                </span>
              </p>
              <p>
                <strong><FaCommentAlt /> Observação:</strong>
                <span>{visitante.observacao || 'Sem observação'}</span>
              <p><strong><FaMapMarkerAlt /> Cidade:</strong> {visitante.cidade_estado || 'Não informado'}</p>
              <p><strong><FaChurch /> Denominação:</strong> {visitante.denominacao || 'Sem Denominação'}</p>
              <p><strong><FaCalendarAlt /> Data:</strong> {visitante.data_cadastro ?
                  new Date(visitante.data_cadastro.seconds * 1000).toLocaleDateString('pt-BR')
                  : 'Data inválida'}
              </p>
              <p><strong><FaCommentAlt /> Observação:</strong> {visitante.observacao || 'Sem observação'}</p>

              <div className="status-linhas">
                <span className={visitante.evangelico ? "verde" : "vermelho"}>
                  {visitante.evangelico ? <><FaCheck /> Evangélico</> : <><FaTimes /> Não Evangélico</>}
                </span>

                <div className="botoes-acoes">
                  <Link to={`/editar-visitante/${visitante.id}`}>
                    <button className="btn-editar"><FaEdit /> Editar</button>
                  </Link>
                  <button 
                    className="btn-excluir"
                    onClick={() => confirmarExclusao(visitante.id, visitante.nome_completo)}
                  >
                    <FaTrash /> Excluir
                  </button>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>

      <Link to="/menu">
        <button className="btn-voltar"><FaArrowLeft /> Voltar ao Menu</button>
      </Link>
    </div>
  );
}

export default ListarVisitantes;