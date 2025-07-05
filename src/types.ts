export interface Tress {
  owner_username: string | null;
  id: number;
  title: string;
  content: string;
  language: string;
  is_public: boolean;
  owner_id: number | null;
  created_at: string;
  expires_at: string | null;
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

export interface CreateTressData {
  title: string;
  content: string;
  language: string;
  is_public: boolean;
  expires_in_days?: number;
}

// Tree 预览模型（用于分页列表）
export interface TreePreview {
  id: number;
  title: string;
  language: string;
  is_public: boolean;
  owner_id: number | null;
  owner_username: string | null;
  created_at: string;
  expires_at: string | null;
  content_preview: string; // 截取前200个字符
}

// 分页信息
export interface PaginationInfo {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

// 分页响应模型
export interface PageResponse<T> {
  items: T[];
  pagination: PaginationInfo;
}
