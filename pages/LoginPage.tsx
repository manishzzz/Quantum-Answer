import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (email: string, pass: string) => boolean;
  onNavigateToSignUp: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // For demo: any user name from MOCK_USERS can be used as email prefix
    // e.g., "alex@example.com" with any password will log in as Alex.
    const success = onLogin(email, password);
    if (!success) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto animate-slide-in-up">
      <div className="bg-brand-surface-glass rounded-xl border border-white/10 p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="text-3xl font-extrabold text-brand-secondary mb-2 text-center">Welcome Back</h1>
        <p className="text-brand-muted mb-8 text-center">Sign in to continue the evolution.</p>
        
        {error && <p className="bg-red-900/50 border border-red-500 text-red-300 p-3 rounded-md mb-6 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-brand-secondary mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., alex@example.com"
              required
              className="w-full p-3 bg-brand-bg border-2 border-brand-border rounded-md text-brand-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none focus:border-brand-primary transition-all"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-brand-secondary mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full p-3 bg-brand-bg border-2 border-brand-border rounded-md text-brand-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none focus:border-brand-primary transition-all"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-500 transition-all shadow-lg hover:shadow-brand-primary/50"
            >
              Sign In
            </button>
          </div>
        </form>

        <p className="text-center text-brand-muted mt-8">
          Don't have an account?{' '}
          <button onClick={onNavigateToSignUp} className="font-semibold text-brand-primary hover:underline">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
