import "../common/side_effect";
import "../common/style.css";
import { Message, MessageGenerate } from "../types/figma";
import { Palette } from "../common/palette";
import { Renderer } from "../common/renderer";

const baseColorInput: HTMLInputElement = document.querySelector("#base_color")!;
const baseColorPicker: HTMLInputElement = document.querySelector("#base_color_picker")!;
const baseColorPreview: HTMLInputElement = document.querySelector("#base_color_preview")!;
const generateButton = document.getElementById("generate_button")!;
const hueSizeInput: HTMLInputElement = document.querySelector("#palette_size_hue")!;
const toneSizeInput: HTMLInputElement = document.querySelector("#palette_size_tone")!;
const paletteOuter = document.getElementById("palette")!;
const sortButton = document.getElementById("sort_button")!;
const insertButton = document.getElementById("action_button")!;

const palette = new Palette();
const renderer = new Renderer(paletteOuter);

insertButton.textContent = "Insert to Figma";

/**
 * Send message to the backend script.
 * @param message Message to be sent.
 */
const postMessage = (message: Message): void => {
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
        const message: Message = {
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

window.addEventListener("message", (event: MessageEvent<{ pluginMessage: MessageGenerate }>) => {
    const { baseColor, hueSize, toneSize } = event.data.pluginMessage;
    const paletteData = palette.generate(baseColor, hueSize, toneSize);
    renderer.renderPalette(paletteData);
});

sortButton.addEventListener("click", () => {
    const paletteData = palette.sortPalette();
    renderer.renderPalette(paletteData);
});

insertButton.addEventListener("click", () => {
    const paletteData = palette.getPalette();
    if (!paletteData) throw new Error("Palette data is not generated.");
    postMessage({ palette: paletteData, type: "insert" });
});
