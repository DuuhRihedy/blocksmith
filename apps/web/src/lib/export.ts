import {
    Document as DocxDocument,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    AlignmentType,
} from "docx";

async function getSaveAs() {
    const mod = await import("file-saver");
    return mod.default?.saveAs || mod.saveAs || mod.default;
}

interface JSONContent {
    type?: string;
    attrs?: Record<string, unknown>;
    content?: JSONContent[];
    marks?: { type: string; attrs?: Record<string, unknown> }[];
    text?: string;
}

function extractTextFromNode(node: JSONContent): string {
    let text = "";
    if (node.text) text += node.text;
    if (node.content) {
        for (const child of node.content) {
            text += extractTextFromNode(child);
        }
    }
    return text;
}

function contentToDocxParagraphs(content: JSONContent): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    if (!content.content) return paragraphs;

    for (const block of content.content) {
        const type = block.type || "paragraph";

        if (type === "heading") {
            const level = (block.attrs?.level as number) || 1;
            const headingMap: Record<number, (typeof HeadingLevel)[keyof typeof HeadingLevel]> = {
                1: HeadingLevel.HEADING_1,
                2: HeadingLevel.HEADING_2,
                3: HeadingLevel.HEADING_3,
                4: HeadingLevel.HEADING_4,
                5: HeadingLevel.HEADING_5,
                6: HeadingLevel.HEADING_6,
            };

            paragraphs.push(
                new Paragraph({
                    heading: headingMap[level] || HeadingLevel.HEADING_1,
                    children: buildTextRuns(block),
                })
            );
        } else if (type === "bulletList" || type === "orderedList") {
            const items = block.content || [];
            items.forEach((item, index) => {
                const itemContent = item.content || [];
                for (const p of itemContent) {
                    paragraphs.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `${type === "orderedList" ? `${index + 1}. ` : "• "}${extractTextFromNode(p)}`,
                                }),
                            ],
                            indent: { left: 720 },
                        })
                    );
                }
            });
        } else if (type === "codeBlock") {
            const text = extractTextFromNode(block);
            paragraphs.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text,
                            font: "Courier New",
                            size: 20,
                        }),
                    ],
                    spacing: { before: 120, after: 120 },
                })
            );
        } else if (type === "blockquote") {
            const items = block.content || [];
            for (const p of items) {
                paragraphs.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: extractTextFromNode(p),
                                italics: true,
                            }),
                        ],
                        indent: { left: 720 },
                        spacing: { before: 120, after: 120 },
                    })
                );
            }
        } else if (type === "taskList") {
            const items = block.content || [];
            for (const item of items) {
                const checked = item.attrs?.checked ? "☑" : "☐";
                paragraphs.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `${checked} ${extractTextFromNode(item)}`,
                            }),
                        ],
                        indent: { left: 720 },
                    })
                );
            }
        } else if (type === "horizontalRule") {
            paragraphs.push(
                new Paragraph({
                    children: [new TextRun({ text: "———————————————————" })],
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 200, after: 200 },
                })
            );
        } else {
            paragraphs.push(
                new Paragraph({
                    children: buildTextRuns(block),
                })
            );
        }
    }

    return paragraphs;
}

function buildTextRuns(node: JSONContent): TextRun[] {
    const runs: TextRun[] = [];

    if (!node.content) {
        if (node.text) {
            runs.push(new TextRun({ text: node.text }));
        }
        return runs;
    }

    for (const child of node.content) {
        if (child.text) {
            const marks = child.marks || [];
            runs.push(
                new TextRun({
                    text: child.text,
                    bold: marks.some((m) => m.type === "bold"),
                    italics: marks.some((m) => m.type === "italic"),
                    strike: marks.some((m) => m.type === "strike"),
                    font: marks.some((m) => m.type === "code")
                        ? "Courier New"
                        : undefined,
                })
            );
        } else if (child.content) {
            runs.push(...buildTextRuns(child));
        }
    }

    return runs;
}

export async function exportToPDF(title: string): Promise<void> {
    const html2pdf = (await import("html2pdf.js")).default;

    const editorEl = document.querySelector(".blocksmith-editor");
    if (!editorEl) throw new Error("Editor element not found");

    const clone = editorEl.cloneNode(true) as HTMLElement;

    const wrapper = document.createElement("div");
    wrapper.style.cssText = `
        padding: 40px;
        font-family: 'Inter', -apple-system, sans-serif;
        color: #1a1a1a;
        background: #ffffff;
        line-height: 1.7;
        max-width: 800px;
    `;

    const titleEl = document.createElement("h1");
    titleEl.textContent = title || "Sem título";
    titleEl.style.cssText = `
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 24px;
        padding-bottom: 12px;
        border-bottom: 2px solid #e5e5e5;
        color: #111;
    `;

    clone.style.color = "#1a1a1a";
    clone.querySelectorAll("*").forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.color = "#1a1a1a";
    });

    wrapper.appendChild(titleEl);
    wrapper.appendChild(clone);

    const opt = {
        margin: [10, 15, 10, 15] as [number, number, number, number],
        filename: `${sanitizeFilename(title)}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm" as const, format: "a4" as const, orientation: "portrait" as const },
    };

    await html2pdf().set(opt).from(wrapper).save();
}

export async function exportToDOCX(
    title: string,
    content: JSONContent
): Promise<void> {
    const saveAs = await getSaveAs();
    const paragraphs = contentToDocxParagraphs(content);

    const doc = new DocxDocument({
        sections: [
            {
                properties: {},
                children: [
                    new Paragraph({
                        heading: HeadingLevel.TITLE,
                        children: [
                            new TextRun({
                                text: title || "Sem título",
                                bold: true,
                                size: 56,
                            }),
                        ],
                        spacing: { after: 300 },
                    }),
                    ...paragraphs,
                ],
            },
        ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${sanitizeFilename(title)}.docx`);
}

function sanitizeFilename(name: string): string {
    return (name || "documento")
        .replace(/[^a-zA-Z0-9À-ú\s-_]/g, "")
        .replace(/\s+/g, "_")
        .substring(0, 50);
}
