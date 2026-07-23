export interface CreateImageDTO {
  alt_text?: string;
  blogId?: string;
  queue?: number;
}

export interface UpdateImageDTO {
  alt_text?: string;
  isActive?: boolean;
  queue?: number;
  blogId?: string;
}
