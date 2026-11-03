// Cliente HTTP da API oficial da Nuvemshop (somente servidor).
// Credenciais: NUVEMSHOP_STORE_ID e NUVEMSHOP_ACCESS_TOKEN (segredos do servidor).
const API = "https://api.nuvemshop.com.br/v1";

export function nuvemshopCredentials() {
  const storeId = process.env["NUVEMSHOP_STORE_ID"];
  const token = process.env["NUVEMSHOP_ACCESS_TOKEN"];
  return storeId && token ? { storeId, token } : null;
}

export async function nuvemshopRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const c = nuvemshopCredentials();
  if (!c) throw new Error("Nuvemshop não configurada");
  const res = await fetch(`${API}/${c.storeId}${path}`, {
    ...init,
    headers: {
      Authentication: `bearer ${c.token}`,
      "User-Agent": "Marcos Joias & Relogios",
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) throw new Error(`Nuvemshop ${res.status}`);
  return (await res.json()) as T;
}
