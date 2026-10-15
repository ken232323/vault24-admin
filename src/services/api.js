import * as mock from './mock';

const BASE = import.meta.env.VITE_API_BASE || '/api';
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export class ApiError extends Error {
  constructor(status, error) {
    super(error?.message || 'Something went wrong. Try again.');
    this.status = status;
    this.code = error?.code;
    this.requestId = error?.requestId;
  }
}

// Session lives in an HttpOnly cookie (use a different cookie name from the customer app).
async function request(method, path, body) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, { code: 'NETWORK', message: 'Could not reach the server. Check your connection.' });
  }
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, data?.error);
  return data;
}

const real = {
  login: (p) => request('POST', '/admin/auth/login', p),
  logout: () => request('POST', '/admin/auth/logout'),
  me: () => request('GET', '/admin/auth/me'),
  adminCustomers: () => request('GET', '/admin/customers'),
  adminAuditLogs: () => request('GET', '/admin/audit-logs'),
  adminSecurityEvents: () => request('GET', '/admin/security-events'),
  staffList: () => request('GET', '/admin/staff'),
  createStaff: (p) => request('POST', '/admin/staff', p),
};

export const api = USE_MOCK ? mock.api : real;
