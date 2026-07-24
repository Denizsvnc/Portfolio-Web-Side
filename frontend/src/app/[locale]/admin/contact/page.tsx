'use client';
import { useTranslations } from 'next-intl';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Mail, MailOpen, Reply, Trash2, CheckCircle, Paperclip, X } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false, loading: () => <p>Editör yükleniyor...</p> });

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  is_replied: boolean;
  created_at: string;
}

interface ThreadReply {
  id: string;
  reply_body: string;
  attachments: string | null;
  created_at: string;
}

export default function ContactInboxPage() {
  const t = useTranslations('Admin.contact');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyBody, setReplyBody] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [thread, setThread] = useState<ThreadReply[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/contact/messages');
      setMessages(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleReadMessage = async (msg: Message) => {
    setSelectedMessage(msg);
    setReplyBody('');
    setAttachments([]);
    setThread([]);
    
    try {
      // Fetch thread
      const threadRes = await api.get(`/contact/messages/${msg.id}/replies`);
      setThread(threadRes.data.data);
      
      // Mark as read
      if (!msg.is_read) {
        await api.post(`/contact/messages/${msg.id}/read`);
        setMessages(messages.map(m => m.id === msg.id ? { ...m, is_read: true } : m));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyBody.trim()) return;
    setSendingReply(true);
    try {
      const formData = new FormData();
      formData.append('replyBody', replyBody);
      attachments.forEach((file) => formData.append('attachments', file));

      await api.post(`/contact/messages/${selectedMessage.id}/reply`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Cevap e-postası başarıyla gönderildi!');
      
      setMessages(messages.map(m => m.id === selectedMessage.id ? { ...m, is_replied: true } : m));
      
      // Refresh thread
      const threadRes = await api.get(`/contact/messages/${selectedMessage.id}/replies`);
      setThread(threadRes.data.data);
      
      setReplyBody('');
      setAttachments([]);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'E-posta gönderilirken hata oluştu. SMTP ayarlarını kontrol edin.');
    } finally {
      setSendingReply(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link'],
      ['clean']
    ],
  };

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
      
      {/* Inbox List */}
      <div className="w-full md:w-1/3 bg-gray-900 border border-gray-800 rounded-2xl flex flex-col overflow-hidden h-[85vh]">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-950">
          <h1 className="text-xl font-bold font-heading text-white flex items-center gap-2">
            <Mail size={20} /> Gelen Kutusu
          </h1>
          <Link href="/admin/contact/settings" className="text-xs text-blue-400 hover:underline">
            SMTP Ayarları
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Yükleniyor...</div>
          ) : messages.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">Gelen mesaj bulunmuyor.</div>
          ) : (
            <div className="divide-y divide-gray-800">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  onClick={() => handleReadMessage(msg)}
                  className={`p-4 cursor-pointer transition border-l-4 ${selectedMessage?.id === msg.id ? 'bg-gray-800 border-blue-500' : 'hover:bg-gray-800/50 border-transparent'} ${!msg.is_read ? 'bg-gray-800/30 font-bold text-white' : 'text-gray-300'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="truncate pr-2">{msg.name}</h3>
                    <span className="text-[10px] text-gray-500 whitespace-nowrap">
                      {new Date(msg.created_at.replace('Z', '')).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  <h4 className="text-sm truncate mb-1 text-gray-400">{msg.subject}</h4>
                  <div className="flex justify-between items-center mt-2">
                    {msg.is_replied ? (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono uppercase bg-emerald-400/10 px-2 py-0.5 rounded">
                        <CheckCircle size={10} /> {t('replied')}
                      </span>
                    ) : !msg.is_read ? (
                      <span className="text-[10px] text-blue-400 flex items-center gap-1 font-mono uppercase bg-blue-400/10 px-2 py-0.5 rounded">
                        <Mail size={10} /> Yeni
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-500 flex items-center gap-1 font-mono uppercase bg-gray-800 px-2 py-0.5 rounded">
                        <MailOpen size={10} /> Okundu
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Message Detail & Reply */}
      <div className="w-full md:w-2/3 bg-gray-900 border border-gray-800 rounded-2xl h-[85vh] flex flex-col">
        {selectedMessage ? (
          <>
            <div className="p-6 border-b border-gray-800 bg-gray-950 rounded-t-2xl shrink-0">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{selectedMessage.subject}</h2>
                  <div className="text-sm text-gray-400">Kimden: <span className="text-white">{selectedMessage.name}</span> &lt;{selectedMessage.email}&gt;</div>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(selectedMessage.created_at.replace('Z', '')).toLocaleString('tr-TR')}
                </div>
              </div>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto space-y-8 custom-scrollbar">
              {/* Original Message */}
              <div className="text-gray-300 leading-relaxed whitespace-pre-wrap bg-gray-800/30 p-5 rounded-xl border border-gray-800">
                {selectedMessage.message}
              </div>

              {/* Thread / Sent Replies */}
              {thread.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-800 pb-2">Önceki Yanıtlarınız</h3>
                  {thread.map((t) => {
                    let parsedAttachments: any[] = [];
                    if (t.attachments) {
                      try { parsedAttachments = JSON.parse(t.attachments); } catch(e){}
                    }
                    return (
                      <div key={t.id} className="bg-gray-950 border border-gray-800 p-5 rounded-xl space-y-3">
                        <div className="flex justify-between items-center text-xs text-gray-500 border-b border-gray-800/50 pb-2">
                          <span className="font-bold text-blue-400">Siz yanıtladınız</span>
                          <span>{new Date(t.created_at.replace('Z', '')).toLocaleString('tr-TR')}</span>
                        </div>
                        <div className="text-gray-300 text-sm prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: t.reply_body }} />
                        
                        {parsedAttachments.length > 0 && (
                          <div className="pt-3 border-t border-gray-800/50 flex flex-wrap gap-2">
                            {parsedAttachments.map((att, i) => (
                              <div key={i} className="flex items-center gap-1 text-xs bg-gray-900 px-2 py-1 rounded text-gray-400">
                                <Paperclip size={12} /> {att.filename}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Reply Composer */}
            <div className="p-6 border-t border-gray-800 bg-gray-950/50 rounded-b-2xl space-y-4 shrink-0">
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-2"><Reply size={16} /> Yanıtla</span>
                <label className="cursor-pointer text-xs flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition">
                  <Paperclip size={14} /> Dosya Ekle
                  <input type="file" multiple className="hidden" onChange={handleFileChange} />
                </label>
              </h3>
              
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {attachments.map((file, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs bg-gray-800 px-3 py-1.5 rounded-lg text-gray-300 border border-gray-700">
                      <Paperclip size={12} /> <span className="truncate max-w-[150px]">{file.name}</span>
                      <button onClick={() => removeAttachment(i)} className="text-gray-500 hover:text-red-400 transition"><X size={14} /></button>
                    </div>
                  ))}
                </div>
              )}

              <style dangerouslySetInnerHTML={{__html: `
                .ql-toolbar.ql-snow {
                  border: none !important;
                  border-bottom: 1px solid #374151 !important;
                  background-color: #f3f4f6;
                  border-top-left-radius: 0.75rem;
                  border-top-right-radius: 0.75rem;
                  padding: 12px 8px !important;
                }
                .ql-container.ql-snow {
                  border: none !important;
                  font-family: inherit !important;
                  font-size: 1rem !important;
                }
                .ql-editor {
                  padding: 20px !important;
                  min-height: 250px;
                }
                .ql-editor.ql-blank::before {
                  color: #9ca3af !important;
                  font-style: normal !important;
                  left: 20px !important;
                }
              `}} />

              <div className="bg-white text-black rounded-xl overflow-hidden border border-gray-700 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-inner">
                <ReactQuill 
                  theme="snow" 
                  value={replyBody} 
                  onChange={setReplyBody} 
                  modules={modules}
                  placeholder="Yanıtınızı buraya yazın... (Link ekleyebilir, metni biçimlendirebilirsiniz)"
                  className="h-64 sm:h-80 mb-12 border-none text-base"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleReply}
                  disabled={sendingReply || !replyBody.trim()}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition shadow-lg flex items-center gap-2"
                >
                  {sendingReply ? 'Gönderiliyor...' : 'E-Posta Gönder'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <MailOpen size={48} className="mb-4 opacity-50" />
            <p>Okumak için listeden bir mesaj seçin</p>
          </div>
        )}
      </div>
      
    </div>
  );
}
