import { argbFromHex, hexFromArgb, Hct } from "@material/material-color-utilities";
import { toPng } from "html-to-image";

// HCTのトーンはL*a*bの明るさ。HCTの色相と彩度はCAM16の色相と彩度と同じ。

const generate_palette = (base_color: string, palette_size_hue: number, palette_size_tone: number) => {
    const hue_step = 360 / palette_size_hue;
    const tone_step = 100 / palette_size_tone;
    const color = Hct.fromInt(argbFromHex(base_color));
    const base_chroma = color.chroma;
    const base_tone = color.tone;
    const hue_list = [];
    const palette = [];

    // Generate a list of hue values
    hue_list.push(color.hue);
    for (let i = 0; i < palette_size_hue - 1; i++) {
        if (color.hue + hue_step <= 360) {
            color.hue += hue_step;
        } else {
            color.hue += hue_step - 360;
        }
        hue_list.push(color.hue);
    }

    const row = hue_list.map((hue) => {
        color.hue = hue;
        color.chroma = base_chroma;
        color.tone = base_tone;
        return {
            hex: hexFromArgb(color.toInt()),
            hue: hue
        };
    });
    palette.push({
        tone: base_tone,
        colors: row
    });
    for (let i = 0; i < palette_size_tone - 1; i++) {
        if (color.tone + tone_step <= 100) {
            color.tone += tone_step;
        } else {
            color.tone += tone_step - 100;
        }

        const tone = color.tone;

        const row = hue_list.map((hue) => {
            // If chroma and tone are not re-set, their values will shift slightly
            color.hue = hue;
            color.chroma = base_chroma;
            color.tone = tone;

            return {
                hex: hexFromArgb(color.toInt()),
                hue: hue
            };
        });
        palette.push({
            tone: tone,
            colors: row
        });
    }

    // Error correction of base_color
    palette[0].colors[0].hex = base_color.toLowerCase();

    return palette;
};

const generate_button = document.querySelector("#generate_button")!;
const sort_button = document.querySelector("#sort_button")!;
const base_color_element: HTMLInputElement = document.querySelector("#base_color")!;
const palette_size_hue_element: HTMLInputElement = document.querySelector("#palette_size_hue")!;
const palette_size_tone_element: HTMLInputElement = document.querySelector("#palette_size_tone")!;
const palette_element: HTMLElement = document.querySelector("#palette")!;
const download_button = document.querySelector("#download_button")!;

generate_button.addEventListener("click", () => {
    const base_color = base_color_element.value;
    const palette_size_hue = parseInt(palette_size_hue_element.value);
    const palette_size_tone = parseInt(palette_size_tone_element.value);
    const palette = generate_palette(base_color, palette_size_hue, palette_size_tone);

    // Delete old palette
    while (palette_element.firstChild) {
        palette_element.removeChild(palette_element.firstChild);
    }

    for (const row of palette) {
        const row_outer = document.createElement("div");
        row_outer.dataset.tone = row.tone.toString();

        for (const color of row.colors) {
            const div = document.createElement("div");
            div.style.background = color.hex;
            div.title = color.hex;
            div.dataset.hue = color.hue.toString();
            div.addEventListener("click", () => {
                navigator.clipboard.writeText(color.hex);
            });
            row_outer.appendChild(div);
        }

        palette_element.appendChild(row_outer);
    }

    palette_element.querySelector("[data-hue]")!.classList.add("base_color");
});

sort_button.addEventListener("click", () => {
    const row_list = [...palette_element.children] as Array<HTMLElement>;
    row_list.sort((a, b) => {
        return parseFloat(b.dataset.tone || "0") - parseFloat(a.dataset.tone || "0");
    });

    for (const row of row_list) {
        const children = [...row.children] as Array<HTMLElement>;
        children.sort((a, b) => {
            return parseFloat(a.dataset.hue || "0") - parseFloat(b.dataset.hue || "0");
        });
        for (const child of children) {
            row.appendChild(child);
        }

        palette_element.appendChild(row);
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
