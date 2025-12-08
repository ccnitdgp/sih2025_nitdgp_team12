

export const authModel={

    async register(supabase, { email, password, name }) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name
                }
            }
        });
        if (error) throw error;
        return data.user;
    },

    async login(supabase, { email, password }) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        return data.user;
    },
 
    async verifyPhone(supabase, phone){
        const {data,error}=await supabase
        .from('patients')
        .select('phone')
        .eq('phone',phone)
        .maybeSingle();
        if(error) throw error;
        return data;
    },

    async getUserByPhone(supabase, phone) {
        const { data, error } = await supabase
            .from('patients')
            .select('*')
            .eq('phone', phone)
            .maybeSingle();
        if (error) throw error;
        return data;
    }



}

export default authModel;