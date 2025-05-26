import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auth } from '../../../firebaseConfig';
import { salvarLog, buscarNomeUsuario } from '../../services/loginServices';
import { cadastrarVisitante } from '../../services/visitanteServices';
import { FaArrowLeft, FaUserPlus, FaSpinner } from 'react-icons/fa';
import './CadastroVisitante.css';

const formatarTelefone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
        return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
};

const INITIAL_FORM_STATE = {
    nome_completo: '',
    email: '',
    telefone: '',
    cidade_estado: '',
    denominacao: '',
    observacao: '',
    evangelico: false,
    autoriza_imagem: false,
};

function CadastroVisitante() {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name === 'telefone') {
            const formattedValue = formatarTelefone(value);
            setFormData(prev => ({ ...prev, [name]: formattedValue }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const validateStepOne = async () => {
        if (!formData.nome_completo.trim()) {
            toast.error(
                <div>
                    <strong style={{ fontWeight: 'bold', fontSize: '16px' }}>Campo Obrigatório:</strong>
                    <p style={{ marginTop: '5px', color: '#fff', fontSize: '15px', fontWeight: 'bold' }}>
                        • O nome do visitante é obrigatório
                    </p>
                </div>,
                {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                }
            );
            return false;
        }
        return true;
    };

    const handleNext = async () => {
        const isValid = await validateStepOne();
        if (isValid) {
            setStep(2);
        }
    };

    const handleBack = () => setStep(1);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            if (!formData.nome_completo.trim()) {
                throw new Error("O nome do visitante é obrigatório");
            }

            await cadastrarVisitante(formData);
            toast.success(
                <div>
                    <strong style={{ fontWeight: 'bold', fontSize: '16px' }}>Sucesso!</strong>
                    <p style={{ marginTop: '5px', fontSize: '15px' }}>
                        Visitante cadastrado com sucesso!
                    </p>
                </div>,
                {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                }
            );
            
            const nomeUsuario = await buscarNomeUsuario(auth.currentUser.uid);
            await salvarLog(
                auth.currentUser.uid,
                nomeUsuario || 'Usuário sem nome',
                'Realizou Cadastro de um Visitante.'
            );

            setFormData(INITIAL_FORM_STATE);
            navigate('/listar-visitantes');
        } catch (err) {
            console.error("Erro ao cadastrar visitante:", err);
            toast.error(
                <div>
                    <strong style={{ fontWeight: 'bold', fontSize: '16px' }}>Erro!</strong>
                    <p style={{ marginTop: '5px', fontSize: '15px' }}>
                        {err.message || 'Erro ao cadastrar visitante.'}
                    </p>
                </div>,
                {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                }
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleLimparStep1 = () => {
        setFormData(prev => ({
            ...prev,
            nome_completo: '',
            email: '',
            telefone: '',
            cidade_estado: '',
            evangelico: false
        }));
    };

    const handleLimparStep2 = () => {
        setFormData(prev => ({
            ...prev,
            denominacao: '',
            observacao: ''
        }));
    };

    const renderStepOne = () => (
        <div className="fade-in">
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
                    maxLength="15"
                />
            </div>
            <div className="form-control">
                <label htmlFor="cidade_estado">Localidade</label>
                <input
                    type="text"
                    id="cidade_estado"
                    name="cidade_estado"
                    placeholder='Ex: Cajazeiras - PB'
                    value={formData.cidade_estado}
                    onChange={handleChange}
                />
            </div>
            <div className="form-check">
                <input
                    type="checkbox"
                    id="evangelico"
                    name="evangelico"
                    checked={formData.evangelico}
                    onChange={handleChange}
                />
                <label htmlFor="evangelico">Evangélico?</label>
            </div>
            <div className="buttons-container">
                <button 
                    type="button" 
                    onClick={handleLimparStep1}
                    className="btn-limpar"
                >
                    Limpar
                </button>
                <button type="button" onClick={handleNext} disabled={isLoading}>
                    Avançar
                </button>
            </div>
            <Link to="/menu" className="voltar">
                <FaArrowLeft /> Voltar ao Menu
            </Link>
        </div>
    );

    const renderStepTwo = () => (
        <div className="fade-in">
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
            <div className="buttons-container">
                <button 
                    className="btn-limpar" 
                    type="button" 
                    onClick={handleLimparStep2}
                    disabled={isLoading}
                >
                    Limpar
                </button>
                <button 
                    type="button" 
                    onClick={handleSubmit} 
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
            <button 
                className="voltar" 
                type="button" 
                onClick={handleBack} 
                disabled={isLoading}
            >
                <FaArrowLeft /> Voltar
            </button>
        </div>
    );

    return (
        <div className="cadastro-visitante">
            <h1>
                <FaUserPlus className="title-icon" /> Realize o Cadastro
            </h1>
            <div className="progress-bar">
                <div className={`progress-step ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}>1</div>
                <div className={`progress-step ${step === 2 ? 'active' : ''}`}>2</div>
            </div>
            <form onSubmit={(e) => e.preventDefault()}>
                {step === 1 ? renderStepOne() : renderStepTwo()}
            </form>
        </div>
    );
}

export default CadastroVisitante;