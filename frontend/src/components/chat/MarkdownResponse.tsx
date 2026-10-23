"use client";

import React, { useState } from "react";

interface MarkdownResponseProps {
  content: string;
}

function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="my-2.5 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-950 text-zinc-100 dark:border-zinc-800">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-3 py-1.5 text-xs text-zinc-400">
        <span className="font-mono text-[11px] uppercase tracking-wider">
          {language || "code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded px-2 py-0.5 text-[11px] text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 font-mono text-xs leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function renderInline(text: string): React.ReactNode[] {
  // Regex token matching for inline markdown: code, bold, italic, link
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Inline code
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code
          key={index}
          className="rounded bg-zinc-200/70 px-1 py-0.5 font-mono text-[12px] font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Bold
    if (
      (part.startsWith("**") && part.endsWith("**") && part.length >= 4) ||
      (part.startsWith("__") && part.endsWith("__") && part.length >= 4)
    ) {
      return (
        <strong key={index} className="font-semibold text-zinc-900 dark:text-zinc-50">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Italic
    if (
      (part.startsWith("*") && part.endsWith("*") && part.length >= 2) ||
      (part.startsWith("_") && part.endsWith("_") && part.length >= 2)
    ) {
      return (
        <em key={index} className="italic text-zinc-800 dark:text-zinc-200">
          {part.slice(1, -1)}
        </em>
      );
    }

    // Link [text](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 transition hover:opacity-75"
        >
          {linkMatch[1]}
        </a>
      );
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

export default function MarkdownResponse({ content }: MarkdownResponseProps) {
  if (!content) return null;

  // Split lines while preserving code fences
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeBlockLang = "";
  let codeBlockLines: string[] = [];

  let currentListType: "ul" | "ol" | null = null;
  let currentListItems: React.ReactNode[] = [];

  const flushList = () => {
    if (!currentListType || currentListItems.length === 0) return;
    const ListTag = currentListType;
    elements.push(
      <ListTag
        key={`list-${elements.length}`}
        className={`my-2 space-y-1 pl-4 text-xs leading-relaxed text-zinc-800 dark:text-zinc-200 ${
          currentListType === "ol" ? "list-decimal" : "list-disc"
        }`}
      >
        {currentListItems}
      </ListTag>
    );
    currentListType = null;
    currentListItems = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check code fence
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        // End code block
        elements.push(
          <CodeBlock
            key={`code-${elements.length}`}
            code={codeBlockLines.join("\n")}
            language={codeBlockLang}
          />
        );
        inCodeBlock = false;
        codeBlockLines = [];
        codeBlockLang = "";
      } else {
        flushList();
        inCodeBlock = true;
        codeBlockLang = line.trim().slice(3).trim();
        codeBlockLines = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    // Empty lines
    if (!line.trim()) {
      flushList();
      continue;
    }

    // Headings
    if (line.startsWith("#")) {
      flushList();
      const match = line.match(/^(#{1,4})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const headingText = match[2];
        const headingStyles =
          level === 1
            ? "text-base font-semibold text-zinc-950 dark:text-white mt-3 mb-1.5"
            : level === 2
            ? "text-sm font-semibold text-zinc-950 dark:text-white mt-2.5 mb-1"
            : "text-xs font-semibold text-zinc-900 dark:text-zinc-100 mt-2 mb-1 uppercase tracking-wider";

        elements.push(
          <div key={`h-${elements.length}`} className={headingStyles}>
            {renderInline(headingText)}
          </div>
        );
        continue;
      }
    }

    // Horizontal Rule
    if (/^(\*\*\*|---|___)$/.test(line.trim())) {
      flushList();
      elements.push(
        <hr
          key={`hr-${elements.length}`}
          className="my-3 border-zinc-200 dark:border-zinc-800"
        />
      );
      continue;
    }

    // Blockquote
    if (line.startsWith(">")) {
      flushList();
      elements.push(
        <blockquote
          key={`quote-${elements.length}`}
          className="my-2 border-l-2 border-zinc-300 pl-3 italic text-zinc-600 dark:border-zinc-700 dark:text-zinc-400 text-xs"
        >
          {renderInline(line.replace(/^>\s?/, ""))}
        </blockquote>
      );
      continue;
    }

    // Unordered List (* or -)
    const ulMatch = line.match(/^(\*|-)\s+(.+)$/);
    if (ulMatch) {
      if (currentListType !== "ul") {
        flushList();
        currentListType = "ul";
      }
      currentListItems.push(
        <li key={`li-${currentListItems.length}`}>
          {renderInline(ulMatch[2])}
        </li>
      );
      continue;
    }

    // Ordered List (1. )
    const olMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (olMatch) {
      if (currentListType !== "ol") {
        flushList();
        currentListType = "ol";
      }
      currentListItems.push(
        <li key={`li-${currentListItems.length}`}>
          {renderInline(olMatch[2])}
        </li>
      );
      continue;
    }

    // Table Row (| col1 | col2 |)
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      // Basic table row support
      flushList();
      const cells = line
        .trim()
        .slice(1, -1)
        .split("|")
        .map((c) => c.trim());
      // Skip separator row like | --- | --- |
      if (cells.every((c) => /^:?-+:?$/.test(c))) {
        continue;
      }
      elements.push(
        <div
          key={`table-row-${elements.length}`}
          className="my-0.5 flex gap-2 border-b border-zinc-200/60 py-1 font-mono text-[11px] text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
        >
          {cells.map((cell, cIdx) => (
            <span key={cIdx} className="flex-1">
              {renderInline(cell)}
            </span>
          ))}
        </div>
      );
      continue;
    }

    // Default: Regular Paragraph
    flushList();
    elements.push(
      <p
        key={`p-${elements.length}`}
        className="text-xs leading-relaxed text-zinc-800 dark:text-zinc-200"
      >
        {renderInline(line)}
      </p>
    );
  }

  // Flush remaining list or unclosed code block (e.g. during live streaming)
  flushList();
  if (inCodeBlock) {
    elements.push(
      <CodeBlock
        key={`code-open-${elements.length}`}
        code={codeBlockLines.join("\n")}
        language={codeBlockLang}
      />
    );
  }

  return <div className="space-y-1.5">{elements}</div>;
}
