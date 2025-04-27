
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'partner' | 'user';
  status: 'active' | 'inactive';
  last_login: Date | null;
  created_at: Date;
  avatar_url: string | null;
}
