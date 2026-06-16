import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      color: "white",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "20px"
    }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "10px" }}>⏳ Time Capsule</h1>
      <p style={{ fontSize: "1.2rem", maxWidth: "600px", marginBottom: "40px" }}>
        Send memories to your future self and friends. 
        Write a message today, and we'll deliver it years from now — 
        when you least expect it.
      </p>
      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/register">
          <button style={{
            padding: "12px 30px",
            fontSize: "1rem",
            background: "#6c63ff",
            color: "white",
            border: "none",
            borderRadius: "25px",
            cursor: "pointer"
          }}>
            Start Your Capsule
          </button>
        </Link>
        <Link to="/login">
          <button style={{
            padding: "12px 30px",
            fontSize: "1rem",
            background: "transparent",
            color: "white",
            border: "2px solid #6c63ff",
            borderRadius: "25px",
            cursor: "pointer"
          }}>
            I Already Have One
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Landing;