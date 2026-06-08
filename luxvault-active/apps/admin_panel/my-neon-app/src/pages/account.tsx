import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

import { logoutAdminSession, requestAdminSession, type AdminRoleScope } from "../lib/auth";

const shell: CSSProperties = {
  minHeight: "100vh",
  padding: 24,
  color: "white",
  background: "radial-gradient(circle at top, #27345d 0%, #101827 55%, #070b14 100%)",
  fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
};

const panel: CSSProperties = {
  background: "rgba(10, 15, 35, 0.74)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 24,
  boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
};

export function Account() {
  const [roleScope, setRoleScope] = useState<AdminRoleScope | null>(null);
  const [status, setStatus] = useState("Loading account state.");
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadAccountState() {
      try {
        const current = await requestAdminSession();
        if (cancelled) {
          return;
        }

        setRoleScope(current);
        setStatus(current ? "Wallet session is active." : "No active admin session.");
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load account state.");
        }
      }
    }

    void loadAccountState();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleRefresh() {
    setIsBusy(true);
    setError(null);

    try {
      const current = await requestAdminSession();
      setRoleScope(current);
      setStatus(current ? "Wallet session is active." : "No active admin session.");
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : "Unable to refresh the account state.");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleSignOut() {
    setIsBusy(true);
    setError(null);

    try {
      await logoutAdminSession();
      setRoleScope(null);
      setStatus("Signed out and cleared the admin cookie.");
    } catch (signOutError) {
      setError(signOutError instanceof Error ? signOutError.message : "Unable to sign out.");
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <main style={shell}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 34, flexWrap: "wrap" }}>
          <div>
            <div style={{ letterSpacing: 3, textTransform: "uppercase", color: "#8fb7ff", fontSize: 12 }}>Account</div>
            <h1 style={{ margin: "10px 0 0", fontSize: "clamp(2rem, 4vw, 4rem)", lineHeight: 1 }}>Admin account view</h1>
          </div>
          <nav style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="/" style={buttonStyle}>Home</a>
            <a href="/auth/login" style={buttonStyle}>Auth</a>
          </nav>
        </header>

        <section style={{ ...panel, padding: 24 }}>
          <p style={{ marginTop: 0, color: "#d6def5", lineHeight: 1.7 }}>
            This screen reads the cookie-backed admin session issued after the wallet signature flow. It shows the current scope the backend recognizes, not a separate local account store.
          </p>

          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", marginTop: 20 }}>
            <Metric label="Status" value={status} />
            <Metric label="Wallet" value={roleScope?.actorWallet ?? "Not loaded"} />
            <Metric label="Environment" value={roleScope?.environment ?? "Not loaded"} />
            <Metric label="Permissions" value={roleScope?.permissions.join(", ") || "None"} />
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
            <button type="button" onClick={() => void handleRefresh()} disabled={isBusy} style={buttonStyle}>
              Refresh session
            </button>
            <button type="button" onClick={() => void handleSignOut()} disabled={isBusy} style={buttonStyle}>
              Sign out
            </button>
          </div>

          {error ? <StatusCard title="Error" value={error} tone="danger" /> : <StatusCard title="Notes" value="Use the auth screen to connect a wallet, sign the challenge, and create a cookie-backed session." tone="info" />}
        </section>

        <section style={{ ...panel, padding: 24, marginTop: 20 }}>
          <div style={sectionLabel}>Scope details</div>
          {roleScope ? (
            <div style={{ display: "grid", gap: 14, marginTop: 16 }}>
              <Field label="Actor ID" value={roleScope.actorId} />
              <Field label="Read only" value={roleScope.isReadOnly ? "Yes" : "No"} />
              <Field label="Roles" value={roleScope.roles.join(", ") || "None"} />
              <Field label="Permissions" value={roleScope.permissions.join(", ") || "None"} />
            </div>
          ) : (
            <p style={{ margin: "16px 0 0", color: "#d6def5", lineHeight: 1.7 }}>
              No active admin session is available yet.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

function Metric(props: { label: string; value: string }) {
  return (
    <div style={{ padding: 18, borderRadius: 20, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", minHeight: 110 }}>
      <div style={{ fontSize: 13, color: "#8fb7ff" }}>{props.label}</div>
      <div style={{ marginTop: 8, fontSize: 16, color: "#f4f7ff", lineHeight: 1.5, wordBreak: "break-word" }}>{props.value}</div>
    </div>
  );
}

function Field(props: { label: string; value: string }) {
  return (
    <div style={{ padding: 14, borderRadius: 16, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ fontSize: 12, color: "#8fb7ff", textTransform: "uppercase", letterSpacing: 1.4 }}>{props.label}</div>
      <div style={{ marginTop: 6, color: "#f4f7ff", lineHeight: 1.6, wordBreak: "break-word" }}>{props.value}</div>
    </div>
  );
}

function StatusCard(props: { title: string; value: string; tone: "info" | "danger" }) {
  const accent = props.tone === "danger" ? "#ff8fa3" : "#a8c7ff";

  return (
    <div style={{ marginTop: 16, padding: 18, borderRadius: 20, background: "rgba(255,255,255,0.04)", border: `1px solid ${props.tone === "danger" ? "rgba(255, 143, 163, 0.28)" : "rgba(168, 199, 255, 0.22)"}` }}>
      <div style={{ fontSize: 12, color: accent, textTransform: "uppercase", letterSpacing: 1.4 }}>{props.title}</div>
      <div style={{ marginTop: 8, color: "#f4f7ff", lineHeight: 1.7 }}>{props.value}</div>
    </div>
  );
}

const buttonStyle: CSSProperties = {
  color: "white",
  textDecoration: "none",
  padding: "12px 16px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.08)",
  cursor: "pointer",
  font: "inherit",
};

const sectionLabel: CSSProperties = {
  letterSpacing: 3,
  textTransform: "uppercase",
  color: "#8fb7ff",
  fontSize: 12,
};
