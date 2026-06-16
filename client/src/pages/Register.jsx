import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    displayName: "",
    email: "",
    password: "",
  });

  const [profilePicture, setProfilePicture] = useState(null);

  const [previewUrl, setPreviewUrl] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page refresh
    setError("");
    setLoading(true);

    try {

      const data = new FormData();
      data.append("username", formData.username);
      data.append("displayName", formData.displayName);
      data.append("email", formData.email);
      data.append("password", formData.password);

      // Only append profile picture if user selected one
      if (profilePicture) {
        data.append("profilePicture", profilePicture);
      }

      const response = await register(data);

      console.log("Registration successful:", response);
      // Redirect to login page after successful registration
      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Your Account</h1>
        <p style={styles.subtitle}>
          Start building capsules for your future self
        </p>

        {error && (
          <div style={styles.errorBox}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>

          <div style={styles.profilePicSection}>
            <div
              style={styles.profilePicPreview}
              onClick={() => document.getElementById("profilePicture").click()}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile preview"
                  style={styles.profilePicImage}
                />
              ) : (
                <div style={styles.profilePicPlaceholder}>
                  <span style={{ fontSize: "40px" }}>📷</span>
                  <span style={{ fontSize: "12px", marginTop: "5px" }}>
                    Add Photo
                  </span>
                </div>
              )}
            </div>
            <input
              type="file"
              id="profilePicture"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Username *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your Username"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Display Name</label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              placeholder="Enter your Display Name"
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your Email"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
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
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Sign in
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
    maxWidth: "420px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  },
  title: {
    color: "white",
    fontSize: "1.8rem",
    marginBottom: "5px",
    textAlign: "center",
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: "0.9rem",
    textAlign: "center",
    marginBottom: "25px",
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
  profilePicSection: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  profilePicPreview: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    border: "2px dashed rgba(255, 255, 255, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    overflow: "hidden",
    transition: "border-color 0.3s",
  },
  profilePicImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  profilePicPlaceholder: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "rgba(255, 255, 255, 0.5)",
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
    transition: "border-color 0.3s",
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
    transition: "background 0.3s",
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

export default Register;