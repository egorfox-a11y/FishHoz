import { LOCAL_IP } from "./apiClient";
import { supabase } from "./supabaseClient";

export const auth = {
    async register(email: string, password: string) {
        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) {
            throw new Error(error.message);
        }
        return data.user;
    },
    async login(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        throw new Error(error.message);
    }
    return data.user;
    },
    async logout() {
        const { error } = await supabase.auth.signOut();

        if (error) {
            throw new Error(error.message);
        }
    },
    async getUser() {
        const {data, error} = await supabase.auth.getUser();
        if (error) {
            return null
        }
        return data.user;
    },
    async isAuthenticated(): Promise<boolean> {
        const user = await this.getUser();
        return user !== null;
    },
    getToken: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  },

    deleteAccount: async () => {
    const response = await fetch(`http://${LOCAL_IP}:3000/api/v1/auth/delete-account`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Не удалось удалить аккаунт');
    }
  },
};
