import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLogoutMutation } from "../../hooks/mutations/useAuthMutations";

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const logoutMutation = useLogoutMutation();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    navigate("/");
  };

  return (
    <header>
      <div className="container flex flex-wrap items-center justify-between gap-3 mx-auto p-4">
        <Link to="/" aria-label="Go to home">
          <h1 className="text-2xl">
            CryptoPulse<span className="text-purple-900">Pro</span>
          </h1>
        </Link>

        <nav className="flex items-center gap-4">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          {!isAuthenticated ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <>
              <span className="text-sm text-slate-300">{user?.fullName}</span>
              <button type="button" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
