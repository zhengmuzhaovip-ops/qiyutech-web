import { API_BASE_URL } from '../config';
import type { AuthUser } from '../types';

type AuthApiUser = {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  businessType?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  role?: string;
};

type AuthSuccessResponse = {
  success: true;
  token: string;
  user: AuthApiUser;
};

type AuthFailureResponse = {
  success: false;
  message?: string;
};

function getFailureMessage(result: { message?: string }, fallback: string) {
  return result.message || fallback;
}

type AuthPayload = {
  name?: string;
  identifier: string;
  password: string;
  website?: string;
  submittedAt: number;
};

function mapAuthUser(user: AuthApiUser): AuthUser {
  const sanitizedLastName = user.lastName?.trim() === 'Contact' ? '' : user.lastName;
  const normalizedName = (user.name || '')
    .trim()
    .replace(/\s+Contact$/, sanitizedLastName ? ' Contact' : '')
    .trim();
  const fallbackName = [user.firstName, sanitizedLastName].filter(Boolean).join(' ').trim();

  return {
    id: user.id,
    name: normalizedName || fallbackName || user.email || user.phone || 'Trade account',
    email: user.email || '',
    phone: user.phone || undefined,
    company: user.company || '',
    businessType: user.businessType || '',
    address: user.address,
    role: user.role,
    firstName: user.firstName,
    lastName: sanitizedLastName,
  };
}

async function authRequest(
  path: string,
  payload: AuthPayload,
): Promise<{ token: string; user: AuthUser }> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error('Unable to reach the server. Please make sure the local API is running.');
  }

  const result = (await response.json()) as AuthSuccessResponse | AuthFailureResponse;

  if (!response.ok || !result.success) {
    throw new Error(
      getFailureMessage(result as { message?: string }, 'Authentication request failed.'),
    );
  }

  return {
    token: result.token,
    user: mapAuthUser(result.user),
  };
}

export async function loginTradeAccount(payload: AuthPayload) {
  return authRequest('/auth/login', payload);
}

export async function registerTradeAccount(payload: AuthPayload) {
  return authRequest('/auth/register', payload);
}

export async function fetchCurrentTradeUser(token: string): Promise<AuthUser> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = (await response.json()) as
    | { success: true; user: AuthApiUser }
    | AuthFailureResponse;

  if (!response.ok || !result.success) {
    throw new Error(
      getFailureMessage(result as { message?: string }, 'Unable to load the current account.'),
    );
  }

  return mapAuthUser(result.user);
}

export async function updateTradeProfile(
  token: string,
  payload: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    company?: string;
    businessType?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
  },
): Promise<AuthUser> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/auth/update-profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error('Unable to reach the server. Please make sure the local API is running.');
  }

  const result = (await response.json()) as
    | { success: true; user: AuthApiUser }
    | AuthFailureResponse;

  if (!response.ok || !result.success) {
    throw new Error(
      getFailureMessage(result as { message?: string }, 'Unable to update the account profile.'),
    );
  }

  return mapAuthUser(result.user);
}

export async function lookupUsPostalCode(
  token: string,
  zipCode: string,
): Promise<{ zipCode: string; city: string; state: string }> {
  let response: Response;

  try {
    response = await fetch(
      `${API_BASE_URL}/auth/us-postal-lookup?zipCode=${encodeURIComponent(zipCode)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  } catch {
    throw new Error('Unable to reach the server. Please make sure the local API is running.');
  }

  const result = (await response.json()) as
    | {
        success: true;
        lookup: {
          zipCode: string;
          city: string;
          state: string;
        };
      }
    | AuthFailureResponse;

  if (!response.ok || !result.success) {
    throw new Error(
      getFailureMessage(result as { message?: string }, 'Unable to validate this ZIP code.'),
    );
  }

  return result.lookup;
}
