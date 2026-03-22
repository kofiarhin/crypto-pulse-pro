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
    <header className="border-b border-slate-800 bg-slate-950 text-slate-200">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 p-4">
        <Link to="/" aria-label="Go to markets" className="text-xl font-semibold text-white">
          CryptoPulse<span className="text-blue-400">Pro</span>
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link to="/">Markets</Link>
          {!isAuthenticated ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <>
              <span className="text-slate-300">{user?.fullName}</span>
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
