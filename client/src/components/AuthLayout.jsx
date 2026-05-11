import React from "react";

function AuthLayout({
  formTitle,
  formSubtitle,
  footer,
  children,
  statusText,
}) {
  const highlights = [
    {
      title: "Realtime polling",
      text: "Create live polls and watch results update instantly.",
    },
    {
      title: "Secure access",
      text: "Firebase email/password login keeps the app protected.",
    },
    {
      title: "Clean dashboard",
      text: "A modern workspace made for fast action and clarity.",
    },
  ];

  return (
    <div className="auth-shell">
      <div className="auth-orb auth-orb-one" />
      <div className="auth-orb auth-orb-two" />
      <div className="auth-orb auth-orb-three" />

      <section className="auth-left">
        <div className="auth-badge">PulseVote</div>

        <h1 className="auth-heading">
          Build polls.
          <br />
          Track votes.
          <br />
          Stay in sync.
        </h1>

        <p className="auth-copy">
          A premium realtime polling system with secure authentication, live results,
          and a polished experience designed for modern use.
        </p>

        <div className="auth-cards">
          {highlights.map((item) => (
            <div key={item.title} className="auth-feature-card">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="auth-right">
        <div className="auth-panel">
          <div className="auth-panel-header">
            <div className="auth-panel-kicker">Welcome</div>
            <h2>{formTitle}</h2>
            <p>{formSubtitle}</p>
          </div>

          {children}

          {statusText ? <div className="auth-status">{statusText}</div> : null}

          {footer ? <div className="auth-footer">{footer}</div> : null}
        </div>
      </section>
    </div>
  );
}

export default AuthLayout;