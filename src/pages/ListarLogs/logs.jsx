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
      return dataLog.getDate() === dataAtual.getDate() && 
             dataLog.getMonth() === dataAtual.getMonth() && 
             dataLog.getFullYear() === dataAtual.getFullYear();
    });
    setLogsDoDia(logsDoDia);
  }, [logs]);

  return (
    <div className='lista-logs'>
      <h1>Logs de Atividades</h1>
      {logsDoDia.length > 0 ? (
        <ul>
          {logsDoDia.map(log => (
            <li key={log.id}>
              <p><strong>Usuário:</strong> {log.nomeUsuario}</p>
              <p><strong>Ação:</strong> {log.acao}</p>
              <p><strong>Data e hora:</strong> {log.data?.toDate().toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="sem-logs">Nenhum log registrado hoje.</p>
      )}
      <Link to="/menu" className="btn-voltar">Voltar ao Menu</Link>
    </div>
  );
}

export default ListarLogs;
