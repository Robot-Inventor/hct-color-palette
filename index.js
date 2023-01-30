import { argbFromHex, hexFromArgb, Hct } from "@material/material-color-utilities";
import { toPng } from "html-to-image";

// HCTのトーンはL*a*bの明るさ。HCTの色相と彩度はCAM16の色相と彩度と同じ。

const generate_palette = (base_color, palette_size) => {
    const hue_step = 360 / palette_size;
    const color = Hct.fromInt(argbFromHex(base_color));
    const palette = [];

    palette.push(hexFromArgb(color.toInt()));
    for (let i = 0; i < palette_size - 1; i++) {
        if (color.hue + hue_step <= 360) {
            color.hue += hue_step;
        } else {
            color.hue += hue_step - 360;
        }
        palette.push(hexFromArgb(color.toInt()));
    }

    return palette;
};

const generate_button = document.getElementById("generate_button");
const base_color_element = document.getElementById("base_color");
const palette_size_element = document.getElementById("palette_size");
const palette_element = document.getElementById("palette");
const download_button = document.getElementById("download_button");

generate_button.addEventListener("click", () => {
    const base_color = base_color_element.value;
    const palette_size = palette_size_element.value;
    const palette = generate_palette(base_color, palette_size);

    while (palette_element.firstChild) {
        palette_element.removeChild(palette_element.firstChild);
    }

    for (const color of palette) {
        const div = document.createElement("div");
        div.style.background = color;
        div.addEventListener("click", () => {
            navigator.clipboard.writeText(color);
        });
        palette_element.appendChild(div);
    }
});

download_button.addEventListener("click", () => {
    const a = document.createElement("a");
    a.download = "color_palette.png";

    toPng(palette_element).then((data) => {
        a.href = data;
        a.click();
    });
});
