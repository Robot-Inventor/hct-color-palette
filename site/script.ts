import { toPng } from "html-to-image";
import { generate_palette, render_palette, sort_palette } from "../common/palette";
import "../common/side_effect";
import "../common/style.css";

// HCTのトーンはL*a*bの明るさ。HCTの色相と彩度はCAM16の色相と彩度と同じ。

const generate_button = document.querySelector("#generate_button")!;
const sort_button = document.querySelector("#sort_button")!;
const base_color_input: HTMLInputElement = document.querySelector("#base_color")!;
const base_color_picker: HTMLInputElement = document.querySelector("#base_color_picker")!;
const base_color_preview: HTMLInputElement = document.querySelector("#base_color_preview")!;
const palette_size_hue_element: HTMLInputElement = document.querySelector("#palette_size_hue")!;
const palette_size_tone_element: HTMLInputElement = document.querySelector("#palette_size_tone")!;
const palette_element: HTMLElement = document.querySelector("#palette")!;
const download_button = document.querySelector("#action_button")!;

let palette: palette = [];

const validate_form = () => {
    return (
        base_color_input.checkValidity() &&
        palette_size_hue_element.checkValidity() &&
        palette_size_tone_element.checkValidity()
    );
};

base_color_input.addEventListener("input", () => {
    base_color_preview.style.background = base_color_input.value;
});

base_color_preview.addEventListener("click", () => {
    base_color_picker.click();
});

base_color_picker.addEventListener("input", () => {
    base_color_input.value = base_color_picker.value;
    base_color_preview.style.background = base_color_picker.value;
});

generate_button.addEventListener("click", () => {
    if (!validate_form()) {
        const error_message = "Parameters are invalid. Please check the form.";
        console.error(error_message);
        alert(error_message);
        return;
    }

    const base_color = base_color_input.value;
    const palette_size_hue = parseInt(palette_size_hue_element.value);
    const palette_size_tone = parseInt(palette_size_tone_element.value);
    palette = generate_palette(base_color, palette_size_hue, palette_size_tone);
    render_palette(palette_element, palette);
});

sort_button.addEventListener("click", () => {
    palette = sort_palette(palette);
    render_palette(palette_element, palette);
});

download_button.textContent = "Download as PNG";
download_button.addEventListener("click", () => {
    const a = document.createElement("a");
    a.download = "color_palette.png";

    toPng(palette_element).then((data) => {
        a.href = data;
        a.click();
    });
});
