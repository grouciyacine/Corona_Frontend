import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Corona from './pages/Corona';
import Services from './pages/Services';
import Patients from './pages/Patients';
import LoginPage from './pages/LoginPage';
import Admin from './pages/Admin';
import ComptesInfermier from './pages/ComptesInfermier';
export default function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Patients" element={<Patients/>} />
      <Route path='/services' element={<Services />} />
      <Route path="/corona" element={<Corona />} />
      <Route path='/Admin' element={<Admin/>}/>
      <Route path='/Login' element={<LoginPage/>}/>
      <Route path="/admin/comptes" element={<ComptesInfermier />} />
      <Route path='/admin/historiques' element={<Patients/>}/>
    </Routes>
  </BrowserRouter>
);
}



