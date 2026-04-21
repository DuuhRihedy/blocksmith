import { EditorContent } from "@tiptap/react";
import { MenuBar } from "./components/editor/MenuBar";
import { useBlockEditor } from "./components/editor/hooks/useBlockEditor";
import { SlashMenu } from "./components/editor/SlashMenu"; // In case it's used
import "./styles/tokens.css";
import "./styles/layout.css";
import "./styles/editor.css";

export default function App() {
  const { editor } = useBlockEditor({
    content: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "Bem-vindo ao Blocksmith" }],
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Este é um editor rico baseado no TipTap. Comece a digitar ou " },
            { type: "text", marks: [{ type: "bold" }], text: "formate" },
            { type: "text", text: " seu texto usando o menu acima." },
          ],
        },
      ],
    },
  });

  return (
    <div className="app">
      <main className="main">
        <header className="header" style={{ justifyContent: "center" }}>
          <h1 className="header__title-input" style={{ textAlign: "center", border: "none", width: "auto" }}>
            Blocksmith Editor
          </h1>
        </header>

        <div className="editor-container">
          <div className="editor-container__inner">
            {editor && <MenuBar editor={editor} />}
            <EditorContent editor={editor!} />
          </div>
        </div>
      </main>
    </div>
  );
}
