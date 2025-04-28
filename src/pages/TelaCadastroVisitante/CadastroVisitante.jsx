import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { db, addDoc, collection, serverTimestamp } from '../../../firebaseConfig';

import './CadastroVisitante.css';
import { toast } from 'react-toastify';

const schema = yup.object().shape({
    nome_completo: yup.string().required('Nome é obrigatório'),
    telefone: yup.string(),
    cidade_estado: yup.string(),
    denominacao: yup.string(),
    observacao: yup.string(),
    apresentado: yup.boolean(),
    evangelico: yup.boolean(),
    autoriza_imagem: yup.boolean(),
});

function CadastroVisitante() {
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nome_completo: '',
        cpf: '',
        email: '',
        telefone: '',
        cidade_estado: '',
        denominacao: '',
        observacao: '',
        apresentado: false,
        evangelico: false,
        autoriza_imagem: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };


    const validateStepOne = async () => {
        try {
            await schema.validate({
                nome_completo: formData.nome_completo,
                cpf: formData.cpf,
                email: formData.email,
                telefone: formData.telefone,
                cidade_estado: formData.cidade_estado,
            }, { abortEarly: false });

            return true;
        } catch (err) {
            if (err.inner) {
                toast.error(
                    <div>
                        <strong style={{ fontWeight: 'bold', fontSize: '16px' }}>Preencha os campos obrigatórios:</strong>
                        <ul style={{ marginTop: '5px', listStyleType: 'none', paddingLeft: 0, color: 'red', fontSize: '15px', fontWeight: 'bold' }}>
                            {err.inner.map((e, i) => (
                                <li key={i}>•  {e.message}</li>
                            ))}
                        </ul>
                    </div>
                );
            }
            return false;
        }
    };


    const handleNext = async () => {
        const isValid = await validateStepOne();
        if (isValid) {
            setStep(2);
        }
    };

    const handleBack = () => setStep(1);

    const cadastrarVisitante = async (dados) => {
        try {
            const visitantesRef = collection(db, 'visitantes');

            
            await addDoc(visitantesRef, {
                ...dados,
                data_cadastro: serverTimestamp(),
            });
        } catch (error) {
            console.error("Erro ao cadastrar visitante: ", error);
            throw new Error("Erro ao cadastrar visitante");
        }
    };

    const handleSubmit = async () => {
        try {
            await cadastrarVisitante(formData);
            toast.success('Visitante cadastrado com sucesso!');
            navigate('/listarVisitantes');
        } catch (err) {
            console.error(err);
            toast.error('Erro ao cadastrar visitante.');
        }
    };

    return (
        <div className="cadastro-visitante">
            <h1>Cadastro de Visitante</h1>

            <form className="form" onSubmit={(e) => e.preventDefault()}>
                {step === 1 && (
                    <>
                        <div className="form-control">
                            <label htmlFor="nome_completo">Nome</label>
                            <input
                                type="text"
                                id="nome_completo"
                                name="nome_completo"
                                placeholder='Digite o nome do visitante'
                                value={formData.nome_completo}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-control">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder='Ex: email@gmail.com'
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-control">
                            <label htmlFor="telefone">Telefone</label>
                            <input
                                type="tel"
                                id="telefone"
                                name="telefone"
                                placeholder='Ex: (83) 99999-9999'
                                value={formData.telefone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-control">
                            <label htmlFor="cidade_estado">Cidade / Estado</label>
                            <input
                                type="text"
                                id="cidade_estado"
                                name="cidade_estado"
                                placeholder='Ex: Cajazeiras - PB'
                                value={formData.cidade_estado}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-check">
                            <label>
                                <input
                                    type="checkbox"
                                    name="evangelico"
                                    checked={formData.evangelico}
                                    onChange={handleChange}
                                />
                                Evangélico?
                            </label>
                        </div>

                        <button type="button" onClick={handleNext}>Avançar</button>
                        <Link to="/home"><button type="button" className="voltar">Voltar</button></Link>
                    </>
                )}

                {step === 2 && (
                    <>
                        <div className="form-control">
                            <label htmlFor="denominacao">Denominação</label>
                            <input
                                type="text"
                                id="denominacao"
                                name="denominacao"
                                placeholder='Ex: Assembleia de Deus'
                                value={formData.denominacao}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-control">
                            <label htmlFor="observacao">Observação</label>
                            <textarea
                                id="observacao"
                                name="observacao"
                                placeholder='Ex: Pedido de oração'
                                value={formData.observacao}
                                onChange={handleChange}
                                rows="5"
                            />
                        </div>
                       
                        {/* <div className="form-control">
                            <label>
                                <input
                                    type="checkbox"
                                    name="autoriza_imagem"
                                    checked={formData.autoriza_imagem}
                                    onChange={handleChange}
                                />
                                Autoriza uso de imagem nas transmissões?
                            </label>
                        </div> */}

                        <div className="buttons">
                            <button type="button" onClick={handleSubmit}>Enviar</button>
                            <button className='voltar' type="button" onClick={handleBack}>Voltar</button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
}

export default CadastroVisitante;
