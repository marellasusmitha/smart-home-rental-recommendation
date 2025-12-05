import React, { useState } from 'react';
import { UserRole } from '../types';
import { Home, ArrowLeft, CheckCircle } from 'lucide-react';

interface AuthProps {
  onLogin: (email: string, role: UserRole) => void;
  onRegister: (email: string, password: string) => void;
}

export const Landing: React.FC<{ onGetStarted: () => void, onSignIn: () => void }> = ({ onGetStarted, onSignIn }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-4">
    <div className="max-w-4xl text-center space-y-8 animate-fadeIn">
      <div className="flex justify-center mb-6">
        <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
          <Home size={64} className="text-white" />
        </div>
      </div>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
        Find Your Dream Home with <br />
        <span className="text-yellow-300">AI + AR/VR</span> Visualization
      </h1>
      <p className="text-xl md:text-2xl text-indigo-100 max-w-2xl mx-auto">
        Experience rentals like never before. Smart AI recommendations and immersive 360° views.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
        <button onClick={onGetStarted} className="px-8 py-3 bg-white text-indigo-600 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-lg">
          Get Started
        </button>
        <button onClick={onSignIn} className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition">
          Sign In
        </button>
      </div>
    </div>
  </div>
);

export const Login: React.FC<AuthProps & { onBack: () => void, onSwitchToRegister: () => void, onForgotPassword: () => void }> = ({ onLogin, onBack, onSwitchToRegister, onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.TENANT);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(email && password) onLogin(email, role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value={password} onChange={e => setPassword(e.target.value)} />
            <div className="flex justify-end mt-1">
              <button type="button" onClick={onForgotPassword} className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline">
                Forgot Password?
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">I am a:</label>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2 cursor-pointer p-2 border rounded hover:bg-gray-50 transition-colors w-1/2 justify-center">
                <input type="radio" name="role" checked={role === UserRole.TENANT} onChange={() => setRole(UserRole.TENANT)} className="text-indigo-600 focus:ring-indigo-500" />
                <span className="text-gray-900 font-medium">Tenant</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer p-2 border rounded hover:bg-gray-50 transition-colors w-1/2 justify-center">
                <input type="radio" name="role" checked={role === UserRole.OWNER} onChange={() => setRole(UserRole.OWNER)} className="text-indigo-600 focus:ring-indigo-500" />
                <span className="text-gray-900 font-medium">Owner</span>
              </label>
            </div>
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition font-semibold">Login</button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account? <button onClick={onSwitchToRegister} className="text-indigo-600 hover:underline">Sign up</button>
        </p>
        <button onClick={onBack} className="mt-2 w-full text-center text-sm text-gray-400 hover:text-gray-600">Back to Home</button>
      </div>
    </div>
  );
};

export const Register: React.FC<{ onRegister: (email: string, pass: string) => void, onBack: () => void, onSwitchToLogin: () => void }> = ({ onRegister, onBack, onSwitchToLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(password !== confirm) {
          alert("Passwords do not match");
          return;
      }
      if(email && password) onRegister(email, password);
    };
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Create Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input type="password" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value={confirm} onChange={e => setConfirm(e.target.value)} />
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition font-semibold">Sign Up</button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account? <button onClick={onSwitchToLogin} className="text-indigo-600 hover:underline">Login</button>
          </p>
          <button onClick={onBack} className="mt-2 w-full text-center text-sm text-gray-400 hover:text-gray-600">Back to Home</button>
        </div>
      </div>
    );
};

export const ForgotPassword: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(email) {
      // Simulate API call
      setTimeout(() => setIsSubmitted(true), 800);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        {!isSubmitted ? (
          <>
            <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">Reset Password</h2>
            <p className="text-center text-gray-500 mb-6 text-sm">Enter your email address and we'll send you a link to reset your password.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input 
                  type="email" 
                  required 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition font-semibold">
                Send Reset Link
              </button>
            </form>
            <button onClick={onBack} className="mt-4 w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700">
              <ArrowLeft size={16} /> Back to Login
            </button>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Link Sent!</h3>
            <p className="mt-2 text-sm text-gray-500">
              If an account exists for {email}, we have sent a password reset link to it.
            </p>
            <button 
              onClick={onBack} 
              className="mt-6 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};