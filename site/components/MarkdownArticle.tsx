import type { ReactNode } from "react";

function renderInline(text: string): ReactNode[] {
  const tokens = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).filter(Boolean);

  return tokens.map((token, index) => {
    if (token.startsWith("**") && token.endsWith("**")) {
      return <strong key={`${token}-${index}`}>{token.slice(2, -2)}</strong>;
    }

    const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return (
        <a href={link[2]} key={`${link[2]}-${index}`} rel="noreferrer" target="_blank">
          {link[1]}
        </a>
      );
    }

    return token;
  });
}

type Block =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

function parseMarkdown(markdown: string): Block[] {
  const lines = markdown.replace(/\r/g, "").split("\n");
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];
  let reachedBody = false;

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: "paragraph", text: paragraph.join(" ").trim() });
      paragraph = [];
    }
  };

  const flushList = () => {
    if (list.length) {
      blocks.push({ type: "list", items: list });
      list = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line.startsWith("# ")) continue;

    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      reachedBody = true;
      blocks.push({ type: "heading", text: line.slice(3) });
      continue;
    }

    if (!reachedBody) continue;

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    if (line.startsWith("- ")) {
      flushParagraph();
      list.push(line.slice(2));
      continue;
    }

    flushList();
    paragraph.push(line);
  }

  flushParagraph();
  flushList();
  return blocks;
}

export function MarkdownArticle({ markdown }: { markdown: string }) {
  return (
    <div className="longform-body">
      {parseMarkdown(markdown).map((block, index) => {
        if (block.type === "heading") {
          return <h2 key={`${block.text}-${index}`}>{block.text}</h2>;
        }

        if (block.type === "list") {
          return (
            <ul key={`list-${index}`}>
              {block.items.map((item) => <li key={item}>{renderInline(item)}</li>)}
            </ul>
          );
        }

        return <p key={`paragraph-${index}`}>{renderInline(block.text)}</p>;
      })}
    </div>
  );
}
