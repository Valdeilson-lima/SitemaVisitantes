import RoutesApp from "../routes"
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'

function App() {


  return (
    <>
    <RoutesApp />
    <ToastContainer autoClose={3000} />
    </>

  )
}

export default App
