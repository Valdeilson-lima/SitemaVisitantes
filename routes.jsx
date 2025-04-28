import { BrowserRouter, Routes, Route } from "react-router-dom";
import TelaInicial from "./src/pages/TelaInicial/TelaInicial";
import Header from "./src/componentes/Header/Header";
import TelaLogin from "./src/pages/TelaLogin/TelaLogin";
import MenuPrincipal from "./src/pages/MenuPrinciapal/MenuPrincipal";
import CadastroVisitante from "./src/pages/TelaCadastroVisitante/CadastroVisitante";
import TelaListaVisitantes from "./src/pages/TelaLIstaVisitantes/ListarVisitantes";
import ApresentarVisitantes from "./src/pages/TelaApresentarVisitantes/ApresentarVisitantes";
import EditarVisitante from "./src/pages/TelaEditarVisitante/EditarVIsitante";





export default function RoutesApp() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<TelaInicial />} />
        <Route path="/login" element={<TelaLogin />} />
        <Route path="/home" element={<MenuPrincipal />} />
        <Route path="/cadastroVisitante" element={<CadastroVisitante />} />
        <Route path="/listarVisitantes" element={<TelaListaVisitantes />} />
        <Route path="/EditarVisitante/:id" element={<EditarVisitante />} /> 
        <Route path="/apresentarVisitantes" element={<ApresentarVisitantes />} />


      </Routes>
    </BrowserRouter>
  );
}