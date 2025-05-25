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
import ProtectedRoute from "./componentes/ProtectedRoute";

import Layout from "./componentes/layout/index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <TelaInicial /> },
      { path: "/login", element: <TelaLogin /> },
      { 
        path: "/menu", 
        element: (
          <ProtectedRoute>
            <MenuPrincipal />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "/cadastro-visitante", 
        element: (
          <ProtectedRoute>
            <CadastroVisitante />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "/listar-visitantes", 
        element: (
          <ProtectedRoute>
            <TelaListaVisitantes />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "/apresentar-visitante", 
        element: (
          <ProtectedRoute>
            <ApresentarVisitantes />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "/apresentar-visitante/:id", 
        element: (
          <ProtectedRoute>
            <ApresentarVisitantes />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "/editar-visitante/:id", 
        element: (
          <ProtectedRoute>
            <EditarVisitante />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "/cadastrar-aviso", 
        element: (
          <ProtectedRoute>
            <CadastrarAvisos />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "/listar-avisos", 
        element: (
          <ProtectedRoute>
            <ListarAvisos />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "/cadastrar-usuario", 
        element: (
          <ProtectedRoute>
            <CadastrarUsuario />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "/listar-logs", 
        element: (
          <ProtectedRoute>
            <ListarLogs />
          </ProtectedRoute>
        ) 
      },
    ],
  },
]);

export default router;


