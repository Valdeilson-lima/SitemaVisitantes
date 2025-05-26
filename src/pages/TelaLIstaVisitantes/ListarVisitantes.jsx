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
  const [isLoading, setIsLoading] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const formatarData = (timestamp) => {
    if (!timestamp) return 'Data inválida';
    return new Date(timestamp.seconds * 1000).toLocaleDateString('pt-BR');
  };

  const obterDataHoje = () => {
    const data = new Date();
    data.setHours(0, 0, 0, 0);
    return data;
  };

  const excluirVisitante = async (id, nomeVisitante) => {
    if (!id || !nomeVisitante) {
      console.error('ID ou nome do visitante não fornecidos');
      toast.error('Erro: Dados do visitante incompletos');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Iniciando exclusão do visitante:', { id, nomeVisitante });
      
      // Verificar se o usuário está autenticado
      if (!auth.currentUser) {
        console.error('Usuário não autenticado');
        throw new Error('Usuário não está autenticado');
      }

      console.log('Usuário autenticado:', auth.currentUser.uid);

      // Verificar se o documento existe antes de tentar excluir
      const visitanteRef = doc(db, 'visitantes', id);
      console.log('Referência do documento criada:', visitanteRef.path);
      
      // Excluir o documento
      await deleteDoc(visitanteRef);
      console.log('Documento excluído com sucesso');

      // Atualizar o estado local
      setVisitantes(prevVisitantes => {
        const novosVisitantes = prevVisitantes.filter(visitante => visitante.id !== id);
        console.log('Estado local atualizado. Visitantes restantes:', novosVisitantes.length);
        return novosVisitantes;
      });
      
      // Registrar o log
      const nomeUsuario = await buscarNomeUsuario(auth.currentUser.uid);
      console.log('Nome do usuário obtido:', nomeUsuario);
      
      await salvarLog(
        auth.currentUser.uid,
        nomeUsuario || 'Usuário sem nome',
        `Excluiu o visitante ${nomeVisitante}.`
      );
      console.log('Log salvo com sucesso');

      toast.success(
        <div>
          <strong style={{ fontWeight: 'bold', fontSize: '16px' }}>Sucesso!</strong>
          <p style={{ marginTop: '5px', fontSize: '15px' }}>
            Visitante excluído com sucesso!
          </p>
        </div>
      );
    } catch (error) {
      console.error('Erro detalhado ao excluir visitante:', error);
      console.error('Stack trace:', error.stack);
      
      let mensagemErro = 'Não foi possível excluir o visitante.';
      
      if (error.message.includes('permission-denied')) {
        mensagemErro = 'Você não tem permissão para excluir visitantes.';
      } else if (error.message.includes('not-found')) {
        mensagemErro = 'Visitante não encontrado.';
      } else if (error.message.includes('não está autenticado')) {
        mensagemErro = 'Você precisa estar logado para excluir visitantes.';
      }

      toast.error(
        <div>
          <strong style={{ fontWeight: 'bold', fontSize: '16px' }}>Erro!</strong>
          <p style={{ marginTop: '5px', fontSize: '15px' }}>
            {mensagemErro}
          </p>
        </div>
      );
    } finally {
      setIsLoading(false);
    }
  };

  const confirmarExclusao = (id, nome) => {
    if (!id || !nome) {
      console.error('ID ou nome do visitante não fornecidos na confirmação');
      return;
    }

    const toastId = toast.info(
      <div style={{ 
        width: '100%',
        padding: '10px',
        textAlign: 'center'
      }}>
        <strong style={{ 
          display: 'block',
          fontSize: '18px',
          marginBottom: '10px',
          color: '#333'
        }}>
          Confirmar Exclusão
        </strong>
        <p style={{ 
          fontSize: '16px',
          marginBottom: '15px',
          color: '#666'
        }}>
          Deseja realmente excluir o visitante {nome}?
        </p>
        <div style={{ 
          display: 'flex',
          justifyContent: 'center',
          gap: '10px'
        }}>
          <button
            onClick={() => {
              toast.dismiss(toastId);
              excluirVisitante(id, nome);
            }}
            style={{
              padding: '8px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              minWidth: '100px'
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Excluindo...' : 'Confirmar'}
          </button>
          <button
            onClick={() => toast.dismiss(toastId)}
            style={{
              padding: '8px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              minWidth: '100px'
            }}
            disabled={isLoading}
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
        closeButton: false,
        style: {
          width: '90%',
          maxWidth: '400px',
          margin: '0 auto',
          backgroundColor: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          borderRadius: '8px'
        },
        bodyStyle: {
          padding: '0'
        }
      }
    );
  };

  const carregarVisitantes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'visitantes'));
      const visitantesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

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

  useEffect(() => {
    carregarVisitantes();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowButton(scrollPosition > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dataHoje = obterDataHoje();
  const visitantesDoDia = visitantes.filter(visitante => {
    if (!visitante.data_cadastro) return false;
    
    const dataVisita = new Date(visitante.data_cadastro.seconds * 1000);
    dataVisita.setHours(0, 0, 0, 0);
    
    return dataVisita.getTime() === dataHoje.getTime();
  });

  const renderVisitanteCard = (visitante) => (
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

        <div className="botoes-acoes">
          <Link to={`/editar-visitante/${visitante.id}`} style={{ textDecoration: 'none' }}>
            <button className="btn-editar" disabled={isLoading}>
              <FaEdit /> Editar
            </button>
          </Link>
          <button 
            className="btn-excluir"
            onClick={() => confirmarExclusao(visitante.id, visitante.nome_completo)}
            disabled={isLoading}
          >
            <FaTrash /> {isLoading ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </li>
  );

  return (
    <div className="listar-visitantes-container">
      <div className="listar-visitantes">
        <h1><FaUsers /> Lista de Visitantes</h1>

        {erro && <p className="erro">{erro}</p>}

        <ul className="lista-visitantes">
          {visitantesDoDia.length === 0 ? (
            <p className='mensagem-vazia'>Não há visitantes cadastrados para esse dia.</p>
          ) : (
            visitantesDoDia.map(renderVisitanteCard)
          )}
        </ul>

        <Link to="/menu" className={`btn-voltar ${showButton ? 'visible' : ''}`}>
          <FaArrowLeft /> Voltar ao Menu
        </Link>
      </div>
    </div>
  );
}

export default ListarVisitantes;