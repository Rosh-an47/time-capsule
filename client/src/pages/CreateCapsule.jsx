import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const CreateCapsule = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [contentType, setContentType] = useState("text");
  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");
  const [textContent, setTextContent] = useState("");
  const [unlockDate, setUnlockDate] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  // Recipients state
  const [recipients, setRecipients] = useState([{ email: "" }]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Protect route
  if (!authLoading && !user) {
    navigate("/login");
    return null;
  }

  // Calculate minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  // Handle content type change
  const handleContentTypeChange = (e) => {
    setContentType(e.target.value);
    setMediaFile(null);
    setMediaPreview(null);
    setTextContent("");
    setError("");
  };

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "caption":
        setCaption(value);
        break;
      case "description":
        setDescription(value);
        break;
      case "textContent":
        setTextContent(value);
        break;
      case "unlockDate":
        setUnlockDate(value);
        break;
      default:
        break;
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);

      // Create preview for images and videos
      if (contentType === "photo" || contentType === "video") {
        const url = URL.createObjectURL(file);
        setMediaPreview(url);
      } else {
        setMediaPreview(null);
      }
    }
  };

  // Handle recipient email changes
  const handleRecipientChange = (index, value) => {
    const updatedRecipients = [...recipients];
    updatedRecipients[index].email = value;
    setRecipients(updatedRecipients);
  };

  // Add another recipient field
  const addRecipient = () => {
    setRecipients([...recipients, { email: "" }]);
  };

  // Remove recipient field
  const removeRecipient = (index) => {
    if (recipients.length > 1) {
      const updatedRecipients = recipients.filter((_, i) => i !== index);
      setRecipients(updatedRecipients);
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Validate
      if (!caption.trim()) {
        throw new Error("Please add a caption");
      }
      if (!unlockDate) {
        throw new Error("Please select an unlock date");
      }
      if (contentType === "text" && !textContent.trim()) {
        throw new Error("Please write your message");
      }
      if (
        (contentType === "photo" || contentType === "video" || contentType === "voice") &&
        !mediaFile
      ) {
        throw new Error(`Please select a ${contentType} file`);
      }

      // Filter out empty recipient emails
      const validRecipients = recipients.filter((r) => r.email.trim() !== "");
      if (validRecipients.length === 0) {
        throw new Error("Please add at least one recipient email");
      }

      // Build FormData
      const formData = new FormData();
      formData.append("contentType", contentType);
      formData.append("caption", caption.trim());
      formData.append("description", description.trim());
      formData.append("unlockDate", unlockDate);
      formData.append("recipients", JSON.stringify(validRecipients));

      if (contentType === "text") {
        formData.append("content", textContent.trim());
      } else if (mediaFile) {
        formData.append("media", mediaFile);
      }

      const response = await api.post("/capsules/createCapsule", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Capsule created and sealed! Redirecting...");

      // Reset form
      setCaption("");
      setDescription("");
      setTextContent("");
      setUnlockDate("");
      setMediaFile(null);
      setMediaPreview(null);
      setRecipients([{ email: "" }]);
      setContentType("text");

      // Redirect after short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <Link to="/dashboard" style={styles.logo}>
          ⏳ Time Capsule
        </Link>
        <div style={styles.navRight}>
          <span style={styles.userName}>{user?.displayName || user?.username}</span>
        </div>
      </nav>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.card}>
          <h1 style={styles.title}>Create New Capsule</h1>
          <p style={styles.subtitle}>
            Seal a memory for the future. Add photos, voice notes, or a simple message.
          </p>

          {/* Error Message */}
          {error && (
            <div style={styles.errorBox}>
              <span>❌</span> {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div style={styles.successBox}>
              <span>✅</span> {success}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Content Type Selection */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Content Type</label>
              <div style={styles.typeGrid}>
                {["text", "photo", "video", "voice"].map((type) => (
                  <div
                    key={type}
                    onClick={() => setContentType(type)}
                    style={{
                      ...styles.typeOption,
                      background:
                        contentType === type
                          ? "rgba(108, 99, 255, 0.2)"
                          : "rgba(255, 255, 255, 0.05)",
                      borderColor:
                        contentType === type
                          ? "#6c63ff"
                          : "rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <span style={styles.typeIcon}>
                      {type === "text" && "📝"}
                      {type === "photo" && "📸"}
                      {type === "video" && "🎬"}
                      {type === "voice" && "🎤"}
                    </span>
                    <span style={styles.typeLabel}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Caption */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Caption *</label>
              <input
                type="text"
                name="caption"
                value={caption}
                onChange={handleInputChange}
                placeholder="Give your capsule a title..."
                style={styles.input}
                required
              />
            </div>

            {/* Description */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Description (Optional)</label>
              <textarea
                name="description"
                value={description}
                onChange={handleInputChange}
                placeholder="What's this capsule about? When should it be opened?"
                style={styles.textarea}
                rows={3}
              />
            </div>

            {/* Text Content (only for text type) */}
            {contentType === "text" && (
              <div style={styles.inputGroup}>
                <label style={styles.label}>Your Message *</label>
                <textarea
                  name="textContent"
                  value={textContent}
                  onChange={handleInputChange}
                  placeholder="Dear future me... or Hey [friend's name], remember when..."
                  style={styles.textarea}
                  rows={6}
                  required
                />
              </div>
            )}

            {/* Media Upload (for photo, video, voice) */}
            {(contentType === "photo" ||
              contentType === "video" ||
              contentType === "voice") && (
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  {contentType === "photo" && "Upload Photo *"}
                  {contentType === "video" && "Upload Video *"}
                  {contentType === "voice" && "Upload Audio *"}
                </label>
                <div
                  style={styles.uploadArea}
                  onClick={() => document.getElementById("mediaInput").click()}
                >
                  {mediaPreview && contentType === "photo" ? (
                    <img
                      src={mediaPreview}
                      alt="Preview"
                      style={styles.previewImage}
                    />
                  ) : mediaPreview && contentType === "video" ? (
                    <video src={mediaPreview} controls style={styles.previewVideo} />
                  ) : mediaFile && contentType === "voice" ? (
                    <div style={styles.audioInfo}>
                      <span style={{ fontSize: "30px" }}>🎵</span>
                      <span style={{ color: "white" }}>{mediaFile.name}</span>
                    </div>
                  ) : (
                    <div style={styles.uploadPlaceholder}>
                      <span style={{ fontSize: "40px" }}>
                        {contentType === "photo" && "📷"}
                        {contentType === "video" && "🎥"}
                        {contentType === "voice" && "🎙️"}
                      </span>
                      <span
                        style={{
                          color: "rgba(255,255,255,0.6)",
                          marginTop: "8px",
                        }}
                      >
                        Click to select a {contentType} file
                      </span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  id="mediaInput"
                  accept={
                    contentType === "photo"
                      ? "image/*"
                      : contentType === "video"
                      ? "video/*"
                      : "audio/*"
                  }
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>
            )}

            {/* Unlock Date */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Unlock Date *</label>
              <input
                type="date"
                name="unlockDate"
                value={unlockDate}
                onChange={handleInputChange}
                min={minDate}
                style={styles.input}
                required
              />
              <span style={styles.hint}>
                This capsule will be locked until this date
              </span>
            </div>

            {/* Recipients */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Recipients *</label>
              {recipients.map((recipient, index) => (
                <div key={index} style={styles.recipientRow}>
                  <input
                    type="email"
                    value={recipient.email}
                    onChange={(e) => handleRecipientChange(index, e.target.value)}
                    placeholder="friend@email.com"
                    style={styles.recipientInput}
                  />
                  {recipients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRecipient(index)}
                      style={styles.removeBtn}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addRecipient}
                style={styles.addRecipientBtn}
              >
                + Add Another Recipient
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitBtn,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Sealing Capsule..." : "🔒 Seal Capsule"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

// Styles
const styles = {
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
  logo: {
    color: "white",
    fontSize: "1.3rem",
    fontWeight: "600",
    textDecoration: "none",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  userName: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "0.9rem",
  },
  main: {
    padding: "30px",
    maxWidth: "700px",
    margin: "0 auto",
  },
  card: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "40px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  title: {
    color: "white",
    fontSize: "1.8rem",
    marginBottom: "8px",
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: "0.95rem",
    marginBottom: "30px",
  },
  errorBox: {
    background: "rgba(255, 77, 77, 0.15)",
    border: "1px solid rgba(255, 77, 77, 0.3)",
    color: "#ff6b6b",
    padding: "12px 15px",
    borderRadius: "10px",
    marginBottom: "20px",
    fontSize: "0.9rem",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  successBox: {
    background: "rgba(77, 255, 77, 0.15)",
    border: "1px solid rgba(77, 255, 77, 0.3)",
    color: "#6bff6b",
    padding: "12px 15px",
    borderRadius: "10px",
    marginBottom: "20px",
    fontSize: "0.9rem",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "0.9rem",
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
  textarea: {
    padding: "12px 15px",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    background: "rgba(255, 255, 255, 0.08)",
    color: "white",
    fontSize: "1rem",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
  },
  typeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "10px",
  },
  typeOption: {
    padding: "15px 10px",
    borderRadius: "12px",
    border: "1px solid",
    textAlign: "center",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s",
  },
  typeIcon: {
    fontSize: "24px",
  },
  typeLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "0.8rem",
    fontWeight: "500",
  },
  uploadArea: {
    border: "2px dashed rgba(255, 255, 255, 0.2)",
    borderRadius: "12px",
    padding: "30px",
    textAlign: "center",
    cursor: "pointer",
    transition: "border-color 0.2s",
    minHeight: "150px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadPlaceholder: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  previewImage: {
    maxWidth: "100%",
    maxHeight: "250px",
    borderRadius: "8px",
    objectFit: "cover",
  },
  previewVideo: {
    maxWidth: "100%",
    maxHeight: "250px",
    borderRadius: "8px",
  },
  audioInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  hint: {
    color: "rgba(255, 255, 255, 0.4)",
    fontSize: "0.8rem",
  },
  recipientRow: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  recipientInput: {
    flex: 1,
    padding: "12px 15px",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    background: "rgba(255, 255, 255, 0.08)",
    color: "white",
    fontSize: "1rem",
    outline: "none",
  },
  removeBtn: {
    padding: "8px 12px",
    background: "rgba(255, 77, 77, 0.2)",
    color: "#ff6b6b",
    border: "1px solid rgba(255, 77, 77, 0.3)",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
  addRecipientBtn: {
    padding: "10px",
    background: "transparent",
    color: "#6c63ff",
    border: "1px dashed rgba(108, 99, 255, 0.4)",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "0.9rem",
    marginTop: "5px",
  },
  submitBtn: {
    padding: "16px",
    background: "#6c63ff",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "1.1rem",
    fontWeight: "600",
    marginTop: "10px",
    transition: "background 0.2s",
  },
};

export default CreateCapsule;