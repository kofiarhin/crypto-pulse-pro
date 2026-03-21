import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="">
      <div className="container flex justify-between mx-auto p-4">
        <Link to="/">
          <h1 className="text-2xl">
            CryptoPulse<span className="text-purple-900">Pro</span>{" "}
          </h1>
        </Link>

        <nav className="flex gap-4">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
