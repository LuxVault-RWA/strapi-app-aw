export interface AdminSession {
  sessionId: string;
  walletAddress: string;
  issuedAt: string;
  expiresAt: string;
  environment: string;
}

export interface AdminRoleScope {
  actorId: string;
  actorWallet: string;
  environment: string;
  roles: string[];
  permissions: string[];
  isAuthorized: boolean;
  isReadOnly: boolean;
}

export interface AdminLoginResponse {
  session: AdminSession;
  roleScope: AdminRoleScope;
}

interface EthereumProvider {
  request<T = unknown>(args: {
    method: string;
    params?: unknown[] | Record<string, unknown>;
  }): Promise<T>;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

function requireApiBaseUrl() {
  const value = import.meta.env.VITE_API_BASE_URL?.trim();

  if (!value) {
    throw new Error('Missing VITE_API_BASE_URL');
  }

  return value.replace(/\/+$/, '');
}

function apiUrl(path: string) {
  return `${requireApiBaseUrl()}${path.startsWith('/') ? '' : '/'}${path}`;
}

function requireWalletProvider() {
  const provider = globalThis.window?.ethereum;

  if (!provider?.request) {
    throw new Error('No EVM wallet provider was found. Connect MetaMask or another injected wallet.');
  }

  return provider;
}

function encodeUtf8ToHex(value: string) {
  const bytes = new TextEncoder().encode(value);
  let hex = '0x';

  for (const byte of bytes) {
    hex += byte.toString(16).padStart(2, '0');
  }

  return hex;
}

async function readResponseError(response: Response) {
  try {
    const payload = (await response.json()) as { error?: string };
    return payload.error ?? `Request failed with status ${response.status}`;
  } catch {
    return `Request failed with status ${response.status}`;
  }
}

export function buildAdminLoginMessage(options: {
  walletAddress: string;
  chainId: string;
  nonce: string;
  issuedAt: string;
  origin: string;
}) {
  return [
    'LuxVault Admin Login',
    `walletAddress: ${options.walletAddress}`,
    `chainId: ${options.chainId}`,
    `nonce: ${options.nonce}`,
    `issuedAt: ${options.issuedAt}`,
    `origin: ${options.origin}`,
  ].join('\n');
}

export async function connectAdminWallet() {
  const provider = requireWalletProvider();
  const accounts = await provider.request<string[]>({ method: 'eth_requestAccounts' });

  if (!Array.isArray(accounts) || !accounts[0]) {
    throw new Error('Wallet connection did not return an address.');
  }

  const chainId = await provider.request<string>({ method: 'eth_chainId' });

  return {
    walletAddress: accounts[0],
    chainId,
  };
}

export async function signAdminLoginMessage(walletAddress: string, message: string) {
  const provider = requireWalletProvider();
  const signature = await provider.request<string>({
    method: 'personal_sign',
    params: [encodeUtf8ToHex(message), walletAddress],
  });

  if (typeof signature !== 'string' || !signature) {
    throw new Error('Wallet did not return a signature.');
  }

  return signature;
}

export async function requestAdminSession(walletAddress?: string) {
  const url = new URL(apiUrl('/auth/session'));

  if (walletAddress) {
    url.searchParams.set('walletAddress', walletAddress);
  }

  const response = await fetch(url, {
    credentials: 'include',
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(await readResponseError(response));
  }

  return (await response.json()) as AdminRoleScope;
}

export async function submitAdminLogin(input: {
  walletAddress: string;
  chainId: string;
  nonce: string;
  issuedAt: string;
  origin: string;
}) {
  const message = buildAdminLoginMessage(input);
  const signature = await signAdminLoginMessage(input.walletAddress, message);
  const response = await fetch(apiUrl('/auth/login'), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...input,
      message,
      signature,
    }),
  });

  if (!response.ok) {
    throw new Error(await readResponseError(response));
  }

  return (await response.json()) as AdminLoginResponse;
}

export async function logoutAdminSession() {
  const response = await fetch(apiUrl('/auth/logout'), {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(await readResponseError(response));
  }

  return (await response.json()) as { ok: true };
}
