import React, { useState } from 'react';

interface SignUpPageProps {
  onSignUp: (name: string, email: string, pass: string) => void;
  onNavigateToLogin: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onSignUp, onNavigateToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignUp(name, email, password);
  };

  return (
    <div className="max-w-md mx-auto animate-slide-in-up">
      <div className="bg-brand-surface-glass rounded-xl border border-white/10 p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="text-3xl font-extrabold text-brand-secondary mb-2 text-center">Create Your Account</h1>
        <p className="text-brand-muted mb-8 text-center">Join the community and start evolving answers.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
           <div>
            <label htmlFor="name" className="block text-sm font-semibold text-brand-secondary mb-2">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Alex Ray"
              required
              className="w-full p-3 bg-brand-bg border-2 border-brand-border rounded-md text-brand-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none focus:border-brand-primary transition-all"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-brand-secondary mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., alex.ray@example.com"
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
              placeholder="Choose a strong password"
              required
              minLength={8}
              className="w-full p-3 bg-brand-bg border-2 border-brand-border rounded-md text-brand-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none focus:border-brand-primary transition-all"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-500 transition-all shadow-lg hover:shadow-brand-primary/50"
            >
              Create Account
            </button>
          </div>
        </form>

        <p className="text-center text-brand-muted mt-8">
          Already have an account?{' '}
          <button onClick={onNavigateToLogin} className="font-semibold text-brand-primary hover:underline">
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
