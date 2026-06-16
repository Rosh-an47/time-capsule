import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";

const Dashboard = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}>⏳</div>
        <p style={{ color: "white" }}>Opening your capsule...</p>
      </div>
    );
  }
  if (!user) {
    return null;
  }

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <div style={styles.navLeft}>
          <span style={styles.logo}>⏳ Time Capsule</span>
        </div>
        <div style={styles.navRight}>
          <div style={styles.userInfo}>
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Profile"
                style={styles.avatar}
              />
            ) : (
              <div style={styles.avatarPlaceholder}>
                {user.username?.[0]?.toUpperCase() || "?"}
              </div>
            )}
            <span style={styles.username}>{user.displayName || user.username}</span>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Leave Capsule
          </button>
        </div>
      </nav>

      <main style={styles.main}>
        <div style={styles.welcomeCard}>
          <h1 style={styles.welcomeTitle}>
            Hey {user.displayName || user.username} 👋
          </h1>
          <p style={styles.welcomeText}>
            What memory do you want to preserve today? Send a message to your
            future self, or surprise someone special years from now.
          </p>
        </div>

        <div style={styles.actionsGrid}>
          <Link to="/create-capsule" style={styles.actionCard}>
            <div style={styles.actionIcon}>✨</div>
            <h3 style={styles.actionTitle}>Create New Capsule</h3>
            <p style={styles.actionDesc}>
              Upload photos, record voice, write a message — seal it for the
              future.
            </p>
          </Link>

          <Link to="/my-capsules" style={styles.actionCard}>
            <div style={styles.actionIcon}>📦</div>
            <h3 style={styles.actionTitle}>My Capsules</h3>
            <p style={styles.actionDesc}>
              View all your sealed and unlocked capsules.
            </p>
          </Link>

          <Link to="/received" style={styles.actionCard}>
            <div style={styles.actionIcon}>💌</div>
            <h3 style={styles.actionTitle}>Received Capsules</h3>
            <p style={styles.actionDesc}>
              Capsules friends have sent you — some might already be open.
            </p>
          </Link>
        </div>

        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🕰️</div>
          <h3 style={styles.emptyTitle}>No capsules yet</h3>
          <p style={styles.emptyText}>
            Your timeline is empty. Create your first capsule and start building
            memories for the future.
          </p>
        </div>
      </main>
    </div>
  );
};

const styles = {
  loadingContainer: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
  },
  loader: {
    fontSize: "60px",
    animation: "pulse 2s infinite",
  },
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    background: "rgba(0, 0, 0, 0.3)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  },
  navLeft: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    color: "white",
    fontSize: "1.3rem",
    fontWeight: "600",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #6c63ff",
  },
  avatarPlaceholder: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#6c63ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "600",
    fontSize: "1rem",
  },
  username: {
    color: "white",
    fontWeight: "500",
  },
  logoutBtn: {
    padding: "8px 16px",
    background: "transparent",
    color: "rgba(255, 255, 255, 0.7)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "0.85rem",
    transition: "all 0.3s",
  },
  main: {
    padding: "30px",
    maxWidth: "900px",
    margin: "0 auto",
  },
  welcomeCard: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    borderRadius: "16px",
    padding: "30px",
    marginBottom: "25px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  welcomeTitle: {
    color: "white",
    fontSize: "1.8rem",
    marginBottom: "10px",
  },
  welcomeText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: "1rem",
    lineHeight: "1.6",
    maxWidth: "600px",
  },
  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  actionCard: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    borderRadius: "16px",
    padding: "25px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    textDecoration: "none",
    color: "white",
    transition: "transform 0.2s, border-color 0.2s",
    cursor: "pointer",
    display: "block",
  },
  actionIcon: {
    fontSize: "35px",
    marginBottom: "15px",
  },
  actionTitle: {
    fontSize: "1.2rem",
    marginBottom: "8px",
    color: "white",
  },
  actionDesc: {
    fontSize: "0.85rem",
    color: "rgba(255, 255, 255, 0.5)",
    lineHeight: "1.5",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: "16px",
    border: "1px dashed rgba(255, 255, 255, 0.1)",
  },
  emptyIcon: {
    fontSize: "50px",
    marginBottom: "15px",
  },
  emptyTitle: {
    color: "white",
    fontSize: "1.3rem",
    marginBottom: "8px",
  },
  emptyText: {
    color: "rgba(255, 255, 255, 0.4)",
    fontSize: "0.9rem",
    maxWidth: "400px",
    margin: "0 auto",
  },
};

export default Dashboard;