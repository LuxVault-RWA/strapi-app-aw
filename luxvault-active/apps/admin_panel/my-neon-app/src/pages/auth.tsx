import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

import {
  connectAdminWallet,
  logoutAdminSession,
  requestAdminSession,
  submitAdminLogin,
  type AdminLoginResponse,
  type AdminRoleScope,
} from "../lib/auth";

const shell: CSSProperties = {
  minHeight: "100vh",
  color: "#f4f7ff",
  background: "radial-gradient(circle at top left, #30406f 0%, #111827 44%, #070b14 100%)",
  fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
};

const panel: CSSProperties = {
  background: "rgba(10, 15, 35, 0.74)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 24,
  boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
};

export function Auth() {
  const [walletAddress, setWalletAddress] = useState("");
  const [chainId, setChainId] = useState("");
  const [session, setSession] = useState<AdminLoginResponse["session"] | null>(null);
  const [roleScope, setRoleScope] = useState<AdminRoleScope | null>(null);
  const [notice, setNotice] = useState("Connect a wallet to sign the admin challenge.");
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const current = await requestAdminSession();
        if (cancelled) {
          return;
        }

        if (current) {
          setRoleScope(current);
          setWalletAddress(current.actorWallet);
          setNotice(current.isAuthorized ? "Active admin session loaded." : "Wallet session loaded, but this wallet is read-only.");
        } else {
          setNotice("No active admin session yet.");
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load session state.");
        }
      }
    }

    void loadSession();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleConnectWallet() {
    setIsBusy(true);
    setError(null);

    try {
      const connected = await connectAdminWallet();
      setWalletAddress(connected.walletAddress);
      setChainId(connected.chainId);
      setNotice(`Connected ${connected.walletAddress} on chain ${connected.chainId}.`);
    } catch (connectError) {
      setError(connectError instanceof Error ? connectError.message : "Unable to connect the wallet.");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleSignIn() {
    setIsBusy(true);
    setError(null);

    try {
      let nextWalletAddress = walletAddress;
      let nextChainId = chainId;

      if (!nextWalletAddress || !nextChainId) {
        const connected = await connectAdminWallet();
        nextWalletAddress = connected.walletAddress;
        nextChainId = connected.chainId;
        setWalletAddress(nextWalletAddress);
        setChainId(nextChainId);
      }

      const result = await submitAdminLogin({
        walletAddress: nextWalletAddress,
        chainId: nextChainId,
        nonce: globalThis.crypto.randomUUID(),
        issuedAt: new Date().toISOString(),
        origin: window.location.origin,
      });

      setSession(result.session);
      setRoleScope(result.roleScope);
      setNotice(`Signed in as ${result.roleScope.actorWallet}.`);
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : "Unable to sign in.");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleSignOut() {
    setIsBusy(true);
    setError(null);

    try {
      await logoutAdminSession();
      setSession(null);
      setRoleScope(null);
      setNotice("Signed out and cleared the admin session cookie.");
    } catch (signOutError) {
      setError(signOutError instanceof Error ? signOutError.message : "Unable to sign out.");
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <main style={shell}>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "40px 24px 64px" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 40, flexWrap: "wrap" }}>
          <div>
            <div style={{ letterSpacing: 3, textTransform: "uppercase", color: "#8fb7ff", fontSize: 12 }}>Auth</div>
            <h1 style={{ margin: "10px 0 0", fontSize: "clamp(2.4rem, 6vw, 5rem)", lineHeight: 0.95 }}>Wallet-backed admin sign-in</h1>
          </div>
          <nav style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="/" style={linkStyle}>Home</a>
            <a href="/account" style={linkStyle}>Account</a>
          </nav>
        </header>

        <section style={{ ...panel, padding: 28 }}>
          <p style={{ maxWidth: 800, marginTop: 0, fontSize: 18, lineHeight: 1.7, color: "#d6def5" }}>
            The admin API verifies a signed challenge, then issues the session cookie. This page now uses the connected EVM wallet to build the exact login payload the backend expects.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginTop: 28 }}>
            <Metric label="Wallet" value={walletAddress || "Not connected"} />
            <Metric label="Chain" value={chainId || "Not loaded"} />
            <Metric label="Session" value={session ? session.sessionId : "No login response yet"} />
            <Metric label="Scope" value={roleScope?.isAuthorized ? "Authorized" : roleScope ? "Read-only" : "Pending"} />
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
            <button type="button" onClick={() => void handleConnectWallet()} disabled={isBusy} style={buttonStyle}>
              Connect wallet
            </button>
            <button type="button" onClick={() => void handleSignIn()} disabled={isBusy} style={buttonStyle}>
              Sign in
            </button>
            <button type="button" onClick={() => void handleSignOut()} disabled={isBusy} style={buttonStyle}>
              Sign out
            </button>
          </div>

          <StatusCard title="Current state" value={notice} tone="info" />
          {error ? <StatusCard title="Error" value={error} tone="danger" /> : null}
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 16, marginTop: 20 }}>
          <div style={{ ...panel, padding: 24 }}>
            <div style={sectionLabel}>How it works</div>
            <ol style={{ margin: "16px 0 0", paddingLeft: 20, color: "#e8ecf8", lineHeight: 1.8 }}>
              <li>Connect the browser wallet.</li>
              <li>The app builds the LuxVault admin login message with wallet, chain, nonce, and origin.</li>
              <li>The wallet signs the challenge and the API verifies it at <code>/api/auth/login</code>.</li>
              <li>The backend returns the session cookie plus the role scope.</li>
            </ol>
          </div>

          <div style={{ ...panel, padding: 24 }}>
            <div style={sectionLabel}>Role scope</div>
            {roleScope ? (
              <div style={{ display: "grid", gap: 14, marginTop: 16 }}>
                <Field label="Actor" value={roleScope.actorId} />
                <Field label="Wallet" value={roleScope.actorWallet} />
                <Field label="Environment" value={roleScope.environment} />
                <Field label="Permissions" value={roleScope.permissions.join(", ") || "None"} />
                <Field label="Read only" value={roleScope.isReadOnly ? "Yes" : "No"} />
              </div>
            ) : (
              <p style={{ margin: "16px 0 0", color: "#d6def5", lineHeight: 1.7 }}>
                Load a wallet session to inspect the current admin scope.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric(props: { label: string; value: string }) {
  return (
    <div style={{ padding: 18, borderRadius: 20, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", minHeight: 116 }}>
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

const linkStyle: CSSProperties = {
  color: "#edf2ff",
  textDecoration: "none",
  padding: "10px 14px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.16)",
  background: "rgba(255,255,255,0.06)",
};

const sectionLabel: CSSProperties = {
  letterSpacing: 3,
  textTransform: "uppercase",
  color: "#8fb7ff",
  fontSize: 12,
};
