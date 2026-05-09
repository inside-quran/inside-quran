// src/utils/adminApi.ts
// Utility functions for all Admin Panel API calls

import { getApiUrl } from './api';

const getToken = () => localStorage.getItem('iq_admin_token');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

// --- Auth ---
export async function adminLogin(username: string, password: string) {
  const res = await fetch(`${getApiUrl()}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('Invalid credentials');
  const data = await res.json();
  localStorage.setItem('iq_admin_token', data.token);
  return data;
}

export function adminLogout() {
  localStorage.removeItem('iq_admin_token');
}

export function isAdminLoggedIn() {
  return !!getToken();
}

// --- Translations ---
export async function fetchVerses(surahId: number) {
  const res = await fetch(`${getApiUrl()}/api/surahs/${surahId}/verses`);
  if (!res.ok) throw new Error('Failed to fetch verses');
  return res.json();
}

export async function updateTranslation(
  surahId: number,
  verseId: number,
  lang: string,
  newTranslation: string
) {
  const res = await fetch(
    `${getApiUrl()}/api/surahs/${surahId}/verses/${verseId}/translation`,
    {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ lang, newTranslation }),
    }
  );
  if (!res.ok) throw new Error('Failed to update translation');
  return res.json();
}

// --- Discover Data ---
export async function fetchDiscoverData(type: 'duas' | 'topics' | 'shane-nuzul') {
  const res = await fetch(`${getApiUrl()}/api/discover/${type}`);
  if (!res.ok) throw new Error(`Failed to fetch ${type}`);
  return res.json();
}

export async function updateDiscoverData(
  type: 'duas' | 'topics' | 'shane-nuzul',
  data: unknown
) {
  const res = await fetch(`${getApiUrl()}/api/admin/discover/${type}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to update ${type}`);
  return res.json();
}
