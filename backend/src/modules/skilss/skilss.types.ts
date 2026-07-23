/*
    icon: varchar("icon", {length: 255}).notNull(),

    title_tr: varchar("title_tr", {length: 255}).notNull(),
    title_en: varchar("title_en", {length: 255}).notNull(),
    title_de: varchar("title_de", {length: 255}).notNull(),
    title_ru: varchar("title_ru", {length: 255}).notNull(),

    element_tr: text("element_tr").notNull(),
    element_en: text("element_en").notNull(),
    element_de: text("element_de").notNull(),
    element_ru: text("element_ru").notNull(),
*/

export interface createSkilss {
    icon: string;

    title_tr: string;
    title_en: string;
    title_de: string;
    title_ru: string;

    element_tr: string;
    element_en: string;
    element_de: string;
    element_ru: string;
}

export interface updateSkilss {
    icon?: string;
    id?: string;

    title_tr?: string;
    title_en?: string;
    title_de?: string;
    title_ru?: string;

    element_tr?: string;
    element_en?: string;
    element_de?: string;
    element_ru?: string;
}

export interface getSkilss {
    id: string;
}

export interface deleteSkilss {
    id: string;
}
