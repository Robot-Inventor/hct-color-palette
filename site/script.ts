import { toPng } from "html-to-image";
import { generatePalette, renderPalette, sortPalette } from "../common/palette";
import "../common/side_effect";
import "../common/style.css";

const generateButton = document.querySelector("#generate_button")!;
const sortButton = document.querySelector("#sort_button")!;
const baseColorInput: HTMLInputElement = document.querySelector("#base_color")!;
const baseColorPicker: HTMLInputElement = document.querySelector("#base_color_picker")!;
const baseColorPreview: HTMLInputElement = document.querySelector("#base_color_preview")!;
const hueSizeInput: HTMLInputElement = document.querySelector("#palette_size_hue")!;
const toneSizeInput: HTMLInputElement = document.querySelector("#palette_size_tone")!;
const paletteOuter: HTMLElement = document.querySelector("#palette")!;
const downloadButton = document.querySelector("#action_button")!;

let palette: palette = [];

downloadButton.textContent = "Download as PNG";

const validateForm = () => {
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
    if (!validateForm()) {
        const errorMessage = "Parameters are invalid. Please check the form.";
        console.error(errorMessage);
        alert(errorMessage);
        return;
    }

    const baseColor = baseColorInput.value;
    const hueSize = parseInt(hueSizeInput.value);
    const toneSize = parseInt(toneSizeInput.value);
    palette = generatePalette(baseColor, hueSize, toneSize);
    renderPalette(paletteOuter, palette);
});

sortButton.addEventListener("click", () => {
    palette = sortPalette(palette);
    renderPalette(paletteOuter, palette);
});

downloadButton.addEventListener("click", () => {
    const a = document.createElement("a");
    a.download = "color_palette.png";

    toPng(paletteOuter).then((data) => {
        a.href = data;
        a.click();
    });
});
