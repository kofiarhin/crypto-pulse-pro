import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { useInitializeAuth } from "./hooks/queries/useInitializeAuth";

const Home = lazy(() => import("./pages/Home/Home"));
const CoinDetails = lazy(() => import("./pages/CoinDetails/CoinDetails"));
const Login = lazy(() => import("./pages/Login/Login"));
const Register = lazy(() => import("./pages/Register/Register"));

const PageFallback = () => (
  <main className="min-h-screen bg-slate-950 px-4 py-6 text-white" />
);

const App = () => {
  useInitializeAuth();

  return (
    <Router>
      <Header />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/coins/:symbol" element={<CoinDetails />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Suspense>
      <Footer />
    </Router>
  );
};

export default App;
