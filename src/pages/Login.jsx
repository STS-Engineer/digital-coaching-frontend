// frontend/src/pages/Login.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoginForm from "../components/Auth/LoginForm";
import toast from "react-hot-toast";

const Login = () => {
  const { user, login, loading, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (email, password) => {
    try {
      await login(email, password);
      toast.success("Successfully logged in!");
      navigate("/dashboard");
    } catch (submitError) {
      toast.error(submitError.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8 reveal-item" data-reveal>
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Digital Coaching
          </h1>
          <p className="text-muted-foreground">
            Sign in to access your coaching assistants
          </p>
        </div>

        {/* Login Card */}
        <div className="card tilt-card reveal-item" data-reveal data-tilt>
          <h2 className="text-2xl font-semibold text-card-foreground mb-6 text-center">
            Sign In
          </h2>

          <LoginForm onSubmit={handleSubmit} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
};

export default Login;
