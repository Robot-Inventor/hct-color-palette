// @ts-nocheck

import "./style.css";

const base_color_input = document.getElementById("base_color");
const base_color_picker = document.getElementById("base_color_picker");
const base_color_preview = document.getElementById("base_color_preview");

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

const generate_button = document.getElementById("generate_button");
const palette_size_hue = document.getElementById("palette_size_hue");
const palette_size_tone = document.getElementById("palette_size_tone");

generate_button.addEventListener("click", () => {
    const base_color = base_color_input.value;
    const message = {
        type: "generate",
        base_color,
        palette_size_hue: palette_size_hue.value,
        palette_size_tone: palette_size_tone.value
    };
    parent.postMessage({ pluginMessage: message }, "*");
});

const palette_outer = document.getElementById("palette");
let palette = [];
const render_palette = (outer_element, palette) => {
    while (outer_element.firstChild) {
        outer_element.removeChild(outer_element.firstChild);
    }

    for (const row of palette) {
        const row_outer = document.createElement("div");
        row_outer.dataset.tone = row.tone.toString();

        for (const color of row.colors) {
            const div = document.createElement("div");
            div.style.background = color.hex;
            div.title = color.hex;
            div.dataset.hue = color.hue.toString();
            if (color.isBaseColor) {
                div.classList.add("base_color");
            }
            row_outer.appendChild(div);
        }

        outer_element.appendChild(row_outer);
    }
};

onmessage = (event) => {
    palette = event.data.pluginMessage;
    render_palette(palette_outer, palette);
};

const sort_button = document.getElementById("sort_button");

sort_button.addEventListener("click", () => {
    palette.sort((a, b) => {
        return parseFloat(b.tone) - parseFloat(a.tone);
    });

    for (let i = 0; i < palette.length; i++) {
        palette[i].colors.sort((a, b) => {
            return parseFloat(a.hue) - parseFloat(b.hue);
        });
    }

    render_palette(palette_outer, palette);
});

const insert_button = document.getElementById("insert_button");
insert_button.addEventListener("click", () => {
    parent.postMessage({ pluginMessage: { type: "insert", palette } }, "*");
});
