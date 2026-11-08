import { API_URL } from "./apiClient";

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_URL}${endpoint}`;

    const headers: Record<string, string> = { ...options.headers as any };
    
    if (options.body) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, { ...options, headers });

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