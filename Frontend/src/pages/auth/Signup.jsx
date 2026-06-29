import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Loader } from "lucide-react"
import api from "../../api/axios"
import Input from "../../components/Input"
import {Lock, Mail, User} from "lucide-react"
import Button from "../../components/Button"

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

  //checks if it is email or username and then after registering user will be redirected to verify email page with email in state.
  const handleSubmit = async(e)=>{
    e.preventDefault()
    setError("");
    setLoading(true);
    if (username.includes("@")) {
      setError("Username cannot contain @")
      setLoading(false);
      return;
    }
    if(password !== confirmPassword){
      setError("password should be same in both the fields")
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/users/register", {
        email: email.trim(),
        username: username.trim(),
        password,
        fullName: fullName.trim()
      })
      navigate("/verify-email", {
        state: {email} // we can also send email in query but its not good to send such data in url. so using state.
      })
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
          <Input
            icon={User}
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        {/* Email / Username */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">
            Email 
          </label>
          <Input
            icon={Mail}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">
            Username 
          </label>
          <Input
            icon={User}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Password
          </label>
        </div>
        <div className="relative mb-4">
          <Input
            icon={Lock}
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required  
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
            Confirm password
          </label>
          <div className="relative">
            <Input
              icon={Lock}
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
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
        <Button
          loading={loading}
          type="submit"
        >
          Register
        </Button>

        <p className="text-sm text-gray-400 text-center mt-6">
          Already have an account?{" "}
          <span
            className="text-red-500 hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  )
}