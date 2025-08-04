import logo from './logo.svg';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import AppRouter from "./AppRouter";

function App() {
  return (
   <AuthProvider>
    <AppRouter></AppRouter>
   </AuthProvider>
  );
}

export default App;
