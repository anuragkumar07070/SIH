import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { MailCheck } from 'lucide-react';

export default function ConfirmSignUpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const username = location.state?.username; // Get username from navigation state

  if (!username) {
    return (
        <div className="flex items-center justify-center h-screen text-center">
            <div>
                <h2 className="text-xl font-bold">Error</h2>
                <p className="text-gray-600">Username not found. Please sign up again.</p>
                <Link to="/signup" className="text-blue-600">Go to Sign Up</Link>
            </div>
        </div>
    );
  }

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError('');
    setIsConfirming(true);
    try {
      await confirmSignUp({ username, confirmationCode: code });
      navigate('/login'); // Redirect to login on success
    } catch (err) {
      setError(err.message);
    } finally {
        setIsConfirming(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    try {
      await resendSignUpCode({ username });
      alert('A new confirmation code has been sent to your email.');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="relative z-10 w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 text-white">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                        <MailCheck className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold">Verify Your Email</h2>
                    <p className="text-gray-300 mt-2">A confirmation code was sent to <span className="font-medium">{username}</span>.</p>
                </div>

                <form onSubmit={handleConfirm} className="space-y-6">
                    <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-200 mb-2">
                            Confirmation Code
                        </label>
                        <input
                            type="text"
                            id="code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full pl-4 pr-4 py-3 bg-white/10 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border-white/30"
                            placeholder="Enter the code"
                        />
                    </div>
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    <button type="submit" disabled={isConfirming} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50">
                        {isConfirming ? 'Verifying...' : 'Verify Account'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button onClick={handleResendCode} className="text-sm text-blue-400 hover:text-blue-300">
                        Didn't receive a code? Resend
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}
