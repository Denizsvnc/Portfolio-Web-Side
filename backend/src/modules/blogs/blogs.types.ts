export interface BlogResource {
  title: string;
  url: string;
}

export interface createBlogDTO {
  icon?: string;
  img_url: string;

  title_tr: string;
  title_en: string;
  title_de: string;
  title_ru: string;

  description_tr: string;
  description_en: string;
  description_de: string;
  description_ru: string;

  attachments?: BlogResource[];
  links?: BlogResource[];

  queue?: number;
  isActive?: boolean;
}

export interface updateBlogDTO {
  icon?: string;
  img_url?: string;

  title_tr?: string;
  title_en?: string;
  title_de?: string;
  title_ru?: string;

  description_tr?: string;
  description_en?: string;
  description_de?: string;
  description_ru?: string;

  attachments?: BlogResource[];
  links?: BlogResource[];

  queue?: number;
  isActive?: boolean;
  views?: number;
}
