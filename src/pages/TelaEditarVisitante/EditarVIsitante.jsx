import React, { useState, useEffect } from 'react';
import { db } from '../../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import './EditarVisitante.css';

function EditarVisitante() {
    const [formData, setFormData] = useState({
        nome_completo: '',
        email: '',
        telefone: '',
        cidade_estado: '',
        denominacao: '',
        observacao: '',
        evangelico: false,
    });
    const [etapa, setEtapa] = useState(1);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVisitante = async () => {
            try {
                const docRef = doc(db, 'visitantes', id);
                const docSnapshot = await getDoc(docRef);

                if (docSnapshot.exists()) {
                    setFormData(docSnapshot.data());
                    console.log('Dados do visitante carregados:', docSnapshot.data());
                } else {
                    console.error('Visitante não encontrado');
                    toast.error('Visitante não encontrado');
                }
            } catch (error) {
                console.error('Erro ao carregar os dados do visitante:', error);
                toast.error('Erro ao carregar os dados do visitante');
            }
        };

        fetchVisitante();
    }, [id]);

    // Função para avançar para a próxima etapa
    const avancarEtapa = () => {
        setEtapa((prevEtapa) => prevEtapa + 1);
    };

    // Função para voltar para a etapa anterior
    const voltarEtapa = () => {
        setEtapa((prevEtapa) => prevEtapa - 1);
    };

    // Função para atualizar os dados do visitante
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const docRef = doc(db, 'visitantes', id);
            await updateDoc(docRef, formData);
            toast.success('Visitante atualizado com sucesso!');
            navigate('/listarVisitantes');
        } catch (error) {
            console.error('Erro ao atualizar o visitante:', error);
            toast.error('Erro ao atualizar os dados do visitante');
        }
    };

    return (
        <div className="editar-visitante">
            <h1>Editar Visitante</h1>

            <form className="form" onSubmit={handleSubmit}>
                {etapa === 1 && (
                    <>
                        <div className="form-control">
                            <label htmlFor="nome_completo">Nome</label>
                            <input
                                type="text"
                                id="nome_completo"
                                name="nome_completo"
                                placeholder="Digite o nome do visitante"
                                value={formData.nome_completo}
                                onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })}
                            />
                        </div>
                        <div className="form-control">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Ex: email@gmail.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="form-control">
                            <label htmlFor="telefone">Telefone</label>
                            <input
                                type="tel"
                                id="telefone"
                                name="telefone"
                                placeholder="Ex: (83) 99999-9999"
                                value={formData.telefone}
                                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                            />
                        </div>
                        <div className="form-control">
                            <label htmlFor="cidade_estado">Cidade / Estado</label>
                            <input
                                type="text"
                                id="cidade_estado"
                                name="cidade_estado"
                                placeholder="Ex: Cajazeiras - PB"
                                value={formData.cidade_estado}
                                onChange={(e) => setFormData({ ...formData, cidade_estado: e.target.value })}
                            />
                        </div>

                        <div className="form-check">
                            <label>
                                <input
                                    type="checkbox"
                                    name="evangelico"
                                    checked={formData.evangelico}
                                    onChange={(e) => setFormData({ ...formData, evangelico: e.target.checked })}
                                />
                                Evangélico?
                            </label>
                        </div>

                        <button type="button" onClick={avancarEtapa}>
                            Avançar
                        </button>
                        <Link to="/home">
                            <button type="button" className="voltar">
                                Voltar
                            </button>
                        </Link>
                    </>
                )}

                {etapa === 2 && (
                    <>
                        <div className="form-control">
                            <label htmlFor="denominacao">Denominação</label>
                            <input
                                type="text"
                                id="denominacao"
                                name="denominacao"
                                placeholder="Ex: Assembleia de Deus"
                                value={formData.denominacao}
                                onChange={(e) => setFormData({ ...formData, denominacao: e.target.value })}
                            />
                        </div>
                        <div className="form-control">
                            <label htmlFor="observacao">Observação</label>
                            <textarea
                                id="observacao"
                                name="observacao"
                                placeholder="Ex: Pedido de oração"
                                value={formData.observacao}
                                onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
                                rows="5"
                            />
                        </div>

                        <div className="buttons">
                            <button type="submit">Enviar</button>
                            <button className="voltar" type="button" onClick={voltarEtapa}>
                                Voltar
                            </button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
}

export default EditarVisitante;
