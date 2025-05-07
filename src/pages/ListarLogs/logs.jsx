import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { Link } from 'react-router-dom';
import './logs.css';

function ListarLogs() {
  const [logs, setLogs] = useState([]);
  const [logsDoDia, setLogsDoDia] = useState([]);

  useEffect(() => {
    async function fetchLogs() {
      const q = query(collection(db, "logs"), orderBy("data", "desc"));
      const querySnapshot = await getDocs(q);
      const logsArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLogs(logsArray);
    }

    fetchLogs();
  }, []);

  
  useEffect(() => {
    const logsDoDia = logs.filter(log => {
      const dataLog = log.data?.toDate();
      if (!dataLog) return false;
      const dataAtual = new Date();
      return dataLog.getDate() === dataAtual.getDate() && dataLog.getMonth() === dataAtual.getMonth() && dataLog.getFullYear() === dataAtual.getFullYear();
    });
    setLogsDoDia(logsDoDia);
  }, [logs]);

  return (
    <div className='lista-logs'>
      <h2>Logs de Atividades</h2>
      <ul>
        {logsDoDia.map(log => (
          <li key={log.id}>
            <p><strong>Usuario:</strong> {log.nomeUsuario}</p>
            <p><strong>Ação:</strong> {log.acao}</p>
            <p><strong>Data e hora: </strong>  {log.data?.toDate().toLocaleString()}</p>
          </li>
        ))}
      </ul>

      <Link to="/home">
        <button className="btn-voltar">Voltar ao Menu</button>
      </Link>
    </div>
  );
}

export default ListarLogs;
