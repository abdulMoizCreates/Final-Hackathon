"use client";

import React, { useState } from "react";

interface MarkdownResponseProps {
  content: string;
  isStreaming?: boolean;
}

type Token = {
  type:
    | "keyword"
    | "string"
    | "comment"
    | "number"
    | "function"
    | "punctuation"
    | "plain";
  value: string;
};

// Lightweight zero-dependency syntax highlighter for common programming languages
function tokenizeCodeLine(line: string, lang: string): Token[] {
  const tokens: Token[] = [];
  const normalizedLang = lang.toLowerCase();
  let i = 0;

  while (i < line.length) {
    // Single line comments
    if (
      line.slice(i, i + 2) === "//" ||
      ((normalizedLang === "python" ||
        normalizedLang === "bash" ||
        normalizedLang === "sh" ||
        normalizedLang === "shell") &&
        line[i] === "#")
    ) {
      tokens.push({ type: "comment", value: line.slice(i) });
      break;
    }

    // Strings: double, single, or backticks
    if (line[i] === '"' || line[i] === "'" || line[i] === "`") {
      const quote = line[i];
      let j = i + 1;
      while (j < line.length && line[j] !== quote) {
        if (line[j] === "\\") j++; // escape next char
        j++;
      }
      tokens.push({ type: "string", value: line.slice(i, j + 1) });
      i = j + 1;
      continue;
    }

    // Numbers
    const numMatch = line.slice(i).match(/^\b\d+(\.\d+)?\b/);
    if (numMatch) {
      tokens.push({ type: "number", value: numMatch[0] });
      i += numMatch[0].length;
      continue;
    }

    // Identifiers & Keywords
    const wordMatch = line.slice(i).match(/^[a-zA-Z_$][a-zA-Z0-9_$]*/);
    if (wordMatch) {
      const word = wordMatch[0];
      const jsKeywords = new Set([
        "const",
        "let",
        "var",
        "function",
        "return",
        "if",
        "else",
        "for",
        "while",
        "import",
        "from",
        "export",
        "default",
        "class",
        "extends",
        "new",
        "this",
        "async",
        "await",
        "try",
        "catch",
        "finally",
        "throw",
        "typeof",
        "instanceof",
        "switch",
        "case",
        "break",
        "continue",
        "interface",
        "type",
        "def",
        "elif",
        "None",
        "True",
        "False",
        "null",
        "undefined",
        "true",
        "false",
      ]);

      if (jsKeywords.has(word)) {
        tokens.push({ type: "keyword", value: word });
      } else if (line.slice(i + word.length).trim().startsWith("(")) {
        tokens.push({ type: "function", value: word });
      } else {
        tokens.push({ type: "plain", value: word });
      }
      i += word.length;
      continue;
    }

    tokens.push({ type: "plain", value: line[i] });
    i++;
  }

  return tokens;
}

function CodeBlock({
  code,
  language,
}: {
  code: string;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access might fail in unsecure iframe or restricted environment
    }
  };

  const lines = code.split("\n");
  const langDisplay = language ? language.toUpperCase() : "CODE";

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-zinc-700/60 bg-zinc-950 text-zinc-100 shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-3 py-1.5 text-xs text-zinc-400">
        <span className="font-mono text-[11px] font-semibold tracking-wider text-zinc-300">
          {langDisplay}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded px-2 py-0.5 text-[11px] font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-3.5 font-mono text-xs leading-relaxed">
        <code>
          {lines.map((line, lineIdx) => {
            const tokens = tokenizeCodeLine(line, language || "");
            return (
              <div key={lineIdx} className="table-row">
                <span className="table-cell">
                  {tokens.map((token, tokenIdx) => {
                    let tokenClass = "text-zinc-200";
                    if (token.type === "keyword") {
                      tokenClass = "text-purple-400 font-medium";
                    } else if (token.type === "string") {
                      tokenClass = "text-emerald-400";
                    } else if (token.type === "comment") {
                      tokenClass = "text-zinc-500 italic";
                    } else if (token.type === "number") {
                      tokenClass = "text-amber-300";
                    } else if (token.type === "function") {
                      tokenClass = "text-sky-400";
                    }
                    return (
                      <span key={tokenIdx} className={tokenClass}>
                        {token.value}
                      </span>
                    );
                  })}
                </span>
              </div>
            );
          })}
        </code>
      </pre>
    </div>
  );
}

function renderInline(
  text: string,
  isStreaming: boolean = false
): React.ReactNode[] {
  let processed = text;

  // If streaming and text contains unclosed delimiters at the end,
  // close them temporarily so raw delimiters are not exposed
  if (isStreaming) {
    const backticks = (processed.match(/`/g) || []).length;
    if (backticks % 2 !== 0) {
      processed += "`";
    }
    const tripleAsterisks = (processed.match(/\*\*\*/g) || []).length;
    if (tripleAsterisks % 2 !== 0) {
      processed += "***";
    } else {
      const doubleAsterisks = (processed.match(/\*\*/g) || []).length;
      if (doubleAsterisks % 2 !== 0) {
        processed += "**";
      }
    }
  }

  // Regex matches inline markdown tokens: `code`, ***bold italic***, **bold**, *italic*, [link](url)
  const regex =
    /(`[^`]+`|\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|\[[^\]]+\]\([^)]+\))/g;
  const parts = processed.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Inline Code: `code`
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code
          key={index}
          className="rounded border border-zinc-200/80 bg-zinc-200/70 px-1.5 py-0.5 font-mono text-[12px] font-medium text-zinc-900 dark:border-zinc-700/80 dark:bg-zinc-800 dark:text-zinc-100"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Bold Italic: ***text***
    if (part.startsWith("***") && part.endsWith("***") && part.length >= 6) {
      return (
        <strong
          key={index}
          className="font-semibold italic text-zinc-950 dark:text-zinc-50"
        >
          {part.slice(3, -3)}
        </strong>
      );
    }

    // Bold: **text** or __text__
    if (
      (part.startsWith("**") && part.endsWith("**") && part.length >= 4) ||
      (part.startsWith("__") && part.endsWith("__") && part.length >= 4)
    ) {
      return (
        <strong
          key={index}
          className="font-semibold text-zinc-950 dark:text-zinc-50"
        >
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Italic: *text* or _text_
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

    // Link: [text](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue-600 underline underline-offset-2 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {linkMatch[1]}
        </a>
      );
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

export default function MarkdownResponse({
  content,
  isStreaming = false,
}: MarkdownResponseProps) {
  if (!content) return null;

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeBlockLang = "";
  let codeBlockLines: string[] = [];

  let currentListType: "ul" | "ol" | null = null;
  let currentListItems: React.ReactNode[] = [];

  let currentTableLines: string[] = [];
  let currentParagraphLines: string[] = [];

  const flushParagraph = () => {
    if (currentParagraphLines.length === 0) return;
    const pLines = currentParagraphLines;
    elements.push(
      <p
        key={`p-${elements.length}`}
        className="my-2 text-xs leading-relaxed text-zinc-800 dark:text-zinc-200 first:mt-0 last:mb-0"
      >
        {pLines.map((line, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <br />}
            {renderInline(line, isStreaming)}
          </React.Fragment>
        ))}
      </p>
    );
    currentParagraphLines = [];
  };

  const flushList = () => {
    if (!currentListType || currentListItems.length === 0) return;
    const isOrdered = currentListType === "ol";
    elements.push(
      <div
        key={`list-${elements.length}`}
        className="my-2 pl-4 text-xs leading-relaxed text-zinc-800 dark:text-zinc-200"
      >
        {isOrdered ? (
          <ol className="list-decimal space-y-1.5 pl-1">{currentListItems}</ol>
        ) : (
          <ul className="list-disc space-y-1.5 pl-1">{currentListItems}</ul>
        )}
      </div>
    );
    currentListType = null;
    currentListItems = [];
  };

  const flushTable = () => {
    if (currentTableLines.length === 0) return;
    const rows = currentTableLines.map((line) =>
      line
        .trim()
        .slice(1, -1)
        .split("|")
        .map((c) => c.trim())
    );
    // Filter out delimiter row like | --- | --- |
    const contentRows = rows.filter(
      (row) => !row.every((c) => /^:?-+:?$/.test(c))
    );
    if (contentRows.length > 0) {
      const [header, ...body] = contentRows;
      elements.push(
        <div
          key={`table-${elements.length}`}
          className="my-3 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800"
        >
          <table className="w-full text-left font-mono text-[11px]">
            {header && (
              <thead className="border-b border-zinc-200 bg-zinc-100/70 dark:border-zinc-800 dark:bg-zinc-800/60 font-semibold text-zinc-900 dark:text-zinc-100">
                <tr>
                  {header.map((h, hIdx) => (
                    <th key={hIdx} className="px-2.5 py-1.5">
                      {renderInline(h, isStreaming)}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60">
              {body.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                >
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className="px-2.5 py-1.5 text-zinc-700 dark:text-zinc-300"
                    >
                      {renderInline(cell, isStreaming)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    currentTableLines = [];
  };

  const flushAll = () => {
    flushParagraph();
    flushList();
    flushTable();
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block opening or closing
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        // Closing fence
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
        flushAll();
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

    // Blank line terminates current paragraph/list/table
    if (!line.trim()) {
      flushAll();
      continue;
    }

    // Table Row (| col1 | col2 |)
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      flushParagraph();
      flushList();
      currentTableLines.push(line);
      continue;
    } else if (currentTableLines.length > 0) {
      flushTable();
    }

    // Headings: #, ##, ###, ####
    if (line.startsWith("#")) {
      flushAll();
      const match = line.match(/^(#{1,4})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const headingText = match[2];

        if (level === 1) {
          elements.push(
            <h1
              key={`h-${elements.length}`}
              className="mt-3.5 mb-1.5 text-base font-bold text-zinc-950 dark:text-white"
            >
              {renderInline(headingText, isStreaming)}
            </h1>
          );
        } else if (level === 2) {
          elements.push(
            <h2
              key={`h-${elements.length}`}
              className="mt-3 mb-1 text-sm font-bold text-zinc-950 dark:text-white"
            >
              {renderInline(headingText, isStreaming)}
            </h2>
          );
        } else if (level === 3) {
          elements.push(
            <h3
              key={`h-${elements.length}`}
              className="mt-2.5 mb-1 text-xs font-semibold text-zinc-900 dark:text-zinc-100"
            >
              {renderInline(headingText, isStreaming)}
            </h3>
          );
        } else {
          elements.push(
            <h4
              key={`h-${elements.length}`}
              className="mt-2 mb-0.5 text-xs font-medium text-zinc-900 dark:text-zinc-100"
            >
              {renderInline(headingText, isStreaming)}
            </h4>
          );
        }
        continue;
      }
    }

    // Horizontal Rule
    if (/^(\*\*\*|---|___)$/.test(line.trim())) {
      flushAll();
      elements.push(
        <hr
          key={`hr-${elements.length}`}
          className="my-3 border-zinc-200 dark:border-zinc-700"
        />
      );
      continue;
    }

    // Blockquote
    if (line.startsWith(">")) {
      flushAll();
      elements.push(
        <blockquote
          key={`quote-${elements.length}`}
          className="my-2 border-l-2 border-zinc-400 pl-3 italic text-zinc-700 dark:border-zinc-600 dark:text-zinc-300 text-xs"
        >
          {renderInline(line.replace(/^>\s?/, ""), isStreaming)}
        </blockquote>
      );
      continue;
    }

    // Unordered List: * or -
    const ulMatch = line.match(/^(\*|-)\s+(.+)$/);
    if (ulMatch) {
      flushParagraph();
      if (currentListType !== "ul") {
        flushList();
        currentListType = "ul";
      }
      currentListItems.push(
        <li key={`li-${currentListItems.length}`}>
          {renderInline(ulMatch[2], isStreaming)}
        </li>
      );
      continue;
    }

    // Ordered List: 1.
    const olMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (olMatch) {
      flushParagraph();
      if (currentListType !== "ol") {
        flushList();
        currentListType = "ol";
      }
      currentListItems.push(
        <li key={`li-${currentListItems.length}`}>
          {renderInline(olMatch[2], isStreaming)}
        </li>
      );
      continue;
    }

    // Regular Paragraph line
    flushList();
    flushTable();
    currentParagraphLines.push(line);
  }

  // Flush remaining elements
  flushAll();

  // If streaming and code block is currently open without closing fence
  if (inCodeBlock) {
    elements.push(
      <CodeBlock
        key={`code-open-${elements.length}`}
        code={codeBlockLines.join("\n")}
        language={codeBlockLang}
      />
    );
  }

  return <div className="space-y-1">{elements}</div>;
}
