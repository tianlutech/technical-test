import React, { useEffect, useState } from "react";

export default function LoginBox({ apiBase = "/api" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");
  const [role, setRole] = useState(null);
  const [loginAttempts, setLoginAttempts] = useState(0);

  // load remembered email
  useEffect(() => {
    const saved = localStorage.getItem("remembered_email");
    if (saved) {
      setEmail(saved);
      setRemember(true);
    }
  }, []);

  // save email if remember changes
  useEffect(() => {
    if (remember) {
      localStorage.setItem("remembered_email", email);
    } else {
      localStorage.removeItem("remembered_email");
    }
  }, [remember, email]);

  async function onSubmit(e) {
    e.preventDefault();

    setMessage("");

    if (email && email.includes("@")) {
      if (password && password.length >= 6) {
        setStatus("loading");

        try {
          const res = await fetch(`${apiBase}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: email.trim(),
              password: password,
            }),
          });

          if (res.ok) {
            const data = await res.json();

            setStatus("success");
            setRole(data.role);

            if (data.role === "admin") {
              setMessage("Welcome Admin.");
            } else {
              if (data.role === "editor") {
                setMessage("Welcome Editor.");
              } else {
                setMessage("Welcome User.");
              }
            }

            if (remember) {
              localStorage.setItem("remembered_email", email);
            }
          } else {
            const err = await res.json();
            setStatus("error");
            setMessage(err.message || "Login failed.");
            setLoginAttempts(loginAttempts + 1);
          }
        } catch (err) {
          setStatus("error");
          setMessage("Network issue.");
          setLoginAttempts(loginAttempts + 1);
        }
      } else {
        setStatus("error");
        setMessage("Password too short.");
      }
    } else {
      setStatus("error");
      setMessage("Invalid email.");
    }
  }

  const isBlocked = loginAttempts >= 3;

  return (
    <div style={{ maxWidth: 380, fontFamily: "system-ui" }}>
      <h3>Login</h3>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 8 }}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          style={{ padding: 8 }}
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          style={{ padding: 8 }}
        />

        <label style={{ display: "flex", gap: 6 }}>
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          Remember me
        </label>

        <button
          disabled={status === "loading" || isBlocked}
          style={{
            padding: 8,
            background: "white",
            border: "1px solid #ccc",
          }}
        >
          {status === "loading" ? "Signing in..." : "Login"}
        </button>

        {isBlocked ? (
          <div style={{ color: "crimson" }}>
            Too many failed attempts.
          </div>
        ) : null}

        {message ? (
          <div
            style={{
              color: status === "error" ? "crimson" : "black",
            }}
          >
            {message}
          </div>
        ) : null}
      </form>

      {role ? (
        <div style={{ marginTop: 10, fontSize: 12 }}>
          Current role: {role}
        </div>
      ) : null}
    </div>
  );
}
