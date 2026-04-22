import React, { useState } from "react";
import { Plus, Search, FileText, Trash2, Edit3, MoreVertical, X, Menu } from "lucide-react";
import { useDocuments } from "../../hooks/useDocuments";
import { formatDistanceToNow } from "date-fns"; // We might need to install date-fns

interface LibrarySidebarProps {
  onSelectDocument: (id: number) => void;
  activeId?: number;
  isOpen: boolean;
  onClose: boolean;
}

export const LibrarySidebar: React.FC<{
  onSelectDocument: (id: number) => void;
  activeId?: number;
  isOpen: boolean;
  onToggle: () => void;
  onNew: () => void;
}> = ({ onSelectDocument, activeId, isOpen, onToggle, onNew }) => {
  const { documents, deleteDocument } = useDocuments();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocuments = documents?.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className={`sidebar__overlay ${isOpen ? "visible" : ""}`} onClick={onToggle} />
      <aside className={`sidebar ${!isOpen ? "collapsed" : ""}`}>
        <div className="sidebar__header">
          <div className="sidebar__logo">
            <div className="sidebar__logo-icon">B</div>
            <h1 className="sidebar__logo-text">Block<span>smith</span></h1>
          </div>
          <button className="sidebar__btn" onClick={onToggle}>
            <X size={16} />
          </button>
        </div>

        <div className="sidebar__actions">
          <button className="sidebar__btn sidebar__btn--primary" onClick={onNew}>
            <Plus size={16} />
            Novo Documento
          </button>
        </div>

        <div className="sidebar__search">
          <input
            type="text"
            className="sidebar__search-input"
            placeholder="Pesquisar textos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="sidebar__list">
          {filteredDocuments?.length === 0 ? (
            <div className="sidebar__empty">
              {searchQuery ? "Nenhum resultado encontrado." : "Nenhum texto salvo ainda."}
            </div>
          ) : (
            filteredDocuments?.map((doc) => (
              <div
                key={doc.id}
                className={`sidebar__item ${activeId === doc.id ? "active" : ""}`}
                onClick={() => onSelectDocument(doc.id!)}
              >
                <div className="sidebar__item-icon">
                  <FileText size={18} />
                </div>
                <div className="sidebar__item-text">
                  <span className="sidebar__item-title">{doc.title || "Sem título"}</span>
                  <span className="sidebar__item-date">
                    {new Date(doc.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="sidebar__item-actions">
                  <button
                    className="sidebar__item-action delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Deseja excluir este documento?")) {
                        deleteDocument(doc.id!);
                      }
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="sidebar__footer">
          <span>v1.0.0 — Library Beta</span>
        </div>
      </aside>
    </>
  );
};
