import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth"; // ✅ Correção
import { auth } from "./firebaseConfig";

import TelaInicial from "./src/pages/TelaInicial/TelaInicial";
import Header from "./src/componentes/Header/Header";
import TelaLogin from "./src/pages/TelaLogin/TelaLogin";
import MenuPrincipal from "./src/pages/MenuPrinciapal/MenuPrincipal";
import CadastroVisitante from "./src/pages/TelaCadastroVisitante/CadastroVisitante";
import TelaListaVisitantes from "./src/pages/TelaLIstaVisitantes/ListarVisitantes";
import ApresentarVisitantes from "./src/pages/TelaApresentarVisitantes/ApresentarVisitantes";
import EditarVisitante from "./src/pages/TelaEditarVisitante/EditarVIsitante";
import CadatrarAvisos from "./src/pages/Telavisos/CadastrarAviso";


export default function RoutesApp() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCarregando(false);
    });

    return () => unsubscribe();
  }, []);

  if (carregando) {
    return <div 
    style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      fontSize: '24px', 
      fontWeight: 'bold' 
    }}
    >Carregando...</div>;
  }

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<TelaInicial />} />
        <Route path="/login" element={usuario ? <Navigate to="/home" /> : <TelaLogin />} />
        <Route path="/home" element={usuario ? <MenuPrincipal /> : <Navigate to="/login" />} />
        <Route path="/cadastroVisitante" element={usuario ? <CadastroVisitante /> : <Navigate to="/login" />} />
        <Route path="/listarVisitantes" element={usuario ? <TelaListaVisitantes /> : <Navigate to="/login" />} />
        <Route path="/EditarVisitante/:id" element={usuario ? <EditarVisitante /> : <Navigate to="/login" />} />
        <Route path="/apresentarVisitantes" element={usuario ? <ApresentarVisitantes /> : <Navigate to="/login" />} />
        <Route path="/CadastrarAviso" element={usuario ? <CadatrarAvisos /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={usuario ? "/home" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}
