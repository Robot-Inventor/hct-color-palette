import "../common/side_effect";
import "../common/style.css";
import { Palette } from "../common/palette";
import { Renderer } from "../common/renderer";
import { toPng } from "html-to-image";

const generateButton = document.querySelector("#generate_button")!;
const sortButton = document.querySelector("#sort_button")!;
const baseColorInput: HTMLInputElement = document.querySelector("#base_color")!;
const baseColorPicker: HTMLInputElement = document.querySelector("#base_color_picker")!;
const baseColorPreview: HTMLInputElement = document.querySelector("#base_color_preview")!;
const hueSizeInput: HTMLInputElement = document.querySelector("#palette_size_hue")!;
const toneSizeInput: HTMLInputElement = document.querySelector("#palette_size_tone")!;
const paletteOuter: HTMLElement = document.querySelector("#palette")!;
const downloadButton = document.querySelector("#action_button")!;

const palette = new Palette();
const renderer = new Renderer(paletteOuter);

downloadButton.textContent = "Download as PNG";

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
        const errorMessage = "Parameters are invalid. Please check the form.";
        // eslint-disable-next-line no-console
        console.error(errorMessage);
        // eslint-disable-next-line no-alert
        alert(errorMessage);
        return;
    }

    const baseColor = baseColorInput.value;
    const hueSize = parseInt(hueSizeInput.value, 10);
    const toneSize = parseInt(toneSizeInput.value, 10);
    const paletteData = palette.generate(baseColor, hueSize, toneSize);
    renderer.renderPalette(paletteData);
});

sortButton.addEventListener("click", () => {
    const paletteData = palette.sortPalette();
    renderer.renderPalette(paletteData);
});

downloadButton.addEventListener("click", () => {
    const anchor = document.createElement("a");
    anchor.download = "color_palette.png";

    void toPng(paletteOuter).then((data) => {
        anchor.href = data;
        anchor.click();
    });
});
