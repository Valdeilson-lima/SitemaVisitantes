import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { db, auth } from '../../../firebaseConfig';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { salvarLog, buscarNomeUsuario } from '../../services/loginServices';

import './ListarAvisos.css';

function ListarAvisos() {
    const [avisos, setAvisos] = useState([]);

    // Função para formatar a data para o formato local (pt-BR)
    const formatarData = (data) => {
        const dataObj = data.seconds ? new Date(data.seconds * 1000) : new Date(data);
        return dataObj.toLocaleDateString('pt-BR'); // dd/mm/aaaa
    };

    // Função para comparar se duas datas são no mesmo dia
    const isMesmoDia = (data1, data2) => {
        return data1.getDate() === data2.getDate() &&
            data1.getMonth() === data2.getMonth() &&
            data1.getFullYear() === data2.getFullYear();
    };

    // Buscar os avisos no Firestore
    useEffect(() => {
        async function buscarAvisos() {
            try {
                const querySnapshot = await getDocs(collection(db, "avisos"));
                let lista = [];

                querySnapshot.forEach((doc) => {
                    lista.push({ id: doc.id, ...doc.data() });
                });

                // Ordenar: não feitos primeiro
                lista.sort((a, b) => (a.feito === b.feito) ? 0 : a.feito ? 1 : -1);

                setAvisos(lista);
            } catch (error) {
                toast.error("Erro ao buscar avisos.");
            }
        }

        buscarAvisos();
    }, []);

    // Marcar aviso como feito
    const marcarComoFeito = async (id) => {
        const avisoRef = doc(db, "avisos", id);
        try {
            await updateDoc(avisoRef, { feito: true });

            // Atualiza localmente
            setAvisos(prev =>
                prev.map(aviso =>
                    aviso.id === id ? { ...aviso, feito: true } : aviso
                )
            );

            const nomeUsuario = await buscarNomeUsuario(auth.currentUser.uid);
            await salvarLog(
                auth.currentUser.uid,
                nomeUsuario || 'Usuário sem nome',
                'Realizou a marcação de aviso como feito.'
            );

            toast.success("Aviso marcado como feito!");
        } catch (error) {
            toast.error("Erro ao atualizar aviso!");
        }
    };

    // Filtrar apenas avisos do dia atual
    const hoje = new Date();
    const avisosDoDia = avisos.filter(aviso => {
        if (!aviso.dataCriacao) return false;
        const dataAviso = aviso.dataCriacao.seconds
            ? new Date(aviso.dataCriacao.seconds * 1000)
            : new Date(aviso.dataCriacao);
        return isMesmoDia(dataAviso, hoje);
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
                        {/* <small className="data-aviso">
                            Criado em: {formatarData(aviso.dataCriacao)}
                        </small> */}

                        {!aviso.feito ? (
                            <button
                                onClick={() => marcarComoFeito(aviso.id)}
                                className="botao-feito"
                                aria-label="Marcar aviso como feito"
                            >
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
