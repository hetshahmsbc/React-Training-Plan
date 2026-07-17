// Login with Admin / Doctor / Patient tabs. Each tab pre-fills its demo account;
// the role comes from the account the backend returns.

import { useState, type FormEvent } from 'react';
import { useApiRequest } from '@msbc/data-layer';
import { useAuth, type Role } from '../context/AuthContext';
import { ApiUrls } from '../utils/constants';

const ACCOUNTS: Record<Role, { email: string; password: string; label: string }> = {
  admin: { email: 'admin@hospital.com', password: 'admin123', label: 'Admin' },
  doctor: { email: 'aisha.khan@hospital.com', password: 'doctor123', label: 'Doctor' },
  patient: { email: 'vikram.rao@example.com', password: 'patient123', label: 'Patient' },
};

export default function Login() {
  const { login } = useAuth();
  const [tab, setTab] = useState<Role>('admin');
  const [email, setEmail] = useState(ACCOUNTS.admin.email);
  const [password, setPassword] = useState(ACCOUNTS.admin.password);
  const [error, setError] = useState('');

  const { loading, execute } = useApiRequest({
    url: ApiUrls.auth.login,
    method: 'post',
    autoFetch: false,
    config: { authRequired: false },
  });

  const selectTab = (t: Role) => {
    setTab(t);
    setEmail(ACCOUNTS[t].email);
    setPassword(ACCOUNTS[t].password);
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await execute({ body: { email, password } });
      const data = res?.data ?? res;
      if (data?.accessToken && data?.user) {
        login({ accessToken: data.accessToken, refreshToken: data.refreshToken }, data.user);
      } else {
        setError('Unexpected response from server.');
      }
    } catch {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="hms-login">
      <form className="hms-login__card" onSubmit={handleSubmit}>
        <h1 className="hms-login__title">🏥 HMS Clinic</h1>
        <p className="hms-login__subtitle">Sign in to your portal</p>

        <div className="login-tabs">
          {(Object.keys(ACCOUNTS) as Role[]).map((t) => (
            <button
              type="button"
              key={t}
              className={`login-tab${tab === t ? ' login-tab--active' : ''}`}
              onClick={() => selectTab(t)}
            >
              {ACCOUNTS[t].label}
            </button>
          ))}
        </div>

        {error && <div className="hms-login__error">{error}</div>}

        <div className="hms-login__field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="hms-login__field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <button className="hms-login__button" type="submit" disabled={loading}>
          {loading ? 'Signing in…' : `Sign in as ${ACCOUNTS[tab].label}`}
        </button>

        <p className="hms-login__hint">Demo — credentials are pre-filled for each role.</p>
      </form>
    </div>
  );
}
