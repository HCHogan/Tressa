export interface Tress {
  owner_username: string;
  id: number;
  title: string;
  content: string;
  language: string;
  is_public: boolean;
  owner_id: number;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData extends LoginData {
  email: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
}
