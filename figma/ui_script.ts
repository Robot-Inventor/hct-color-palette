import { renderPalette, sortPalette } from "../common/palette";
import "../common/side_effect";
import "../common/style.css";

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
const postMessage = (message: message) => {
    parent.postMessage({ pluginMessage: message }, "*");
};

/**
 * Check all form values are valid.
 * @returns Validation result.
 */
const validate_form = () => {
    return baseColorInput.checkValidity() && hueSizeInput.checkValidity() && toneSizeInput.checkValidity();
};

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
    if (!validate_form()) {
        const message: message = {
            type: "notify",
            message: "Parameters are invalid. Please check the form.",
            option: {
                error: true,
                timeout: 5000
            }
        } as const;
        postMessage(message);
        return;
    }

    const baseColor = baseColorInput.value;
    const message = {
        type: "generate",
        baseColor: baseColor,
        hueSize: parseInt(hueSizeInput.value),
        toneSize: parseInt(toneSizeInput.value)
    } as const;
    postMessage(message);
});

onmessage = (event) => {
    palette = event.data.pluginMessage;
    renderPalette(paletteOuter, palette);
};

sortButton.addEventListener("click", () => {
    palette = sortPalette(palette);
    renderPalette(paletteOuter, palette);
});

insertButton.addEventListener("click", () => {
    postMessage({ type: "insert", palette });
});
