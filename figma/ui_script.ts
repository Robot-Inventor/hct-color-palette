import { render_palette, sort_palette } from "../common/palette";
import "../common/side_effect";
import "../common/style.css";

const post_message = (message: message) => {
    parent.postMessage({ pluginMessage: message }, "*");
};

const validate_form = () => {
    return base_color_input.checkValidity() && palette_size_hue.checkValidity() && palette_size_tone.checkValidity();
};

const base_color_input: HTMLInputElement = document.querySelector("#base_color")!;
const base_color_picker: HTMLInputElement = document.querySelector("#base_color_picker")!;
const base_color_preview: HTMLInputElement = document.querySelector("#base_color_preview")!;

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

const generate_button = document.getElementById("generate_button")!;
const palette_size_hue: HTMLInputElement = document.querySelector("#palette_size_hue")!;
const palette_size_tone: HTMLInputElement = document.querySelector("#palette_size_tone")!;

generate_button.addEventListener("click", () => {
    if (!validate_form()) {
        const message = {
            type: "notify",
            message: "Parameters are invalid. Please check the form.",
            option: {
                error: true,
                timeout: 5000
            }
        } as const;
        post_message(message);
        return;
    }

    const base_color = base_color_input.value;
    const message = {
        type: "generate",
        base_color,
        palette_size_hue: parseInt(palette_size_hue.value),
        palette_size_tone: parseInt(palette_size_tone.value)
    } as const;
    post_message(message);
});

const palette_outer = document.getElementById("palette")!;
let palette: palette = [];

onmessage = (event) => {
    palette = event.data.pluginMessage;
    render_palette(palette_outer, palette);
};

const sort_button = document.getElementById("sort_button")!;

sort_button.addEventListener("click", () => {
    palette = sort_palette(palette);
    render_palette(palette_outer, palette);
});

const insert_button = document.getElementById("action_button")!;
insert_button.textContent = "Insert to Figma";
insert_button.addEventListener("click", () => {
    post_message({ type: "insert", palette });
});
