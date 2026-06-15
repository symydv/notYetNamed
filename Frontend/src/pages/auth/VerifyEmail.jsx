import React from 'react'
import {useState} from "react"
function VerifyEmail() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async(e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  }
  return (
    <div className="min-h-screen flex items-center justify-center text-white px-4 ">
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
          className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:ring-2 focus:ring-white outline-none mb-6 text-light"
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