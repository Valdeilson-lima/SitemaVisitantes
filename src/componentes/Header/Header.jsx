import LogoImg from "../../assets/adczOficial.jpeg"
import "./Header.css"
import { useNavigate } from "react-router-dom"

function Header() {

  const navigate = useNavigate()
  function navegarParaTelaInicial(){
    navigate("/")
  }
  return (
    <div className="header">
      <img src={ LogoImg} alt="Logo Igreja" onClick={navegarParaTelaInicial}/>
    </div>
  )
}

export default Header
