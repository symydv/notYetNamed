import React from 'react'
import {useState} from "react"
import { Helmet } from 'react-helmet-async'
import toast from "react-hot-toast"
import {useNavigate, useLocation} from "react-router-dom"
import api from "../../api/axios"
function VerifyEmail() {

  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  
  const email = location.state?.email;// we sent email from signup page using state. so getting it here. if someone directly comes to this page then its better to show empty string rather than undefined.

  const handleSubmit = async(e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if(!email){
      setError("Can not access email")
      setLoading(false);
      return
    }
    if(!code){
      setError("Code is required")
      setLoading(false);
      return
    }
    try {
      await api.post("/users/verify-email", {email,verificationToken:code});
      navigate("/login", {replace:true});//remove verify email page from history
      toast.success("Email verified successfully");
    } catch (error) {
      setError(error.response?.data?.message || "Verification failed")
    }finally{
      setLoading(false);
    }

  }
  return (
    <div className="min-h-screen flex items-center justify-center text-white px-4 ">
      <Helmet>
        <title>
          Verify Email - Tapes
        </title>
      </Helmet>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-zinc-900 rounded-2xl p-8 border border-zinc-700"
      >
        <h1 className="text-2xl font-semibold text-center mb-6">
          Verify Your Email
        </h1>
        <h2 className="text-sm text-gray-400 mb-2">
          Enter the verification code sent to your email address
        </h2>
        <input
          type="text"
          inputMode='numeric'
          className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:ring-2 focus:ring-white outline-none mb-6 text-light"
          value={code}
          maxLength={6}
          onChange={(e) => setCode(e.target.value.replace(/\D/g,""))}
        />
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
          className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-60 transition font-normal"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>
      </form>
    </div>
  )
}

export default VerifyEmail