import * as React from 'react';

interface MarkdownProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownProps) {
  if (!content) return null;

  const lines = content.split('\n');

  return (
    <div className="space-y-3">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Header 1: # Title
        if (trimmed.startsWith('# ')) {
          return (
            <h3 key={idx} className="text-sm sm:text-base font-black text-foreground pt-4 pb-1.5 border-b border-border/50 first:pt-0 mb-2">
              {trimmed.substring(2)}
            </h3>
          );
        }

        // Header 2: ## Subtitle
        if (trimmed.startsWith('## ')) {
          return (
            <h4 key={idx} className="text-xs sm:text-sm font-extrabold text-foreground pt-3 pb-1 mb-1">
              {trimmed.substring(3)}
            </h4>
          );
        }

        // Header 3: ### Subtitle
        if (trimmed.startsWith('### ')) {
          return (
            <h5 key={idx} className="text-2xs sm:text-xs font-bold text-foreground pt-2 mb-1">
              {trimmed.substring(4)}
            </h5>
          );
        }

        // Bullet point: - Bullet
        if (trimmed.startsWith('- ')) {
          return (
            <ul key={idx} className="list-disc pl-4 space-y-1 my-1">
              <li className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {renderInlineStyles(trimmed.substring(2))}
              </li>
            </ul>
          );
        }

        // Empty line
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Paragraph
        return (
          <p key={idx} className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-1.5">
            {renderInlineStyles(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

// Simple function to parse bold text **like this**
function renderInlineStyles(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-bold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}
