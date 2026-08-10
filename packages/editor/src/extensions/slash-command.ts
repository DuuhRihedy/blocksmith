import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";

export const slashCommand = Extension.create({
    name: "slashCommand",

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey("slashCommand"),
                props: {
                    handleKeyDown(_view, event) {
                        // The slash menu component handles everything via React state
                        // This plugin just ensures the "/" character is inserted normally
                        if (event.key === "/") {
                            return false;
                        }
                        return false;
                    },
                },
            }),
        ];
    },
});
