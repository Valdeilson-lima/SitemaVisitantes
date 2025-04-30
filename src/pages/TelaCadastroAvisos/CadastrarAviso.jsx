import './CadastrarAviso.css';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../../../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';
import { toast } from 'react-toastify';

function CadastrarAvisos() {

  const navigate = useNavigate();

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titulo || !descricao) {
      toast.error("Preencha todos os campos!");
      return;
    }

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
      navigate('/ListarAvisos');
    } catch (error) {
      console.error(error);
      toast.error("Erro ao cadastrar aviso.");
    }
  };


  return (
    <div className="cadastrar-aviso">
      <h2>Cadastrar Aviso</h2>
      <form className="form" onSubmit={handleSubmit}>

        <div className="form-group">
          <label htmlFor="titulo">Título:</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            placeholder="Título do aviso"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}

          />
        </div>
        <div className="form-group">
          <label htmlFor="descricao">Descrição:</label>
          <textarea
            id="descricao"
            name="descricao"
            placeholder="Descrição do aviso"
            rows={4}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}

          />
        </div>
        <button type="submit">Cadastrar</button>
        <Link to="/home"><button className='voltar'>Voltar</button></Link>
      </form>


    </div>
  );
}

export default CadastrarAvisos;