'use client';

import React from 'react';
import { icons, LucideProps, Link } from 'lucide-react';

interface DynamicIconProps extends LucideProps {
  name: string;
}

const toPascalCase = (str: string) => {
  return str
    .replace(/(\w)(\w*)/g, (g0, g1, g2) => {
      return g1.toUpperCase() + g2.toLowerCase();
    })
    .replace(/-+/g, '');
};

export const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  // Try to normalize the name
  let formattedName = name;
  if (name.includes('-')) {
    formattedName = toPascalCase(name);
  } else {
    // If it's all lowercase, try to capitalize the first letter as a best effort
    if (name === name.toLowerCase()) {
      formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    }
  }

  // Find the icon in the exported icons object
  const IconComponent = (icons as any)[formattedName] || (icons as any)[name] || Link;

  return <IconComponent {...props} />;
};
