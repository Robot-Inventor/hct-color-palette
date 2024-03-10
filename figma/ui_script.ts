import "../common/side_effect";
import "../common/style.css";
import { renderPalette, sortPalette } from "../common/palette";

const baseColorInput: HTMLInputElement = document.querySelector("#base_color")!;
const baseColorPicker: HTMLInputElement = document.querySelector("#base_color_picker")!;
const baseColorPreview: HTMLInputElement = document.querySelector("#base_color_preview")!;
const generateButton = document.getElementById("generate_button")!;
const hueSizeInput: HTMLInputElement = document.querySelector("#palette_size_hue")!;
const toneSizeInput: HTMLInputElement = document.querySelector("#palette_size_tone")!;
const paletteOuter = document.getElementById("palette")!;
const sortButton = document.getElementById("sort_button")!;
const insertButton = document.getElementById("action_button")!;

let palette: palette = [];

insertButton.textContent = "Insert to Figma";

/**
 * Send message to the backend script.
 * @param message Message to be sent.
 */
const postMessage = (message: message): void => {
    parent.postMessage({ pluginMessage: message }, "*");
};

/**
 * Check all form values are valid.
 * @returns Validation result.
 */
const validateForm = (): boolean =>
    baseColorInput.checkValidity() && hueSizeInput.checkValidity() && toneSizeInput.checkValidity();

baseColorInput.addEventListener("input", () => {
    baseColorPreview.style.background = baseColorInput.value;
});

baseColorPreview.addEventListener("click", () => {
    baseColorPicker.click();
});

baseColorPicker.addEventListener("input", () => {
    baseColorInput.value = baseColorPicker.value;
    baseColorPreview.style.background = baseColorPicker.value;
});

generateButton.addEventListener("click", () => {
    if (!validateForm()) {
        const message: message = {
            message: "Parameters are invalid. Please check the form.",
            option: {
                error: true,
                timeout: 5000
            },
            type: "notify"
        } as const;
        postMessage(message);
        return;
    }

    const baseColor = baseColorInput.value;
    const message = {
        baseColor,
        hueSize: parseInt(hueSizeInput.value, 10),
        toneSize: parseInt(toneSizeInput.value, 10),
        type: "generate"
    } as const;
    postMessage(message);
});

onmessage = (event): void => {
    palette = event.data.pluginMessage;
    renderPalette(paletteOuter, palette);
};

sortButton.addEventListener("click", () => {
    palette = sortPalette(palette);
    renderPalette(paletteOuter, palette);
});

insertButton.addEventListener("click", () => {
    postMessage({ palette, type: "insert" });
});
