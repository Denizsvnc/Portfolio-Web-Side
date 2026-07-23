export interface sendMessageDto {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export interface replyMessageDto {
    id: string;
    replyBody: string;
    attachments?: Array<{ filename: string; path: string }>;
}

export interface updateSettingsDto {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    password: string;
    from_email: string;
    auto_forward: boolean;
}
