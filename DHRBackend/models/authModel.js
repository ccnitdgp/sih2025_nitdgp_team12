

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

    async doctorLogin(supabase, { doctor_id, password }) {
        const { data, error } = await supabase
        .from('doctors')
        .select('doctor_id, password')
        .eq('doctor_id', doctor_id)
        .eq('password', password)
        .maybeSingle();
        if (error) throw error;
        return data;
    },

     async governmentLogin(supabase, { email, password_hash }) {
        const { data, error } = await supabase
        .from('government_users')
        .select('email, password')
        .eq('email', email)
        .eq('password_hash', password_hash)
        .maybeSingle();
        if (error) throw error;
        return data;
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