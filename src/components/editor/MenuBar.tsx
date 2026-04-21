import type { Editor } from "@tiptap/react";
import {
  Bold, Italic, Strikethrough, Underline as UnderlineIcon, Code,
  Heading1, Heading2, Heading3,
  Link as LinkIcon, Unlink, List, ListOrdered, CheckSquare, Quote,
  Minus, ImageIcon, CodeIcon, Undo, Redo, X, Type,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Highlighter,
} from "lucide-react";
import { useState, useCallback } from "react";

const TEXT_COLORS = [
  { name: "Padrão", value: "" },
  { name: "Branco", value: "#ffffff" },
  { name: "Cinza", value: "#a3a3a3" },
  { name: "Vermelho", value: "#ef4444" },
  { name: "Laranja", value: "#f97316" },
  { name: "Âmbar", value: "#f59e0b" },
  { name: "Amarelo", value: "#eab308" },
  { name: "Verde", value: "#22c55e" },
  { name: "Ciano", value: "#06b6d4" },
  { name: "Azul", value: "#3b82f6" },
  { name: "Rosa", value: "#ec4899" },
  { name: "Roxo", value: "#a855f7" },
];

interface MenuBarProps {
  editor: Editor;
  onImageRequest?: () => void;
}

export function MenuBar({ editor, onImageRequest }: MenuBarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const setLink = useCallback(() => {
    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setShowLinkInput(false);
      return;
    }
    const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    setShowLinkInput(false);
    setLinkUrl("");
  }, [editor, linkUrl]);

  const setColor = useCallback(
    (color: string) => {
      if (color === "") editor.chain().focus().unsetColor().run();
      else editor.chain().focus().setColor(color).run();
      setShowColorPicker(false);
    },
    [editor]
  );

  const addImage = useCallback(() => {
    if (onImageRequest) {
      onImageRequest();
    } else {
      const url = window.prompt("URL da imagem:");
      if (url) editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor, onImageRequest]);

  const currentColor = editor.getAttributes("textStyle").color || "";

  return (
    <div className="blocksmith-menubar">
      <div className="blocksmith-menubar-inner">
        {/* Undo / Redo */}
        <div className="blocksmith-menubar-group">
          <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="blocksmith-menubar-btn" title="Desfazer (Ctrl+Z)"><Undo size={15} /></button>
          <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="blocksmith-menubar-btn" title="Refazer (Ctrl+Y)"><Redo size={15} /></button>
        </div>
        <div className="blocksmith-menubar-sep" />

        {/* Formatting */}
        <div className="blocksmith-menubar-group">
          <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`blocksmith-menubar-btn ${editor.isActive("bold") ? "is-active" : ""}`} title="Negrito"><Bold size={15} /></button>
          <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`blocksmith-menubar-btn ${editor.isActive("italic") ? "is-active" : ""}`} title="Itálico"><Italic size={15} /></button>
          <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`blocksmith-menubar-btn ${editor.isActive("underline") ? "is-active" : ""}`} title="Sublinhado"><UnderlineIcon size={15} /></button>
          <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={`blocksmith-menubar-btn ${editor.isActive("strike") ? "is-active" : ""}`} title="Tachado"><Strikethrough size={15} /></button>
          <button type="button" onClick={() => editor.chain().focus().toggleCode().run()} className={`blocksmith-menubar-btn ${editor.isActive("code") ? "is-active" : ""}`} title="Código inline"><Code size={15} /></button>
          <button type="button" onClick={() => editor.chain().focus().toggleHighlight().run()} className={`blocksmith-menubar-btn ${editor.isActive("highlight") ? "is-active" : ""}`} title="Destacar"><Highlighter size={15} /></button>
        </div>
        <div className="blocksmith-menubar-sep" />

        {/* Text Color */}
        <div className="blocksmith-menubar-group" style={{ position: "relative" }}>
          <button type="button" onClick={() => { setShowLinkInput(false); setShowColorPicker(!showColorPicker); }} className={`blocksmith-menubar-btn ${currentColor ? "is-active" : ""}`} title="Cor do texto">
            <Type size={15} />
            <span className="blocksmith-menubar-color-bar" style={{ background: currentColor || "var(--text-primary)" }} />
          </button>
          {showColorPicker && (
            <div className="blocksmith-menubar-dropdown">
              <div className="blocksmith-menubar-dropdown-title">Cor do texto</div>
              <div className="blocksmith-menubar-color-grid">
                {TEXT_COLORS.map((color) => (
                  <button key={color.name} type="button" className={`blocksmith-menubar-color-cell ${currentColor === color.value ? "is-active" : ""}`} onClick={() => setColor(color.value)} title={color.name}>
                    {color.value === "" ? <X size={12} /> : <span className="blocksmith-color-dot" style={{ background: color.value }} />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="blocksmith-menubar-sep" />

        {/* Headings */}
        <div className="blocksmith-menubar-group">
          <button type="button" onClick={() => editor.chain().focus().setParagraph().run()} className={`blocksmith-menubar-btn ${editor.isActive("paragraph") && !editor.isActive("heading") ? "is-active" : ""}`} title="Parágrafo"><Type size={15} /></button>
          <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`blocksmith-menubar-btn ${editor.isActive("heading", { level: 1 }) ? "is-active" : ""}`} title="Título 1"><Heading1 size={15} /></button>
          <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`blocksmith-menubar-btn ${editor.isActive("heading", { level: 2 }) ? "is-active" : ""}`} title="Título 2"><Heading2 size={15} /></button>
          <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`blocksmith-menubar-btn ${editor.isActive("heading", { level: 3 }) ? "is-active" : ""}`} title="Título 3"><Heading3 size={15} /></button>
        </div>
        <div className="blocksmith-menubar-sep" />

        {/* Alignment */}
        <div className="blocksmith-menubar-group">
          <button type="button" onClick={() => editor.chain().focus().setTextAlign("left").run()} className={`blocksmith-menubar-btn ${editor.isActive({ textAlign: "left" }) ? "is-active" : ""}`} title="Alinhar à esquerda"><AlignLeft size={15} /></button>
          <button type="button" onClick={() => editor.chain().focus().setTextAlign("center").run()} className={`blocksmith-menubar-btn ${editor.isActive({ textAlign: "center" }) ? "is-active" : ""}`} title="Centralizar"><AlignCenter size={15} /></button>
          <button type="button" onClick={() => editor.chain().focus().setTextAlign("right").run()} className={`blocksmith-menubar-btn ${editor.isActive({ textAlign: "right" }) ? "is-active" : ""}`} title="Alinhar à direita"><AlignRight size={15} /></button>
          <button type="button" onClick={() => editor.chain().focus().setTextAlign("justify").run()} className={`blocksmith-menubar-btn ${editor.isActive({ textAlign: "justify" }) ? "is-active" : ""}`} title="Justificar"><AlignJustify size={15} /></button>
        </div>
        <div className="blocksmith-menubar-sep" />

        {/* Lists */}
        <div className="blocksmith-menubar-group">
          <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`blocksmith-menubar-btn ${editor.isActive("bulletList") ? "is-active" : ""}`} title="Lista"><List size={15} /></button>
          <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`blocksmith-menubar-btn ${editor.isActive("orderedList") ? "is-active" : ""}`} title="Numerada"><ListOrdered size={15} /></button>
          <button type="button" onClick={() => editor.chain().focus().toggleTaskList().run()} className={`blocksmith-menubar-btn ${editor.isActive("taskList") ? "is-active" : ""}`} title="Tarefas"><CheckSquare size={15} /></button>
        </div>
        <div className="blocksmith-menubar-sep" />

        {/* Blocks */}
        <div className="blocksmith-menubar-group">
          <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`blocksmith-menubar-btn ${editor.isActive("blockquote") ? "is-active" : ""}`} title="Citação"><Quote size={15} /></button>
          <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={`blocksmith-menubar-btn ${editor.isActive("codeBlock") ? "is-active" : ""}`} title="Bloco de código"><CodeIcon size={15} /></button>
          <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className="blocksmith-menubar-btn" title="Divisor"><Minus size={15} /></button>
          <button type="button" onClick={addImage} className="blocksmith-menubar-btn" title="Inserir imagem"><ImageIcon size={15} /></button>
        </div>
        <div className="blocksmith-menubar-sep" />

        {/* Link */}
        <div className="blocksmith-menubar-group" style={{ position: "relative" }}>
          <button type="button" onClick={() => { setShowColorPicker(false); if (editor.isActive("link")) editor.chain().focus().unsetLink().run(); else setShowLinkInput(!showLinkInput); }} className={`blocksmith-menubar-btn ${editor.isActive("link") ? "is-active" : ""}`} title={editor.isActive("link") ? "Remover link" : "Inserir link"}>
            {editor.isActive("link") ? <Unlink size={15} /> : <LinkIcon size={15} />}
          </button>
          {showLinkInput && (
            <div className="blocksmith-menubar-dropdown">
              <div className="blocksmith-menubar-dropdown-title">Inserir link</div>
              <div className="blocksmith-menubar-link-row">
                <input type="url" placeholder="https://exemplo.com" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") setLink(); if (e.key === "Escape") setShowLinkInput(false); }} autoFocus />
                <button type="button" onClick={setLink}>OK</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
