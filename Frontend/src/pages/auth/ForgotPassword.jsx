import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Input from '../../components/Input'
import { User, ArrowLeft} from 'lucide-react'
import Button from '../../components/Button';
import api from '../../api/axios'
function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // const res = await api.post("/users/forgot-password", {email});
      setIsSubmitted(true);
    } catch (error) {
      setError(error.response.data.message);
    }finally{
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-zinc-900 overflow-hidden shadow-lg text-white">

        <div className="p-8">
          {isSubmitted ? (
            <>
              <h1 className="text-2xl font-semibold text-center mb-6">
                Email Sent
              </h1>

              <p className="text-gray-400 text-center">
                A link to reset your password has been sent to your email address.
              </p>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <h1 className="text-2xl font-semibold text-center mb-6">
                Forgot Password
              </h1>

              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-1 ml-1">
                  Enter your email
                </label>

                <Input
                  icon={User}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm mb-4 text-center">
                  {error}
                </p>
              )}

              <Button loading={loading} type="submit">
                Verify Email
              </Button>
            </form>
          )}
        </div>

        <div className="px-8 py-4 flex justify-center">
          <Link
            to="/login"
            className="text-sm text-green-400 hover:underline flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>
        </div>

      </div>
    </div>
    
  )
}

export default ForgotPassword