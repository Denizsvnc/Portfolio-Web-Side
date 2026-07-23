import React from 'react';

interface ParagraphRendererProps {
  content: string;
  className?: string;
}

export const ParagraphRenderer: React.FC<ParagraphRendererProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Split by /*******/ or /*****/ or /****/ or double line breaks \n\n
  const paragraphs = content
    .split(/\/\*{3,}\/|\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return (
    <div className={`space-y-5 ${className}`}>
      {paragraphs.map((para, idx) => (
        <p key={idx} className="leading-relaxed font-sans text-gray-700">
          {para}
        </p>
      ))}
    </div>
  );
};
