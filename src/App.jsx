import { useState, useEffect } from "react";
import { setOnUnauthorized } from "./api/axiosClient.jsx";
import LoginForm from "./components/login-form.jsx";
import Dashboard from "./components/Dashboard.jsx";
import SignupForm from "./components/signup-form.jsx";
function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-3">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-muted-foreground">Loading dashboard...</p>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [authView, setAuthView] = useState("login");
  const [signupMessage, setSignupMessage] = useState("");
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState('');

  useEffect(() => {
    setOnUnauthorized(() => {
      setUser(null);
      setSessionExpiredMessage("Your session expired. Please log in again.");
      setAuthView("login");
    });
  }, []);
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setCheckingSession(false);
  }, []);

  const handleLoginSuccess = (loggedInUser) => {
    setSessionExpiredMessage('');
    setUser(loggedInUser);
  };
  const handleSignupSuccess = () => {
    setSignupMessage(
      `Account created for "${newUser.username}". Please log in.`,
    );
    setAuthView("login");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (checkingSession) {
    return <Spinner />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          {authView === "login" ? (
            <LoginForm
              onLoginSuccess={handleLoginSuccess}
              onSwitchToSignup={() => setAuthView("signup")}
              successMessage={signupMessage}
              warningMessage={sessionExpiredMessage}
            />
          ) : (
            <SignupForm
              onSignupSuccess={handleSignupSuccess}
              onSwitchToLogin={() => setAuthView("login")}
            />
          )}
        </div>
      </div>
    );
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}
