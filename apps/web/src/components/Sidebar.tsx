"use client";

import { useRouter, usePathname } from "next/navigation";
import { Plus, FileText } from "lucide-react";
import type { DocumentSummary } from "@/lib/db";

interface SidebarProps {
    documents: DocumentSummary[];
    onNewDocument: () => void;
    activeId?: string;
}

export function Sidebar({ documents, onNewDocument, activeId }: SidebarProps) {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">B</div>
                    Blocksmith
                </div>
            </div>

            <nav className="sidebar-content">
                <div className="sidebar-section-title">Documentos</div>
                <ul className="sidebar-doc-list">
                    {documents.map((doc) => (
                        <li key={doc.id}>
                            <button
                                className={`sidebar-doc-item ${activeId === doc.id ? "active" : ""}`}
                                onClick={() => router.push(`/editor/${doc.id}`)}
                            >
                                <span className="sidebar-doc-emoji">
                                    {doc.emoji || "📄"}
                                </span>
                                <span className="sidebar-doc-title">
                                    {doc.title || "Sem título"}
                                </span>
                            </button>
                        </li>
                    ))}

                    {documents.length === 0 && (
                        <li>
                            <div
                                className="sidebar-doc-item"
                                style={{ color: "var(--text-faint)", cursor: "default" }}
                            >
                                <FileText size={16} />
                                <span>Nenhum documento</span>
                            </div>
                        </li>
                    )}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <button className="btn-new-doc" onClick={onNewDocument}>
                    <Plus size={18} />
                    Novo Documento
                </button>
            </div>
        </aside>
    );
}
