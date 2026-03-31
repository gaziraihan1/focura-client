// src/hooks/useAnnouncementFormat.ts
'use client';

/**
 * Focura Announcement Rich-Text Format
 * //text//   → <em>italic</em>
 * **text**   → <strong>bold</strong>
 * $$text$$   → <code>mono + copy</code>
 * {url|label} or {url} → <a href>link</a>
 * >          → line break
 */

export type FormatToken =
  | { type: 'text';   value: string }
  | { type: 'italic'; value: string }
  | { type: 'bold';   value: string }
  | { type: 'mono';   value: string }
  | { type: 'link';   url: string; label: string }
  | { type: 'break' };

export function parseAnnouncement(raw: string): FormatToken[] {
  const tokens: FormatToken[] = [];
  // Replace > with a sentinel, then tokenise
  const normalized = raw.replace(/>/g, '\x00BREAK\x00');

  const pattern =
  /\/\/([\s\S]*?)\/\/|\*\*([\s\S]*?)\*\*|\$\$([\s\S]*?)\$\$|\{([^}|]+)(?:\|([^}]*))?\}|\x00BREAK\x00/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(normalized)) !== null) {
    if (match.index > last) {
      tokens.push({ type: 'text', value: normalized.slice(last, match.index) });
    }

    if (match[0] === '\x00BREAK\x00') {
      tokens.push({ type: 'break' });
    } else if (match[1] !== undefined) {
      tokens.push({ type: 'italic', value: match[1] });
    } else if (match[2] !== undefined) {
      tokens.push({ type: 'bold', value: match[2] });
    } else if (match[3] !== undefined) {
      tokens.push({ type: 'mono', value: match[3] });
    } else if (match[4] !== undefined) {
      tokens.push({ type: 'link', url: match[4], label: match[5] ?? match[4] });
    }

    last = match.index + match[0].length;
  }

  if (last < normalized.length) {
    tokens.push({ type: 'text', value: normalized.slice(last) });
  }

  return tokens;
}

/** Render tokens → React-safe HTML string (used in preview) */
export function tokensToHtml(tokens: FormatToken[]): string {
  return tokens
    .map((t) => {
      switch (t.type) {
        case 'text':   return escHtml(t.value);
        case 'italic': return `<em>${escHtml(t.value)}</em>`;
        case 'bold':   return `<strong>${escHtml(t.value)}</strong>`;
        case 'mono':   return `<code data-mono="${escHtml(t.value)}">${escHtml(t.value)}</code>`;
        case 'link':   return `<a href="${escHtml(t.url)}" target="_blank" rel="noopener noreferrer">${escHtml(t.label)}</a>`;
        case 'break':  return '<br/>';
      }
    })
    .join('');
}

function escHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}