import React from 'react'
import './TelaInicial.css'
import { useNavigate } from 'react-router-dom'
import { FaChurch, FaUsers, FaClipboardList, FaBell } from 'react-icons/fa'

function TelaInicial() {
    const navigation = useNavigate()
    
    function handleClick() {
        navigation('/login')
    }

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

    return (
        <div className='tela-inicial'>
            <div className="logo-container">
                <FaChurch className="logo-icon" />
            </div>
            
            <h1>Bem-Vindo ao Sistema de Visitantes</h1>
            
            <p className="welcome-text">
                Este é o sistema de gestão de visitantes da nossa igreja. 
                Uma ferramenta completa para gerenciar a recepção e acompanhamento de visitantes.
            </p>

            <div className="features-container">
                {features.map((feature, index) => (
                    <div key={index} className="feature-item">
                        <div className="feature-icon">{feature.icon}</div>
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                    </div>
                ))}
            </div>

            <button onClick={handleClick} className="enter-button">
                Acessar o Sistema
            </button>

            <footer className="tela-inicial-footer">
                <p>Desenvolvido com ❤️ para nossa igreja</p>
            </footer>
        </div>
    )
}

export default TelaInicial