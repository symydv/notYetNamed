import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../api/axios"


// right now the sign up is not completed as we are not verifying emails and just letting them register. handle it later.

export const Signup = ()=>{
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async(e)=>{
    e.preventDefault()
    setError("");
    setLoading(true);
    if(password !== confirmPassword){
      setError("password should be same in both the fields")
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/users/register", {email, username, password, fullName})
      navigate("/login")
    } catch (err) {
      setError(err.response?.data.message);
    }finally{
      setLoading(false)
    }

  }

  return (
    <div className="min-h-screen flex items-center justify-center text-white px-4">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-zinc-900 rounded-2xl p-8"
      >
        <h1 className="text-2xl font-semibold text-center mb-6">
          Sign up
        </h1>
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">
            Full name 
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:ring-2 focus:ring-white outline-none"
          />
        </div>
        {/* Email / Username */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">
            Email 
          </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:ring-2 focus:ring-white outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">
            Username 
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:ring-2 focus:ring-white outline-none"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            password
          </label>
        </div>
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 pr-12 rounded-lg bg-zinc-800 border border-zinc-700 focus:ring-2 focus:ring-white outline-none"
          />

          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-white"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {/* confirm password */}
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-1">
            confirm password
          </label>
          <div className="flex relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:ring-2 focus:ring-white outline-none"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(prev => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-white"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
          
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
          {loading ? "Signing up..." : "register"}
        </button>

        <p className="text-sm text-gray-400 text-center mt-6">
          already have an account?{" "}
          <span
            className="text-red-500 hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            login
          </span>
        </p>
      </form>
    </div>
  )
}