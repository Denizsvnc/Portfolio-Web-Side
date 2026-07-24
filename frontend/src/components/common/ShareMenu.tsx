'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Share2, Briefcase, Video, Camera, MessageCircle, Mail, Link as LinkIcon, Check } from 'lucide-react';
import { api } from '@/lib/api';
import { useTranslations } from 'next-intl';

type SharePlatform = 'linkedin' | 'youtube' | 'instagram' | 'whatsapp' | 'mail' | 'copy_link';

interface ShareMenuProps {
  id: string;
  type: 'blog' | 'project';
  title: string;
  url: string;
  variant?: 'button' | 'icon';
}

export const ShareMenu: React.FC<ShareMenuProps> = ({ id, type, title, url, variant = 'button' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const tButtons = useTranslations('Buttons');
  const tSidebar = useTranslations('Sidebar');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleShare = async (platform: SharePlatform) => {
    // Determine absolute share URL
    const fullUrl = url.startsWith('http') ? url : (typeof window !== 'undefined' ? `${window.location.origin}${url}` : url);
    let shareUrl = '';
    const encodedUrl = encodeURIComponent(fullUrl);
    const encodedTitle = encodeURIComponent(title);

    switch (platform) {
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodedTitle} - ${encodedUrl}`;
        break;
      case 'mail':
        shareUrl = `mailto:?subject=${encodedTitle}&body=${encodedTitle}%0A%0A${encodedUrl}`;
        break;
      case 'youtube':
        shareUrl = 'https://youtube.com'; // Fallback
        break;
      case 'instagram':
        shareUrl = 'https://instagram.com'; // Fallback
        break;
      case 'copy_link':
        navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
    }

    // Call API to log share
    try {
      await api.post(`/${type}s/${id}/share`, { platform });
      router.refresh(); // Refresh Server Components data
    } catch (error) {
      console.error(`Error logging ${type} share:`, error);
    }

    if (platform !== 'copy_link' && shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }

    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {variant === 'button' ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-1.5 bg-black text-white hover:bg-gray-800 rounded text-xs font-semibold transition inline-flex items-center gap-1.5"
        >
          <Share2 size={14} /> {tButtons('share')}
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition"
          title={tButtons('share')}
        >
          <Share2 size={16} />
        </button>
      )}

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden border border-gray-100">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <button
              onClick={() => handleShare('linkedin')}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0A66C2] w-full text-left transition"
            >
              <Briefcase size={16} /> LinkedIn
            </button>
            <button
              onClick={() => handleShare('whatsapp')}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#25D366] w-full text-left transition"
            >
              <MessageCircle size={16} /> WhatsApp
            </button>
            <button
              onClick={() => handleShare('mail')}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500 w-full text-left transition"
            >
              <Mail size={16} /> E-posta
            </button>
            <button
              onClick={() => handleShare('youtube')}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#FF0000] w-full text-left transition"
            >
              <Video size={16} /> YouTube
            </button>
            <button
              onClick={() => handleShare('instagram')}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#E4405F] w-full text-left transition"
            >
              <Camera size={16} /> Instagram
            </button>
            <hr className="my-1 border-gray-100" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleShare('copy_link');
              }}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black w-full text-left transition"
            >
              {copied ? <Check size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
              {copied ? tSidebar('copied') : tButtons('copyLink')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
