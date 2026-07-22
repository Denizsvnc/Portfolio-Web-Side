export interface createAboutSection {
  title_tr: string;
  title_en: string;
  title_de: string;
  title_ru: string;
  text_tr: string;
  text_en: string;
  text_de: string;
  text_ru: string;
  pp_url: string;
}

export interface updateAboutSection {
  title_tr?: string;
  title_en?: string;
  title_de?: string;
  title_ru?: string;
  text_tr?: string;
  text_en?: string;
  text_de?: string;
  text_ru?: string;
  pp_url?: string;
}

export interface getAboutSection {
  id: string;
}

export interface deleteAboutSection {
  id: string;
}