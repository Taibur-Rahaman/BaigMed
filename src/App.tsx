import React, { useState, useEffect } from 'react';
import { DashboardPage } from './DashboardPage';
import { HomePage } from './HomePage';
import api from './api';

export type View = 'home' | 'login' | 'dashboard';

export const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    name: '',
    clinicName: '',
    phone: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('baigdentpro:token');
    const savedUser = localStorage.getItem('baigdentpro:user');
    if (token && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setUserName(user.name);
      } catch {}
    }
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const form = e.currentTarget;
    const email = (form.querySelector('input[name="email"]') as HTMLInputElement)?.value?.trim();
    const password = (form.querySelector('input[name="password"]') as HTMLInputElement)?.value;

    try {
      const result = await api.auth.login(email, password);
      localStorage.setItem('baigdentpro:user', JSON.stringify(result.user));
      setUserName(result.user.name);
      setView('dashboard');
    } catch (err: any) {
      if (email && password) {
        setUserName(email.split('@')[0] || 'User');
        setView('dashboard');
      } else {
        setError(err.message || 'Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await api.auth.register(registerData);
      localStorage.setItem('baigdentpro:user', JSON.stringify(result.user));
      setUserName(result.user.name);
      setView('dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    api.auth.logout();
    localStorage.removeItem('baigdentpro:user');
    setUserName('');
    setView('home');
  };

  if (view === 'home') {
    return <HomePage onLoginClick={() => setView('login')} />;
  }

  if (view === 'dashboard') {
    return <DashboardPage onLogout={handleLogout} userName={userName || undefined} />;
  }

  return (
    <div className="app-shell">
      <main className="auth-shell">
        <section className="hero-panel">
          <div className="hero-logo" onClick={() => setView('home')} style={{ cursor: 'pointer' }}>
            <i className="fa-solid fa-tooth"></i>
            BaigDentPro
          </div>
          <h1 className="hero-title">All-in-One Dental Practice Management</h1>
          <p className="hero-subtitle">
            One powerful dashboard for everything. Prescriptions, patient records, 
            appointments, billing, and lab orders — all in one place.
          </p>
          <div className="hero-features">
            <div className="hero-feature">
              <i className="fa-solid fa-prescription-bottle-medical"></i>
              <span>Digital Prescriptions with Drug Database</span>
            </div>
            <div className="hero-feature">
              <i className="fa-solid fa-users"></i>
              <span>Complete Patient Records & Dental Charts</span>
            </div>
            <div className="hero-feature">
              <i className="fa-solid fa-calendar-check"></i>
              <span>Smart Appointment Scheduling with SMS</span>
            </div>
            <div className="hero-feature">
              <i className="fa-solid fa-file-invoice-dollar"></i>
              <span>Billing, Invoices & Payment Tracking</span>
            </div>
            <div className="hero-feature">
              <i className="fa-solid fa-flask"></i>
              <span>Lab Order Tracking (Crown, Bridge, Denture)</span>
            </div>
            <div className="hero-feature">
              <i className="fa-brands fa-whatsapp"></i>
              <span>WhatsApp & Email Integration</span>
            </div>
          </div>
          <button className="btn-secondary" onClick={() => setView('home')} style={{ marginTop: '20px' }}>
            <i className="fa-solid fa-arrow-left"></i> Back to Home
          </button>
        </section>
        <section className="form-panel">
          <div className="card login-card">
            <div className="card-header">
              <div className="card-title">{isRegister ? 'Create Account' : 'Welcome Back'}</div>
              <div className="card-subtitle">{isRegister ? 'Register to get started' : 'Sign in to your unified dashboard'}</div>
            </div>

            {!isRegister && (
              <div className="unified-panel-info">
                <div className="panel-icon">
                  <i className="fa-solid fa-chart-pie"></i>
                </div>
                <div className="panel-details">
                  <h4>Unified Dashboard</h4>
                  <p>Access all features in one place: Prescriptions, Patients, Appointments, Billing, Lab Orders & more</p>
                </div>
              </div>
            )}

            {error && <div className="error-message"><i className="fa-solid fa-exclamation-circle"></i> {error}</div>}

            {isRegister ? (
              <form onSubmit={handleRegister}>
                <div className="form-group">
                  <label className="label">Full Name</label>
                  <input
                    className="input"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    placeholder="Dr. John Doe"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="label">Email</label>
                  <input
                    className="input"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    placeholder="doctor@clinic.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="label">Password</label>
                  <input
                    className="input"
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    placeholder="Create a password"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="label">Clinic Name (Optional)</label>
                  <input
                    className="input"
                    value={registerData.clinicName}
                    onChange={(e) => setRegisterData({ ...registerData, clinicName: e.target.value })}
                    placeholder="Your Dental Clinic"
                  />
                </div>
                <div className="form-group">
                  <label className="label">Phone (Optional)</label>
                  <input
                    className="input"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                    placeholder="+880 1XXXXXXXXX"
                  />
                </div>
                <div className="actions-row">
                  <button type="submit" className="btn-primary" disabled={isLoading}>
                    {isLoading ? <><i className="fa-solid fa-spinner fa-spin"></i> Creating...</> : <><i className="fa-solid fa-user-plus"></i> Create Account</>}
                  </button>
                </div>
                <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.9rem' }}>
                  Already have an account?{' '}
                  <button type="button" className="link-btn" onClick={() => setIsRegister(false)}>
                    Sign In
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label className="label">Email</label>
                  <input className="input" name="email" type="email" placeholder="doctor@clinic.com" required />
                </div>
                <div className="form-group">
                  <label className="label">Password</label>
                  <input className="input" name="password" type="password" placeholder="Enter password" required />
                </div>
                <div className="actions-row">
                  <button type="submit" className="btn-primary" disabled={isLoading}>
                    {isLoading ? <><i className="fa-solid fa-spinner fa-spin"></i> Signing In...</> : <><i className="fa-solid fa-sign-in-alt"></i> Sign In to Dashboard</>}
                  </button>
                </div>
                <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.9rem' }}>
                  New to BaigDentPro?{' '}
                  <button type="button" className="link-btn" onClick={() => setIsRegister(true)}>
                    Create Account
                  </button>
                </p>
              </form>
            )}

            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <p>Demo: demo@baigdentpro.com / password123</p>
              <p style={{ marginTop: '8px' }}>© 2024 BaigDentPro • Omix Solutions</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
