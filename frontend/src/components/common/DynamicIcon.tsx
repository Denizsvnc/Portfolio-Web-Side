'use client';

import React from 'react';
import { LucideProps } from 'lucide-react';
import {
  Link, Phone, Mail, MapPin, Globe, Search, MessageCircle, Send,
  Video, FileText, User, Users, Home, Settings, Info, HelpCircle,
  MessageSquare, Camera, Calendar, Briefcase, Bell, Bookmark,
  Cloud, Code, ExternalLink, Heart, Navigation, Share2, Star,
  ThumbsUp, Zap, ArrowRight, ArrowLeft, ArrowUp, ArrowDown,
  Check, X, Plus, Minus, Edit2, Trash2, Download, Upload,
  Map, Monitor, Smartphone, Tablet, Watch
} from 'lucide-react';

interface DynamicIconProps extends LucideProps {
  name: string;
}

const iconMap: Record<string, any> = {
  Link, Phone, Mail, MapPin, Globe, Search, MessageCircle, Send,
  Video, FileText, User, Users, Home, Settings, Info, HelpCircle,
  MessageSquare, Camera, Calendar, Briefcase, Bell, Bookmark,
  Cloud, Code, ExternalLink, Heart, Navigation, Share2, Star,
  ThumbsUp, Zap, ArrowRight, ArrowLeft, ArrowUp, ArrowDown,
  Check, X, Plus, Minus, Edit2, Trash2, Download, Upload,
  Map, Monitor, Smartphone, Tablet, Watch
};

const toPascalCase = (str: string) => {
  return str
    .replace(/(\w)(\w*)/g, (g0, g1, g2) => {
      return g1.toUpperCase() + g2.toLowerCase();
    })
    .replace(/-+/g, '');
};

export const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  let formattedName = name;
  if (name.includes('-')) {
    formattedName = toPascalCase(name);
  } else {
    if (name === name.toLowerCase()) {
      formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    }
  }

  const IconComponent = iconMap[formattedName] || iconMap[name] || Link;

  return <IconComponent {...props} />;
};
