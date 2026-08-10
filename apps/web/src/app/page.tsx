"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, FileText, Trash2, Download, Upload } from "lucide-react";
import { api, backupAll, restoreAll, type DocumentSummary } from "@/lib/db";
import { Sidebar } from "@/components/Sidebar";
import { ConfirmDialog } from "@/components/ConfirmDialog";

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Agora mesmo";
    if (minutes < 60) return `${minutes}min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    if (days < 7) return `${days}d atrás`;

    return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: days > 365 ? "numeric" : undefined,
    });
}

export default function DashboardPage() {
    const router = useRouter();
    const [documents, setDocuments] = useState<DocumentSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const [backupStatus, setBackupStatus] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchDocuments = useCallback(async () => {
        try {
            const docs = await api.documents.list();
            setDocuments(docs);
        } catch (err) {
            console.error("Erro ao carregar documentos:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    const handleNewDocument = async () => {
        try {
            const doc = await api.documents.create();
            router.push(`/editor/${doc.id}`);
        } catch (err) {
            console.error("Erro ao criar documento:", err);
        }
    };

    const handleDeleteClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setDeleteTarget(id);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        try {
            await api.documents.delete(deleteTarget);
            setDocuments((prev) => prev.filter((d) => d.id !== deleteTarget));
        } catch (err) {
            console.error("Erro ao deletar:", err);
        } finally {
            setDeleteTarget(null);
        }
    };

    const handleBackup = async () => {
        try {
            setBackupStatus("Gerando backup...");
            await backupAll();
            setBackupStatus("Backup baixado!");
            setTimeout(() => setBackupStatus(null), 3000);
        } catch (err) {
            console.error("Erro no backup:", err);
            setBackupStatus("Erro ao gerar backup");
            setTimeout(() => setBackupStatus(null), 3000);
        }
    };

    const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setBackupStatus("Restaurando...");
            const result = await restoreAll(file);
            setBackupStatus(
                `${result.imported} importado(s), ${result.skipped} já existente(s)`
            );
            await fetchDocuments();
            setTimeout(() => setBackupStatus(null), 4000);
        } catch (err) {
            console.error("Erro na restauração:", err);
            setBackupStatus("Erro ao restaurar backup");
            setTimeout(() => setBackupStatus(null), 3000);
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <div className="app-container">
            <Sidebar
                documents={documents}
                onNewDocument={handleNewDocument}
            />

            <main className="main-content">
                <div className="dashboard">
                    <div className="dashboard-hero">
                        <div className="dashboard-hero-top">
                            <div>
                                <motion.h1
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    Seus documentos
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.1 }}
                                >
                                    Crie e edite documentos com formatação rica
                                </motion.p>
                            </div>
                            <motion.div
                                className="backup-actions"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                            >
                                <button
                                    className="btn-backup"
                                    onClick={handleBackup}
                                    title="Fazer backup de todos os documentos"
                                >
                                    <Download size={15} />
                                    Backup
                                </button>
                                <button
                                    className="btn-restore"
                                    onClick={() => fileInputRef.current?.click()}
                                    title="Restaurar documentos de um backup"
                                >
                                    <Upload size={15} />
                                    Restaurar
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".json"
                                    onChange={handleRestore}
                                    style={{ display: "none" }}
                                />
                                {backupStatus && (
                                    <span className="backup-status">{backupStatus}</span>
                                )}
                            </motion.div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading">
                            <div className="spinner" />
                            Carregando...
                        </div>
                    ) : documents.length === 0 ? (
                        <motion.div
                            className="empty-state"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="empty-state-icon">📝</div>
                            <h2>Nenhum documento ainda</h2>
                            <p>
                                Crie seu primeiro documento e comece a escrever com blocos,
                                formatação rica e muito mais.
                            </p>
                            <button className="btn-new-doc" onClick={handleNewDocument}>
                                <Plus size={18} />
                                Novo Documento
                            </button>
                        </motion.div>
                    ) : (
                        <div className="dashboard-grid">
                            <AnimatePresence mode="popLayout">
                                {documents.map((doc, index) => (
                                    <motion.div
                                        key={doc.id}
                                        className="doc-card"
                                        onClick={() => router.push(`/editor/${doc.id}`)}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        layout
                                    >
                                        <div className="doc-card-actions">
                                            <button
                                                className="btn-delete"
                                                onClick={(e) => handleDeleteClick(e, doc.id)}
                                                title="Excluir documento"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                        <div className="doc-card-emoji">
                                            {doc.emoji || "📄"}
                                        </div>
                                        <div className="doc-card-title">
                                            {doc.title || "Sem título"}
                                        </div>
                                        <div className="doc-card-date">
                                            {formatDate(doc.updatedAt)}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                <ConfirmDialog
                    open={deleteTarget !== null}
                    title="Excluir documento"
                    message="Tem certeza que deseja excluir este documento? Essa ação não pode ser desfeita."
                    confirmText="Excluir"
                    cancelText="Cancelar"
                    variant="danger"
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteTarget(null)}
                />
            </main>
        </div>
    );
}
