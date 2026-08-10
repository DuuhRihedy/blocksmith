import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Typography from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { common, createLowlight } from "lowlight";
import type { JSONContent } from "@tiptap/core";

import { Toolbar } from "./Toolbar";
import { MenuBar } from "./MenuBar";
import { SlashMenu } from "./SlashMenu";
import { slashCommand } from "../extensions/slash-command";

const lowlight = createLowlight(common);

export interface BlockEditorProps {
    content?: JSONContent;
    onChange?: (content: JSONContent) => void;
    editable?: boolean;
    placeholder?: string;
    className?: string;
    autofocus?: boolean;
    showMenuBar?: boolean;
}

export function BlockEditor({
    content,
    onChange,
    editable = true,
    placeholder = "Digite '/' para comandos...",
    className = "",
    autofocus = false,
    showMenuBar = true,
}: BlockEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false,
                dropcursor: {
                    color: "#f59e0b",
                    width: 2,
                },
            }),
            Placeholder.configure({
                placeholder: ({ node }) => {
                    if (node.type.name === "heading") {
                        return `Heading ${node.attrs.level}`;
                    }
                    return placeholder;
                },
                showOnlyWhenEditable: true,
            }),
            Image.configure({
                allowBase64: true,
                HTMLAttributes: {
                    class: "blocksmith-image",
                },
            }),
            CodeBlockLowlight.configure({
                lowlight,
                HTMLAttributes: {
                    class: "blocksmith-code-block",
                },
            }),
            TaskList.configure({
                HTMLAttributes: {
                    class: "blocksmith-task-list",
                },
            }),
            TaskItem.configure({
                nested: true,
            }),
            Typography,
            TextStyle,
            Color,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "blocksmith-link",
                },
            }),
            slashCommand,
        ],
        content,
        editable,
        autofocus: autofocus ? "end" : false,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getJSON());
        },
        editorProps: {
            attributes: {
                class: `blocksmith-editor ${className}`.trim(),
            },
        },
    });

    if (!editor) return null;

    return (
        <div className="blocksmith-wrapper">
            {editable && showMenuBar && (
                <MenuBar editor={editor} />
            )}

            {editable && (
                <BubbleMenu
                    editor={editor}
                    tippyOptions={{ duration: 150, placement: "top" }}
                    className="blocksmith-bubble-menu"
                >
                    <Toolbar editor={editor} />
                </BubbleMenu>
            )}

            <SlashMenu editor={editor} />

            <EditorContent editor={editor} />
        </div>
    );
}
