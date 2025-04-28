import React from 'react'
import './TelaInicial.css'
import { useNavigate } from 'react-router-dom'


function TelaInicial() {
    const navigation = useNavigate()
    function handleClick() {
        navigation('/login')
    }

  return (
    <div className='tela-inicial'>
      <h1>Bem-Vindo</h1>
      <p>Este é o app de recepção de visitantes da nossa igreja. Aqui você poderá cadastrar, visualizar e apresentar visitantes com facilidade!</p>
      <button onClick={handleClick}>Entrar</button>
    </div>
  )
}

export default TelaInicial
