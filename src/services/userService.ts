import { supabase } from '@/lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  updated_at?: string;
}

export const userService = {
  /**
   * Create or update a user record in the 'Users' table.
   * NOTE: Ensure the 'id' column in your 'Users' table is of type UUID.
   */
  async syncUser(id: string, email: string, fullName?: string) {
    const { data, error } = await supabase
      .from('Users')
      .upsert({
        id, // This requires the 'id' column in Supabase to be UUID type
        email,
        full_name: fullName,
        last_login: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error syncing user data to table [Users]:', error.message);
    }
    return data;
  },

  /**
   * Get user data from the Users table.
   */
  async getUserData(id: string) {
    const { data, error } = await supabase
      .from('Users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
       console.error('Error fetching user data from table [Users]:', error.message);
       return null;
    }
    return data;
  }
};
