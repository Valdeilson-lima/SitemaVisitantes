import './CadastrarAviso.css';
import { Link, useNavigate } from 'react-router-dom';
import { db, auth } from '../../../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';
import { salvarLog, buscarNomeUsuario } from '../../services/loginServices';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaBell, FaSpinner } from 'react-icons/fa';

function CadastrarAvisos() {
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!titulo.trim()) {
      newErrors.titulo = 'Título é obrigatório';
    }
    
    if (!descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await addDoc(collection(db, "avisos"), {
        titulo,
        descricao,
        feito: false,
        dataCriacao: serverTimestamp()
      });

      toast.success("Aviso cadastrado com sucesso!");
      setTitulo('');
      setDescricao('');
      navigate('/listar-avisos');

      const nomeUsuario = await buscarNomeUsuario(auth.currentUser.uid);
      await salvarLog(
        auth.currentUser.uid, nomeUsuario || 'Usuário sem nome',
        'Realizou Cadastro de um aviso.'
      );
    } catch (error) {
      console.error(error);
      toast.error("Erro ao cadastrar aviso.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLimpar = () => {
    setTitulo('');
    setDescricao('');
    setErrors({});
  };

  return (
    <div className="cadastrar-aviso">
      <h2>
        <FaBell className="title-icon" /> Cadastrar Aviso
      </h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className={`form-control ${errors.titulo ? 'error' : ''}`}>
          <label htmlFor="titulo">Título</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            placeholder="Digite o título do aviso"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          {errors.titulo && <span className="error-message">{errors.titulo}</span>}
        </div>

        <div className={`form-control ${errors.descricao ? 'error' : ''}`}>
          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            name="descricao"
            placeholder="Digite a descrição do aviso"
            rows={4}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
          {errors.descricao && <span className="error-message">{errors.descricao}</span>}
        </div>

        <div className="buttons-container">
          <button 
            type="button" 
            onClick={handleLimpar}
            className="btn-limpar"
          >
            Limpar
          </button>
          <button 
            type="submit" 
            disabled={isLoading}
            className={isLoading ? 'loading-button' : ''}
          >
            {isLoading ? (
              <>
                <FaSpinner className="spinner-icon" />
                Cadastrando...
              </>
            ) : 'Cadastrar'}
          </button>
        </div>

        <Link to="/menu" className="voltar">
          <FaArrowLeft /> Voltar ao Menu
        </Link>
      </form>
    </div>
  );
}

export default CadastrarAvisos;