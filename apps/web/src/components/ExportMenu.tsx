"use client";

import { useState, useRef, useEffect } from "react";
import { Download, FileText, FileDown } from "lucide-react";

interface ExportMenuProps {
    onExportPDF: () => void;
    onExportDOCX: () => void;
}

export function ExportMenu({
    onExportPDF,
    onExportDOCX,
}: ExportMenuProps) {
    const [open, setOpen] = useState(false);
    const [exporting, setExporting] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    const handleExport = async (type: string, fn: () => void) => {
        setExporting(type);
        try {
            await fn();
        } catch (err) {
            console.error(`Erro ao exportar ${type}:`, err);
        } finally {
            setExporting(null);
            setOpen(false);
        }
    };

    return (
        <div className="export-menu-wrapper" ref={menuRef}>
            <button
                className="btn-delete"
                onClick={() => setOpen(!open)}
                title="Exportar documento"
                style={{ width: 34, height: 34 }}
            >
                <Download size={16} />
            </button>

            {open && (
                <div className="export-dropdown">
                    <button
                        className="export-item"
                        onClick={() => handleExport("pdf", onExportPDF)}
                        disabled={exporting !== null}
                    >
                        <FileText size={16} />
                        <div className="export-item-text">
                            <span className="export-item-label">
                                {exporting === "pdf" ? "Exportando..." : "PDF"}
                            </span>
                            <span className="export-item-desc">
                                Documento formatado para impressão
                            </span>
                        </div>
                    </button>

                    <button
                        className="export-item"
                        onClick={() => handleExport("docx", onExportDOCX)}
                        disabled={exporting !== null}
                    >
                        <FileDown size={16} />
                        <div className="export-item-text">
                            <span className="export-item-label">
                                {exporting === "docx" ? "Exportando..." : "DOCX"}
                            </span>
                            <span className="export-item-desc">
                                Compatível com Word e Google Docs
                            </span>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
}
