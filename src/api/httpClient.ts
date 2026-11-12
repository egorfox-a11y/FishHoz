import { router } from "expo-router";
import { API_URL } from "./apiClient";
import { supabase } from "./supabaseClient";

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_URL}${endpoint}`;

    const headers: Record<string, string> = { ...options.headers as any };

    if (options.body) {
      headers['Content-Type'] = 'application/json';
    }

    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let response: Response;
    try {
      response = await fetch(url, { ...options, headers });
    } catch {
      throw new Error(`Нет связи с сервером (${API_URL}). Проверьте, что сервер запущен и телефон в той же сети`);
    }

    if (response.status === 401) {
      await supabase.auth.signOut();
      router.replace('/login');
      throw new Error('Сессия истекла. Войдите заново');
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        throw new Error(errorData.error || `Ошибка HTTP: ${response.status}`);
    }

    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}

export const httpClient = {
    get: <T>(url: string) => request<T>(url, { method: 'GET' }),

    post: <T>(url: string, body: any) =>
        request<T>(url, { method: 'POST', body: JSON.stringify(body) }),

    patch: <T>(url: string, body: any) => 
        request<T>(url, { method: 'PATCH', body: JSON.stringify(body) }),
    
    delete: <T>(url: string) => request<T>(url, { method: 'DELETE' }),
}
