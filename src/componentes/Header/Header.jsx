import LogoImg from "../../assets/adczOficial.jpeg";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

function Header() {
  const navigate = useNavigate();
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuarioLogado(!!user);
    });

    return () => unsubscribe(); // Cleanup
  }, []);

  function navegarParaTelaInicial() {
    if (usuarioLogado) {
      navigate("/menu");
    } else {
      navigate("/");
    }
  }

  return (
    <div className="header">
      <img src={LogoImg} alt="Logo Igreja" onClick={navegarParaTelaInicial} />
    </div>
  );
}

export default Header;
