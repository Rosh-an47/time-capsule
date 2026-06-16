import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {

  const [loginId, setLoginId] = useState(""); 
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const isEmail = loginId.includes("@");
      const credentials = isEmail 
        ? { email: loginId, password } 
        : { username: loginId, password };

      await login(credentials);
      
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Something went wrong. Try again?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <div style={styles.iconContainer}>
          <span style={styles.icon}>⏳</span>
        </div>

        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>
          Your future self is waiting
        </p>

        {error && (
          <div style={styles.errorBox}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email or Username</label>
            <input
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder="cooluser123 or john@example.com"
              style={styles.input}
              required
              autoFocus
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={styles.input}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}

            onMouseEnter={(e) => {
              if (!loading) e.target.style.background = "#5a52e0";
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.background = "#6c63ff";
            }}
          >
            {loading ? "Unlocking..." : "Unlock Your Capsule"}
          </button>
        </form>

        <p style={styles.footerText}>
          Don't have a capsule yet?{" "}
          <Link to="/register" style={styles.link}>
            Create one now
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  card: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "40px",
    width: "100%",
    maxWidth: "400px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  },
  iconContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "15px",
  },
  icon: {
    fontSize: "50px",
    animation: "pulse 3s infinite",
  },
  title: {
    color: "white",
    fontSize: "1.8rem",
    marginBottom: "5px",
    textAlign: "center",
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: "0.9rem",
    textAlign: "center",
    marginBottom: "25px",
    fontStyle: "italic",
  },
  errorBox: {
    background: "rgba(255, 77, 77, 0.15)",
    border: "1px solid rgba(255, 77, 77, 0.3)",
    color: "#ff6b6b",
    padding: "10px 15px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "0.9rem",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  label: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "0.85rem",
    fontWeight: "500",
  },
  input: {
    padding: "12px 15px",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    background: "rgba(255, 255, 255, 0.08)",
    color: "white",
    fontSize: "1rem",
    outline: "none",
  },
  button: {
    padding: "14px",
    background: "#6c63ff",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "600",
    marginTop: "10px",
  },
  footerText: {
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "center",
    marginTop: "20px",
    fontSize: "0.9rem",
  },
  link: {
    color: "#6c63ff",
    textDecoration: "none",
    fontWeight: "500",
  },
};

export default Login;