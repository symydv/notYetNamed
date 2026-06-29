import React from 'react'
import {useState} from "react"
import { useNavigate, Link, useParams } from "react-router-dom";
import { User, ArrowLeft, Loader, Lock } from "lucide-react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import api from "../../api/axios";
import toast from "react-hot-toast";
function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = useParams();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(password != confirmPassword) return setError("Passwords do not match");
    setLoading(true);
    setError(null);
    try {
      const res = await api.post(`/users/reset-password/${token.token}`, {password});
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (error) {
      setError(error.response.data.message);
    } finally{
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center text-white px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-zinc-900 rounded-2xl p-8"
      >
        <h1 className="text-2xl font-semibold text-center mb-6">
          Reset Password
        </h1>

        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-1">
            New password
          </label>
          <Input
            icon={Lock}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-1">
            Re enter new password
          </label>
          <Input
            icon={Lock}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
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
          Reset password
        </Button>
      </form>
    </div>
  )
}

export default ResetPassword