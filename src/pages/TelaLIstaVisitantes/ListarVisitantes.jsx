import React, { useState, useEffect } from 'react';
import './ListarVisitantes.css';
import { Link } from 'react-router-dom';
import { db, auth } from '../../../firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { FaUsers, FaArrowLeft, FaEdit, FaTrash, FaUser, FaMapMarkerAlt, FaChurch, FaCalendarAlt, FaCommentAlt, FaCheck, FaTimes } from 'react-icons/fa';
import { salvarLog, buscarNomeUsuario } from '../../services/loginServices';

function ListarVisitantes() {
  const [visitantes, setVisitantes] = useState([]); 
  const [erro, setErro] = useState(null); 

  const excluirVisitante = async (id, nomeVisitante) => {
    try {
      await deleteDoc(doc(db, 'visitantes', id));
      setVisitantes(visitantes.filter(visitante => visitante.id !== id));
      
      const nomeUsuario = await buscarNomeUsuario(auth.currentUser.uid);
      await salvarLog(
        auth.currentUser.uid,
        nomeUsuario || 'Usuário sem nome',
        `Excluiu o visitante ${nomeVisitante}.`
      );

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
              excluirVisitante(id, nome);
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

        console.log('Visitantes carregados:', visitantesList);

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

  const dataHoje = new Date();
  dataHoje.setHours(0, 0, 0, 0);
  console.log('Data de hoje:', dataHoje);

  const visitantesDoDia = visitantes.filter(v => {
    if (!v.data_cadastro) {
      console.log('Visitante sem data:', v);
      return false;
    }
    const dataVisita = new Date(v.data_cadastro.seconds * 1000);
    dataVisita.setHours(0, 0, 0, 0);
    console.log('Data do visitante:', dataVisita, 'Nome:', v.nome_completo);
    const isSameDay = dataVisita.getTime() === dataHoje.getTime();
    console.log('É do mesmo dia?', isSameDay);
    return isSameDay;
  });

  console.log('Visitantes do dia:', visitantesDoDia);

  return (
    <div className="listar-visitantes">
      <h1><FaUsers /> Lista de Visitantes</h1>

      {erro && <p className="erro">{erro}</p>} 

      <ul className="lista-visitantes">
        {visitantesDoDia.length === 0 ? (
          <p className='mensagem-vazia'>Não há visitantes cadastrados para esse dia.</p> 
        ) : (
          visitantesDoDia.map((visitante) => (
            <li key={visitante.id} className="visitante-card">
              <h3><FaUser /> {visitante.nome_completo}</h3>
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

      <Link to="/menu" className="btn-voltar">
        <FaArrowLeft /> Voltar ao Menu
      </Link>
    </div>
  );
}

export default ListarVisitantes;