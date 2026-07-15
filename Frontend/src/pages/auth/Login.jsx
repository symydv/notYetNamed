import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Loader, Lock, User} from "lucide-react";
import Input from "../../components/Input";
import Button from "../../components/Button";

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
    let email = null;
    let username = null;
    if(emailOrUsername.includes("@")) {
      email = emailOrUsername;
    }else{
      username = emailOrUsername;
    }

    try {
      await login({
        email,
        username,
        password
      });

      // console.log(from);
      
      navigate(from, { replace: true });  // redirect after login
    } catch (err) {
      setError(err.response?.data.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white px-4">
      <Helmet>
        <title>
          Login - Tapes
        </title>
      </Helmet>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-zinc-900 rounded-2xl p-8"
      >
        <h1 className="text-2xl font-semibold text-center mb-6">
          Log in
        </h1>

        {/* Email / Username */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">
            Email or Username
          </label>
          <Input
            icon={User}
            type="text"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            required
          />
        </div>
        

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-1">
            Password
          </label>
          <Input
            icon={Lock}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center mb-6">
          <Link to="/forgot-password" className="text-sm text-gray-400 hover:text-gray-200 hover:underline">
            Forgot Password?
          </Link>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        {/* Button */}
        <Button
          type = "submit"
          loading={loading}
        >
          Login
        </Button>

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
