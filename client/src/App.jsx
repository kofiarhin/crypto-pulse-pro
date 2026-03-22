import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./pages/Home/Home";
import CoinDetails from "./pages/CoinDetails/CoinDetails";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import { useInitializeAuth } from "./hooks/queries/useInitializeAuth";

const App = () => {
  useInitializeAuth();
  const initialized = useSelector((state) => state.auth.initialized);

  if (!initialized) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-6 text-white">
        <p>Initializing session...</p>
      </main>
    );
  }

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coins/:symbol" element={<CoinDetails />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
