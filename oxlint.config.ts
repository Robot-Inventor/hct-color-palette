import { defineConfig } from "oxlint";
import { oxlintConfigNoJSDoc } from "@robot-inventor/oxlint-config";

export default defineConfig({
    ...oxlintConfigNoJSDoc,
    rules: {
        "id-length": [
            "error",
            {
                properties: "never"
            }
        ]
    }
});
