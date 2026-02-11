// frontend/src/pages/Register.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import RegisterForm from "../components/Auth/RegisterForm";
import toast from "react-hot-toast";

const Register = () => {
  const { user, register, loading, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (fullName, email, password, confirmPassword) => {
    try {
      await register(fullName, email, password, confirmPassword);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (submitError) {
      toast.error(submitError.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8 reveal-item" data-reveal>
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Join Digital Coaching
          </h1>
          <p className="text-muted-foreground">
            Create your account to get started
          </p>
        </div>

        {/* Register Card */}
        <div className="card tilt-card reveal-item" data-reveal data-tilt>
          <h2 className="text-2xl font-semibold text-card-foreground mb-6 text-center">
            Create Account
          </h2>

          <RegisterForm
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
