import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./pages/Home/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
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
      <main className="dashboard-page">
        <div className="dashboard-shell">
          <section className="feedback-card">
            <p>Initializing session...</p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
