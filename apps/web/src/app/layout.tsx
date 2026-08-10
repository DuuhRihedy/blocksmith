import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Blocksmith — Block Editor",
    description:
        "Editor rich-text estilo Notion. Crie documentos bonitos com blocos arrastáveis, formatação rica e auto-save.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR">
            <body>{children}</body>
        </html>
    );
}
