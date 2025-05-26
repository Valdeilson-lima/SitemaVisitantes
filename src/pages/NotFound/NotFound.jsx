import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome, FaArrowLeft } from 'react-icons/fa';
import './NotFound.css';

function NotFound() {
    return (
        <div className="not-found">
            <div className="not-found-content">
                <FaExclamationTriangle className="warning-icon" />
                <h1>404 - Página Não Encontrada</h1>
                <p>Ops! Parece que você se perdeu. A página que você está procurando não existe ou foi movida.</p>
                <div className="buttons-container">
                    <Link to="/" className="home-button">
                        <FaHome /> Voltar para a Página Inicial
                    </Link>
                    <button onClick={() => window.history.back()} className="home-button">
                        <FaArrowLeft /> Voltar para a Página Anterior
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NotFound; 