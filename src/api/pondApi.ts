const API_URL = 'http://localhost:3000/api/v1';

export async function fetchPonds() {
  const response = await fetch(`${API_URL}/ponds`);
  if (!response.ok) {
    throw new Error(`Ошибка HTTP: ${response.status}`);
  }
  return response.json();
}