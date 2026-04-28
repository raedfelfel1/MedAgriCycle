//gestion des routes avec react-router-dom
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BarSide from "./components/ui/BarSide";
import ProducInformation from "./pages/ProductInformation";
import AddFarm from "./pages/AddFarm";
import AddProduct from "./pages/AddProduct";
import { BottomNavigation } from "@mui/material";
import Farm from "./components/farms/Farm";
import User from "./pages/User";
import UserUpdate from "../src/pages/UserUpdate";
import Board from "../src/pages/Board";
import Inventaire from "./pages/Inventaire";
import Finance from "./pages/Finance";
import Statistiques from "./pages/Statistiques";
import Report from "./pages/Report";
import Settings from "./pages/Settings";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import UpdateFarm from "./pages/UpdateFarm";
import Recommandation from "./pages/Recommandation";
import Admin from "./pages/Admin";

import Fertilisation from "./pages/Fertilisation";
import Irrigation from "./pages/Irrigation";
import { DataProvider } from './contexts/DataContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ThemeProvider } from './contexts/ThemeContext';
import './contexts/styles/App.css';
import AddTank from './components/tanks/AddTank';
import ShowTank from './components/tanks/ShowTank';
import ShowProduct from './components/products/ShowProduct';
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <DataProvider>
          <ThemeProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Connexion />} />
                <Route path="/connexion" element={<Connexion />} />
                <Route path="/verify-email/:token" element={<VerifyEmail />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/inscription" element={<Inscription />} />
                <Route path="/farm" element={
                  <ProtectedRoute>
                    <Farm />
                  </ProtectedRoute>
                } />
                <Route path="/bottom" element={<BottomNavigation />} />
                <Route path="/side" element={<BarSide />} />
                <Route path="/finance" element={
                  <ProtectedRoute>
                    <Finance />
                  </ProtectedRoute>
                } />
                <Route path="/fertilisation" element={
                  <ProtectedRoute>
                    <Fertilisation />
                  </ProtectedRoute>
                } />
                <Route path="/irrigation" element={
                  <ProtectedRoute>
                    <Irrigation />
                  </ProtectedRoute>
                } />
                <Route path="/report" element={
                  <ProtectedRoute>
                    <Report />
                  </ProtectedRoute>
                } />
                <Route path="/user" element={
                  <ProtectedRoute>
                    <User />
                  </ProtectedRoute>
                } />
                <Route path="/setting" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
                <Route path="/statistique" element={
                  <ProtectedRoute>
                    <Statistiques />
                  </ProtectedRoute>
                } />
                <Route path="/board" element={
                  <ProtectedRoute>
                    <Board />
                  </ProtectedRoute>
                } />
                <Route path="/inventaire" element={
                  <ProtectedRoute>
                    <Inventaire />
                  </ProtectedRoute>
                } />
                <Route path="/userUpdate" element={
                  <ProtectedRoute>
                    <UserUpdate />
                  </ProtectedRoute>
                } />
                <Route path="/updateFarm" element={
                  <ProtectedRoute>
                    <UpdateFarm />
                  </ProtectedRoute>
                } />
                <Route path="/informationsProduit" element={
                  <ProtectedRoute>
                    <ProducInformation />
                  </ProtectedRoute>
                } />
                <Route path="/ajoutProduit" element={
                  <ProtectedRoute>
                    <AddProduct />
                  </ProtectedRoute>
                } />
                <Route path="/ajoutFerme" element={
                  <ProtectedRoute>
                    <AddFarm />
                  </ProtectedRoute>
                } />
                <Route path="/recommandation" element={
                  <ProtectedRoute>
                    <Recommandation />
                  </ProtectedRoute>
                } />
                <Route path="/addTank" element={
                  <ProtectedRoute>
                    <AddTank />
                  </ProtectedRoute>
                } />
                <Route path="/showTank" element={
                  <ProtectedRoute>
                    <ShowTank />
                  </ProtectedRoute>
                } />
                <Route path="/showProduct" element={
                  <ProtectedRoute>
                    <ShowProduct />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                } />
              </Routes>
            </Router>
          </ThemeProvider>
        </DataProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
