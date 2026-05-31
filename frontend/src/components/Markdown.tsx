import React from "react";

const Markdown: React.FC<{ text: string }> = ({ text }) => {
  const renderInline = (line: string) => {
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const lines = text.split("\n").filter((l) => l.trim());
  const items: React.ReactNode[] = [];
  let inList = false;
  let listItems: React.ReactNode[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      items.push(
        <ul key={`ul-${items.length}`} className="list-disc list-inside space-y-1 my-1.5">
          {listItems}
        </ul>
      );
      listItems = [];
    }
    inList = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      inList = true;
      const content = trimmed.replace(/^[*-]\s+/, "");
      listItems.push(
        <li key={`li-${i}`} className="text-sm text-gray-800">
          {renderInline(content)}
        </li>
      );
    } else {
      flushList();
      items.push(
        <p key={`p-${i}`} className="text-sm text-gray-800">
          {renderInline(line)}
        </p>
      );
    }
  }
  flushList();

  return <>{items}</>;
};

export default Markdown;
