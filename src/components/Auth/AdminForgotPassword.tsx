import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./AdminForgotPassword.module.css";
import { z } from "zod";
import axios from "axios";
import { API_CONFIG } from "../../config/api";

const requestResetSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

const AdminForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const result = requestResetSchema.safeParse({ email });
    if (!result.success) {
      setError(
        result.error.flatten().fieldErrors.email?.[0] || "Invalid input."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/auth/admin/reset-password`,
        { email }
      );
      setSuccessMessage(
        response.data.message ||
          "If an account with that email exists, a reset link has been sent."
      );
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error || "An unexpected error occurred.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authImageSection}>
        <img src="/resetPasswordImage.avif" alt="Admin Panel" />
      </div>

      <div className={styles.authFormSection}>
        <div className={styles.formWrapper}>
          <h2>Forgot Your Password?</h2>
          <p className={styles.insturctionsText}>
            No problem. Enter your admin email address below and we'll send you
            a link to reset it.
          </p>

          {successMessage ? (
            <div
              style={{
                color: "#16a34a",
                textAlign: "center",
                padding: "1rem",
                backgroundColor: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "0.5rem",
              }}
            >
              {successMessage}
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {error && <p className={styles.apiError}>{error}</p>}

              <div className={styles.inputGroup}>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your admin email"
                  required
                />
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}

          <p className={styles.switchAuthLink}>
            <Link to="/login">Back to Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPassword;
