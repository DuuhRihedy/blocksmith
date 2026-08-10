"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, Trash2 } from "lucide-react";
import { ExportMenu } from "@/components/ExportMenu";
import { exportToPDF, exportToDOCX } from "@/lib/export";
import { BlockEditor } from "@blocksmith/editor";
import { api, type Document, type DocumentSummary } from "@/lib/db";

type JSONContent = {
    type?: string;
    attrs?: Record<string, unknown>;
    content?: JSONContent[];
    marks?: { type: string; attrs?: Record<string, unknown> }[];
    text?: string;
};
import { Sidebar } from "@/components/Sidebar";
import { ConfirmDialog } from "@/components/ConfirmDialog";

const EMOJIS = [
    "📄", "📝", "📒", "📕", "📗", "📘", "📙", "📓",
    "🗒️", "💡", "🚀", "⭐", "🎯", "🔥", "💎", "🎨",
    "🧩", "📊", "📈", "🗂️", "📌", "🏷️", "🔖", "✨",
    "🌟", "💻", "🛠️", "⚡", "🎉", "🧠", "📐", "🎓",
];

export default function EditorPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [document, setDocument] = useState<Document | null>(null);
    const [documents, setDocuments] = useState<DocumentSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const titleRef = useRef<HTMLInputElement>(null);

    const fetchDocument = useCallback(async () => {
        try {
            const [doc, docs] = await Promise.all([
                api.documents.get(id),
                api.documents.list(),
            ]);
            setDocument(doc);
            setDocuments(docs);
        } catch (err) {
            console.error("Erro ao carregar documento:", err);
            router.push("/");
        } finally {
            setLoading(false);
        }
    }, [id, router]);

    useEffect(() => {
        fetchDocument();
    }, [fetchDocument]);

    const saveDocument = useCallback(
        async (data: { title?: string; content?: string; emoji?: string }) => {
            setSaveStatus("saving");
            try {
                await api.documents.update(id, data);
                setSaveStatus("saved");
                setTimeout(() => setSaveStatus("idle"), 2000);
            } catch (err) {
                console.error("Erro ao salvar:", err);
                setSaveStatus("idle");
            }
        },
        [id]
    );

    const handleContentChange = useCallback(
        (content: JSONContent) => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }

            // Count words from content
            const text = extractText(content);
            setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);

            saveTimeoutRef.current = setTimeout(() => {
                saveDocument({ content: JSON.stringify(content) });
            }, 1500);
        },
        [saveDocument]
    );

    const handleTitleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const title = e.target.value;
            setDocument((prev) => (prev ? { ...prev, title } : null));

            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
            saveTimeoutRef.current = setTimeout(() => {
                saveDocument({ title });
            }, 1500);
        },
        [saveDocument]
    );

    const handleEmojiSelect = useCallback(
        (emoji: string) => {
            setDocument((prev) => (prev ? { ...prev, emoji } : null));
            setShowEmojiPicker(false);
            saveDocument({ emoji });
        },
        [saveDocument]
    );

    const handleNewDocument = async () => {
        try {
            const doc = await api.documents.create();
            router.push(`/editor/${doc.id}`);
        } catch (err) {
            console.error("Erro ao criar documento:", err);
        }
    };

    if (loading) {
        return (
            <div className="app-container">
                <Sidebar documents={[]} onNewDocument={handleNewDocument} activeId={id} />
                <main className="main-content">
                    <div className="loading">
                        <div className="spinner" />
                        Carregando documento...
                    </div>
                </main>
            </div>
        );
    }

    if (!document) return null;

    const parsedContent = safeParseJSON(document.content);

    return (
        <div className="app-container">
            <Sidebar
                documents={documents}
                onNewDocument={handleNewDocument}
                activeId={id}
            />

            <main className="main-content">
                <div className="main-header">
                    <div className="main-header-left">
                        <button
                            className="btn-delete"
                            onClick={() => router.push("/")}
                            title="Voltar ao dashboard"
                            style={{ width: 34, height: 34 }}
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                            {document.emoji} {document.title || "Sem título"}
                        </span>
                    </div>
                    <div className="main-header-right">
                        <div
                            className={`save-indicator ${saveStatus}`}
                        >
                            <div className="save-dot" />
                            {saveStatus === "saving" && "Salvando..."}
                            {saveStatus === "saved" && "Salvo"}
                            {saveStatus === "idle" && ""}
                        </div>
                        <div className="word-count">
                            {wordCount} {wordCount === 1 ? "palavra" : "palavras"}
                        </div>
                        <ExportMenu
                            onExportPDF={() => exportToPDF(document.title)}
                            onExportDOCX={() =>
                                exportToDOCX(
                                    document.title,
                                    JSON.parse(document.content || "{}")
                                )
                            }
                        />
                        <button
                            className="btn-delete"
                            onClick={() => setShowDeleteConfirm(true)}
                            title="Excluir documento"
                            style={{ width: 34, height: 34 }}
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                <motion.div
                    className="editor-page"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="editor-title-area">
                        <button
                            className="editor-emoji-btn"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            title="Alterar emoji"
                        >
                            {document.emoji || "📄"}
                        </button>

                        {showEmojiPicker && (
                            <>
                                <div
                                    className="emoji-picker-overlay"
                                    onClick={() => setShowEmojiPicker(false)}
                                />
                                <div className="emoji-picker" style={{ top: 80, left: 32 }}>
                                    {EMOJIS.map((emoji) => (
                                        <button
                                            key={emoji}
                                            onClick={() => handleEmojiSelect(emoji)}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}

                        <input
                            ref={titleRef}
                            className="editor-title-input"
                            value={document.title || ""}
                            onChange={handleTitleChange}
                            placeholder="Sem título"
                        />
                    </div>

                    <div className="editor-meta">
                        <span style={{ fontSize: "0.75rem", color: "var(--text-faint)" }}>
                            Criado em{" "}
                            {new Date(document.createdAt).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                            })}
                        </span>
                    </div>

                    <BlockEditor
                        content={parsedContent}
                        onChange={handleContentChange}
                        autofocus
                    />
                </motion.div>
            </main>

            <ConfirmDialog
                open={showDeleteConfirm}
                title="Excluir documento"
                message="Tem certeza que deseja excluir este documento? Essa ação não pode ser desfeita."
                confirmText="Excluir"
                cancelText="Cancelar"
                variant="danger"
                onConfirm={async () => {
                    try {
                        await api.documents.delete(id);
                        router.push("/");
                    } catch (err) {
                        console.error("Erro ao deletar:", err);
                    } finally {
                        setShowDeleteConfirm(false);
                    }
                }}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </div>
    );
}

function extractText(content: JSONContent): string {
    let text = "";
    if (content.text) text += content.text;
    if (content.content) {
        for (const child of content.content) {
            text += extractText(child) + " ";
        }
    }
    return text;
}

function safeParseJSON(str: string): JSONContent | undefined {
    try {
        const parsed = JSON.parse(str);
        if (parsed && typeof parsed === "object") {
            return parsed;
        }
        return undefined;
    } catch {
        return undefined;
    }
}
