export interface createProjects {
    icon?: string;

    title_tr: string;
    title_en: string;
    title_de: string;
    title_ru: string;

    element_tr: string;
    element_en: string;
    element_de: string;
    element_ru: string;

    innovation_tr?: string;
    innovation_en?: string;
    innovation_de?: string;
    innovation_ru?: string;

    tech_stack?: string;
    button_url: string;
    demo_url?: string;
    isSignature?: boolean;
    queue?: number;
    isActive?: boolean;
    attachments?: any;
    links?: any;
}

export interface getProjects {
    id: string;
}

export interface updateProjects {
    id: string;
    icon?: string;

    title_tr?: string;
    title_en?: string;
    title_de?: string;
    title_ru?: string;

    element_tr?: string;
    element_en?: string;
    element_de?: string;
    element_ru?: string;

    innovation_tr?: string;
    innovation_en?: string;
    innovation_de?: string;
    innovation_ru?: string;

    tech_stack?: string;
    button_url?: string;
    demo_url?: string;
    isSignature?: boolean;
    queue?: number;
    isActive?: boolean;
    attachments?: any;
    links?: any;
}

export interface deleteProjects {
    id: string;
}