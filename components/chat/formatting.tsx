import { DisplayMessage } from "@/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { preprocessLaTeX, renderCitations } from "@/utilities/formatting";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

export function Formatting({ message }: { message: DisplayMessage }) {
  const processedContent = preprocessLaTeX(message.content);
  const components = {
    code: ({ children, className, node, ...rest }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      return match ? (
        <SyntaxHighlighter
          {...rest}
          PreTag="div"
          className="rounded-xl"
          children={String(children).replace(/\n$/, "")}
          language={match[1]}
        />
      ) : (
        <code {...rest} className={className}>
          {children}
        </code>
      );
    },
    p: ({ children }: { children: React.ReactNode }) => {
      return renderCitations(children, message.citations);
    },
    strong: ({ children }: { children: React.ReactNode }) => {
      return (
        <span className="font-bold">
          {renderCitations(children, message.citations)}
        </span>
      );
    },
    li: ({ children }: { children: React.ReactNode }) => {
      return renderCitations(children, message.citations);
    },
  };
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={components as any}
      className="gap-3 flex flex-col"
    >
      {processedContent}
    </ReactMarkdown>
  );
}
