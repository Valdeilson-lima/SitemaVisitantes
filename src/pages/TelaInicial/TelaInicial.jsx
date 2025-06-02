import React from 'react'
import './TelaInicial.css'
import { useNavigate } from 'react-router-dom'
import { FaChurch, FaUsers, FaClipboardList, FaBell } from 'react-icons/fa'

const features = [
    {
        icon: <FaUsers />,
        title: "Cadastro de Visitantes",
        description: "Registre novos visitantes de forma rápida e organizada"
    },
    {
        icon: <FaClipboardList />,
        title: "Gestão de Visitantes",
        description: "Visualize e gerencie todos os visitantes cadastrados"
    },
    {
        icon: <FaBell />,
        title: "Sistema de Avisos",
        description: "Comunique-se com a equipe através de avisos importantes"
    }
]

function FeatureItem({ icon, title, description }) {
    return (
        <div className="feature-item">
            <div className="feature-icon">{icon}</div>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    )
}

function TelaInicial() {
    const navigate = useNavigate()

    const handleAccessSystem = () => {
        navigate('/login')
    }

    return (
        <div className="tela-inicial">
            <header className="logo-container">
                <FaChurch className="logo-icon" />
            </header>

            <main>
                <h1>Bem-vindo ao Sistema de Visitantes</h1>
                <p className="welcome-text">
                    Sistema de gestão de visitantes da nossa igreja.<br />
                    Uma ferramenta completa para gerenciar a recepção e acompanhamento de visitantes.
                </p>

                <section className="features-container">
                    {features.map((feature, idx) => (
                        <FeatureItem
                            key={idx}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </section>

                <button onClick={handleAccessSystem} className="enter-button">
                    Acessar o Sistema
                </button>
            </main>

            <footer className="tela-inicial-footer">
                <p>Sistema desenvolvido para fortalecer a comunhão em nossa igreja</p>
            </footer>
        </div>
    )
}

export default TelaInicial