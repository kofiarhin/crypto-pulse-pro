import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../hooks/mutations/useAuthMutations";
import { extractApiError } from "../../lib/apiClient";

const Register = () => {
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!formData.fullName.trim()) {
      setFormError("Full name is required.");
      return;
    }

    if (formData.password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    try {
      await registerMutation.mutateAsync({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      navigate("/dashboard");
    } catch (error) {
      setFormError(extractApiError(error));
    }
  };

  return (
    <section className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="mt-2 text-sm text-slate-400">Register for persisted preferences</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="mb-2 block text-sm font-medium">Full Name</label>
            <input id="fullName" name="fullName" type="text" value={formData.fullName} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500" required />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">Email</label>
            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500" required />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium">Password</label>
            <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500" required />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium">Confirm Password</label>
            <input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500" required />
          </div>

          {(formError || registerMutation.error) && (
            <p className="text-sm text-rose-400">{formError || extractApiError(registerMutation.error)}</p>
          )}

          <button type="submit" disabled={registerMutation.isPending} className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60">
            {registerMutation.isPending ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-400">
          Already registered? <Link to="/login" className="text-emerald-400">Login</Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
