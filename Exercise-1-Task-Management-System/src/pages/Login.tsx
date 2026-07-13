import { useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // stop the browser from reloading the page
    const success = login(username, password);
    if (success) {
      navigate("/"); // go to the dashboard
    } else {
      setError("Please enter both a username and a password.");
    }
  }

  return (
    <div className="auth">
      <form onSubmit={handleSubmit} className="auth__card">
        <div className="auth__logo">✓</div>
        <h1 className="auth__title">Task Manager</h1>
        <p className="auth__subtitle">Sign in to continue</p>

        <Input
          id="username"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. het"
        />
        <Input
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="any password"
        />

        {error && <p className="auth__error">{error}</p>}

        <Button type="submit">Sign In</Button>

        <p className="auth__hint">Tip: enter any username &amp; password to continue.</p>
      </form>
    </div>
  );
}
