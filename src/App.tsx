import { useState, useEffect, useCallback } from "react";
import { EditorContent } from "@tiptap/react";
import { MenuBar } from "./components/editor/MenuBar";
import { useBlockEditor } from "./components/editor/hooks/useBlockEditor";
import { LibrarySidebar } from "./components/library/LibrarySidebar";
import { ExportShareMenu } from "./components/editor/ExportMenu";
import { useDocuments } from "./hooks/useDocuments";
import { Menu } from "lucide-react";
import "./styles/tokens.css";
import "./styles/layout.css";
import "./styles/editor.css";

const DEFAULT_CONTENT = {
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
        { type: "text", text: "Este é um editor rico e poderoso. Comece a digitar aqui..." },
      ],
    },
  ],
};

export default function App() {
  const { saveDocument, getDocument } = useDocuments();
  const [activeId, setActiveId] = useState<number | undefined>(undefined);
  const [title, setTitle] = useState("Meu Texto");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { editor, setContent, characterCount, wordCount } = useBlockEditor({
    content: DEFAULT_CONTENT,
    onChange: (content) => {
      if (activeId !== undefined) {
        saveDocument(title, content, activeId);
      }
    },
  });

  // Handle title changes (autosave)
  useEffect(() => {
    if (activeId !== undefined && editor) {
      const timer = setTimeout(() => {
        saveDocument(title, editor.getJSON(), activeId);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [title, activeId, editor, saveDocument]);

  const handleNewDocument = async () => {
    const id = await saveDocument("Novo Texto", DEFAULT_CONTENT);
    setActiveId(id);
    setTitle("Novo Texto");
    setContent(DEFAULT_CONTENT);
  };

  const handleSelectDocument = async (id: number) => {
    const doc = await getDocument(id);
    if (doc) {
      setActiveId(id);
      setTitle(doc.title);
      setContent(doc.content);
    }
  };

  return (
    <div className="app">
      <LibrarySidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onSelectDocument={handleSelectDocument}
        activeId={activeId}
        onNew={handleNewDocument}
      />
      
      <main className="main">
        <header className="header">
          {!isSidebarOpen && (
            <button className="header__toggle" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={18} />
            </button>
          )}
          
          <div className="header__title-wrapper">
            <input 
              type="text" 
              className="header__title-input" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título do documento..."
            />
          </div>

          <div className="header__stats">
            <div className="header__stat">
              <span className="header__stat-value">{wordCount}</span>
              <span>palavras</span>
            </div>
            <div className="header__stat">
              <span className="header__stat-value">{characterCount}</span>
              <span>chars</span>
            </div>
          </div>

          <div className="header__actions">
            {editor && <ExportShareMenu editor={editor} title={title} />}
          </div>
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
