import { useEffect, useState } from 'react';
import { db } from '../../../firebaseConfig';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
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

            toast.success("Aviso marcado como feito!");
        } catch (error) {
            toast.error("Erro ao atualizar aviso!");
        }
    };

    return (
        <div className="listar-avisos">
            <h2>Avisos</h2>

            {avisos.length === 0 ? (
                <p>Nenhum aviso cadastrado.</p>
            ) : (
                avisos.map((aviso) => (
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
                <button className="voltar">Voltar</button>
            </Link>
        </div>
    );
}

export default ListarAvisos;
