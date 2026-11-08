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
    }
};   
