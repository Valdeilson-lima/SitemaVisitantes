import { createBrowserRouter } from "react-router-dom";

import TelaInicial from "./pages/TelaInicial/TelaInicial";
import TelaLogin from "./pages/TelaLogin/TelaLogin";
import MenuPrincipal from "./pages/MenuPrinciapal/MenuPrincipal";
import CadastroVisitante from "./pages/TelaCadastroVisitante/CadastroVisitante";
import TelaListaVisitantes from "./pages/TelaLIstaVisitantes/ListarVisitantes";
import ApresentarVisitantes from "./pages/TelaApresentarVisitantes/ApresentarVisitantes";
import EditarVisitante from "./pages/TelaEditarVisitante/EditarVIsitante";
import CadastrarAvisos from "./pages/TelaCadastroAvisos/CadastrarAviso";
import ListarAvisos from "./pages/TelaListarAvisos/ListarAvisos";
import CadastrarUsuario from "./pages/TelaCadastroUsuario/CadastroUsuario";
import ListarLogs from "./pages/ListarLogs/logs";

import Layout from "./componentes/layout/index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <TelaInicial /> },
      { path: "/login", element: <TelaLogin /> },
      { path: "/menu", element: <MenuPrincipal /> },
      { path: "/cadastro-visitante", element: <CadastroVisitante /> },
      { path: "/listar-visitantes", element: <TelaListaVisitantes /> },
      { path: "/apresentar-visitante", element: <ApresentarVisitantes /> },
      { path: "/apresentar-visitante/:id", element: <ApresentarVisitantes /> },
      { path: "/editar-visitante/:id", element: <EditarVisitante /> },
      { path: "/cadastrar-aviso", element: <CadastrarAvisos /> },
      { path: "/listar-avisos", element: <ListarAvisos /> },  
      { path: "/cadastrar-usuario", element: <CadastrarUsuario /> },
      { path: "/listar-logs", element: <ListarLogs /> },
    ],
  },
]);

export default router;


