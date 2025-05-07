import { useEffect, useState } from 'react';
import { db, auth } from '../../../firebaseConfig';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { salvarLog } from '../../services/loginServices';
import { buscarNomeUsuario } from '../../services/loginServices';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import './ListarAvisos.css';

function ListarAvisos() {
    const [avisos, setAvisos] = useState([]);

    useEffect(() => {
        async function buscarAvisos() {
            const querySnapshot = await getDocs(collection(db, "avisos"));
            let lista = [];
            querySnapshot.forEach((doc) => {
                lista.push({ id: doc.id, ...doc.data() });
            });

            lista.sort((a, b) => {
                return (a.feito === b.feito) ? 0 : a.feito ? 1 : -1;
            });

            setAvisos(lista);
        }

        buscarAvisos();
    }, []);


    const marcarComoFeito = async (id) => {
        const avisoRef = doc(db, "avisos", id);
        try {
            await updateDoc(avisoRef, { feito: true });

            // Atualiza localmente o aviso
            setAvisos(prev =>
                prev.map(aviso =>
                    aviso.id === id ? { ...aviso, feito: true } : aviso
                )
            );
            const nomeUsuario = await buscarNomeUsuario(auth.currentUser.uid);
            await salvarLog(
                auth.currentUser.uid, nomeUsuario || 'Usuário sem nome',
                'Realizou a marcação de aviso como feito.'
            );

            toast.success("Aviso marcado como feito!");
        } catch (error) {
            toast.error("Erro ao atualizar aviso!");
        }
    };

    const formatarData = (data) => {
        const dataObj = data.seconds ? new Date(data.seconds * 1000) : data;
        return dataObj.toISOString().split('T')[0];
    }

    const dataHoje = formatarData(new Date());

    const avisosDoDia = avisos.filter(aviso => {
        if (!aviso.dataCriacao) return false;
        const dataAviso = formatarData(aviso.dataCriacao);
        return dataAviso === dataHoje;
    });

    return (
        <div className="listar-avisos">
            <h2>Avisos</h2>

            {avisosDoDia.length === 0 ? (
                <p>Nenhum aviso cadastrado para esse dia.</p>
            ) : (
                avisosDoDia.map((aviso) => (
                    <div
                        key={aviso.id}
                        className={`aviso-card ${aviso.feito ? 'feito' : ''}`}
                    >
                        <h3>{aviso.titulo}</h3>
                        <p>{aviso.descricao}</p>


                        {!aviso.feito ? (
                            <button onClick={() => marcarComoFeito(aviso.id)} className="botao-feito">
                                Marcar como feito
                            </button>
                        ) : (
                            <span className="aviso-feito">✅ Aviso concluído</span>
                        )}
                    </div>
                ))
            )}

            <Link to="/home">
                <button className="voltar">Voltar ao menu</button>
            </Link>
        </div>
    );
}

export default ListarAvisos;
