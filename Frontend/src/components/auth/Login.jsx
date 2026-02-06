import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/"; //this detects if we have attached the details of previous path/page from where we called login.

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    setError("");
    setLoading(true);

    try {
      await login({
        email: emailOrUsername,  //only email login is possible for now.
        password
      });

      // console.log(from);
      
      navigate(from, { replace: true });  // redirect after login
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-zinc-900 rounded-2xl p-8"
      >
        <h1 className="text-2xl font-semibold text-center mb-6">
          Sign in
        </h1>

        {/* Email / Username */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">
            Email or Username
          </label>
          <input
            type="text"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:ring-2 focus:ring-white outline-none"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:ring-2 focus:ring-white outline-none"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-60 transition"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-sm text-gray-400 text-center mt-6">
          Don’t have an account?{" "}
          <span
            className="text-red-500 hover:underline cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
};
