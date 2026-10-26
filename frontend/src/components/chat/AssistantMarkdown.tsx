"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Markdown renderer for assistant replies.
 *
 * react-markdown parses markdown into React elements — raw HTML in the source
 * is escaped by default (no rehype-raw, no dangerouslySetInnerHTML), so
 * assistant output can never inject markup. remark-gfm adds tables, task
 * lists and strikethrough, which the assistant's system prompt encourages.
 * Styled with Tailwind to match the dashboard bubble theme.
 */
const components: Components = {
  h1: ({ children }) => <h1 className="text-base font-semibold text-slate-900">{children}</h1>,
  h2: ({ children }) => <h2 className="text-sm font-semibold text-slate-900">{children}</h2>,
  h3: ({ children }) => <h3 className="text-sm font-semibold text-slate-900">{children}</h3>,
  h4: ({ children }) => <h4 className="text-xs font-semibold text-slate-900">{children}</h4>,
  p: ({ children }) => <p className="leading-relaxed">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  del: ({ children }) => <del className="text-slate-400">{children}</del>,
  ul: ({ children }) => <ul className="list-disc space-y-1 pl-4 marker:text-teal-600">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal space-y-1 pl-4 marker:text-teal-600">{children}</ol>,
  li: ({ children }) => <li className="pl-0.5">{children}</li>,
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-teal-700 underline underline-offset-2 hover:text-teal-800"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-teal-600 pl-3 text-slate-500">{children}</blockquote>
  ),
  hr: () => <hr className="border-slate-200" />,
  table: ({ children }) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-[11px]">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-slate-100">{children}</thead>,
  th: ({ children }) => <th className="border border-slate-200 px-2 py-1 font-semibold text-slate-700">{children}</th>,
  td: ({ children }) => <td className="border border-slate-200 px-2 py-1 align-top">{children}</td>,
  pre: ({ children }) => (
    <pre className="overflow-x-auto rounded-lg bg-slate-900 p-3 text-[11px] text-slate-100 [&_code]:rounded-none [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit">
      {children}
    </pre>
  ),
  code: ({ children, className }) => (
    <code className={`rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] text-teal-800 ${className ?? ""}`}>
      {children}
    </code>
  ),
};

export default function AssistantMarkdown({ content }: { content: string }) {
  return (
    <div className="space-y-2 text-xs leading-relaxed">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
