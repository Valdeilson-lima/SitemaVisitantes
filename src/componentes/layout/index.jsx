import Header from "../../componentes/Header/Header";
import { Outlet } from "react-router-dom";

function Layout() {
    return (
        <div>
            <Header />
            <Outlet />
        </div>
    );
}

export default Layout;