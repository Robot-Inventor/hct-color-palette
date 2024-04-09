import { eslintConfigNoJSDoc } from "@robot-inventor/eslint-config";

export default [
    ...eslintConfigNoJSDoc,
    {
        rules: {
            "id-length": [
                "error",
                {
                    "properties": "never"
                }
            ]
        }
    }
];
