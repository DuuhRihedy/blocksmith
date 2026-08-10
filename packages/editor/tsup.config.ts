import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts", "src/styles/editor.css"],
    format: ["cjs", "esm"],
    dts: false,
    splitting: false,
    sourcemap: true,
    clean: true,
    external: ["react", "react-dom"],
    injectStyle: false,
    esbuildOptions(options) {
        options.jsx = "automatic";
    },
    loader: {
        ".css": "copy",
    },
});
