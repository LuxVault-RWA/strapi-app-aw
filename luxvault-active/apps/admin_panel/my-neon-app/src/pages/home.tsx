import type { CSSProperties } from "react";

const panel: CSSProperties = {
  background: "rgba(10, 15, 35, 0.72)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 24,
  boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
};

export function Home() {
  return (
    <main style={{ minHeight: "100vh", color: "#f4f7ff", background: "radial-gradient(circle at top left, #2b3a67 0%, #111827 45%, #070b14 100%)", fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "40px 24px 64px" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 48, flexWrap: "wrap" }}>
          <div>
            <div style={{ letterSpacing: 3, textTransform: "uppercase", color: "#8fb7ff", fontSize: 12 }}>Admin Panel</div>
            <h1 style={{ margin: "10px 0 0", fontSize: "clamp(2.4rem, 6vw, 5.4rem)", lineHeight: 0.95 }}>LuxVault Wallet Auth</h1>
          </div>
          <nav style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="/" style={linkStyle}>Home</a>
            <a href="/auth/login" style={linkStyle}>Auth</a>
            <a href="/account" style={linkStyle}>Account</a>
          </nav>
        </header>

        <section style={{ ...panel, padding: 28 }}>
          <p style={{ maxWidth: 760, fontSize: 18, lineHeight: 1.7, color: "#d6def5", marginTop: 0 }}>
            This admin shell now uses the connected wallet to sign the LuxVault login challenge and hand the signature to the API. The backend decides whether the wallet is authorized and sets the session cookie.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginTop: 28 }}>
            <Card title="Auth route" body="Open the auth screen to connect a wallet, sign the challenge, and establish the backend session." href="/auth/login" />
            <Card title="Account route" body="Open the account screen to inspect the active role scope and sign out." href="/account" />
            <Card title="Backend" body="The login flow posts to /api/auth/login and reads /api/auth/session with credentials included." />
          </div>
        </section>
      </div>
    </main>
  );
}

function Card(props: { title: string; body: string; href?: string }) {
  const content = (
    <div style={{ ...panel, padding: 18, minHeight: 150 }}>
      <div style={{ fontSize: 14, color: "#8fb7ff", marginBottom: 8 }}>{props.title}</div>
      <div style={{ color: "#e8ecf8", lineHeight: 1.6 }}>{props.body}</div>
    </div>
  );

  if (props.href) {
    return (
      <a href={props.href} style={{ textDecoration: "none" }}>
        {content}
      </a>
    );
  }

  return content;
}

const linkStyle: CSSProperties = {
  color: "#edf2ff",
  textDecoration: "none",
  padding: "10px 14px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.16)",
  background: "rgba(255,255,255,0.06)",
};
