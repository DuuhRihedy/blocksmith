import React, { useState } from "react";
import { Share2, FileDown, MessageSquare, Send, Image as ImageIcon, Copy, Check } from "lucide-react";
import { Editor } from "@tiptap/react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

interface ExportShareMenuProps {
  editor: Editor;
  title: string;
}

export const ExportShareMenu: React.FC<ExportShareMenuProps> = ({ editor, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleExportPDF = async () => {
    const element = document.querySelector(".tiptap") as HTMLElement;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });
    
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${title || "documento"}.pdf`);
    setIsOpen(false);
  };

  const handleExportDocx = async () => {
    // Basic conversion from TipTap JSON/Text to DOCX
    // For a more advanced conversion, we'd need to recursivevly walk the JSON
    const content = editor.getText();
    const doc = new Document({
      sections: [{
        properties: {},
        children: content.split("\n").map(line => new Paragraph({
          children: [new TextRun(line)],
        })),
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${title || "documento"}.docx`);
    setIsOpen(false);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Confira meu texto no Blocksmith: ${title}`;
    let shareUrl = "";

    switch (platform) {
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case "messenger":
        shareUrl = `fb-messenger://share/?link=${encodeURIComponent(url)}`;
        break;
      case "canva":
        window.open("https://www.canva.com/", "_blank");
        return;
    }

    if (shareUrl) window.open(shareUrl, "_blank");
    setIsOpen(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="header__dropdown">
      <button 
        className="header__action-btn header__action-btn--export"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Share2 size={16} />
        <span>Compartilhar</span>
      </button>

      {isOpen && (
        <div className="header__dropdown-menu">
          <div className="header__dropdown-section">
            <span className="header__dropdown-label">Exportar</span>
            <button className="header__dropdown-item" onClick={handleExportPDF}>
              <FileDown size={14} /> PDF (.pdf)
            </button>
            <button className="header__dropdown-item" onClick={handleExportDocx}>
              <FileDown size={14} /> Word (.docx)
            </button>
          </div>

          <div className="header__dropdown-section">
            <span className="header__dropdown-label">Redes Sociais</span>
            <button className="header__dropdown-item" onClick={() => handleShare("whatsapp")}>
              <MessageSquare size={14} /> WhatsApp
            </button>
            <button className="header__dropdown-item" onClick={() => handleShare("twitter")}>
              <Share2 size={14} /> Twitter (X)
            </button>
            <button className="header__dropdown-item" onClick={() => handleShare("linkedin")}>
              <Share2 size={14} /> LinkedIn
            </button>
            <button className="header__dropdown-item" onClick={() => handleShare("messenger")}>
              <Send size={14} /> Messenger
            </button>
            <button className="header__dropdown-item" onClick={() => handleShare("canva")}>
              <ImageIcon size={14} /> Canva (Abrir)
            </button>
          </div>

          <div className="header__dropdown-section">
            <button className="header__dropdown-item" onClick={copyToClipboard}>
              {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
              {copied ? "Link Copiado!" : "Copiar Link"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
