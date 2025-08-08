import logo from './logo.svg';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import AppRouter from "./AppRouter";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
   <AuthProvider>
     <ToastContainer />
    <AppRouter>

    </AppRouter>
   </AuthProvider>
   
  );
}

export default App;
