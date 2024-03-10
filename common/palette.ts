import { Hct, argbFromHex, hexFromArgb } from "@material/material-color-utilities";

/**
 * Generate palette data from base color using [HCT color space](https://material.io/blog/science-of-color-design).
 * @param baseColor Base color of palette in hex (``#rgb`` or ``#rrggbb``) format.
 * @param hueSize Palette size of hue. Hue of the color palette changes by ``360 / hueSize``.
 * @param toneSize Palette size of tone. Tone of the color palette changes by ``100 / toneSize``
 * @returns Palette data.
 * @example
 * // Generate a color palette with #75a3dd as the base color, 20 hues and 5 tones.
 * const palette = generatePalette("#75a3dd", 20, 5);
 */
// eslint-disable-next-line max-lines-per-function, max-statements
const generatePalette = (baseColor: string, hueSize: number, toneSize: number): Palette => {
    /* eslint-disable no-magic-numbers */
    const hueStep = 360 / hueSize;
    const toneStep = 100 / toneSize;
    /* eslint-enable no-magic-numbers */

    const color = Hct.fromInt(argbFromHex(baseColor));
    const baseChroma = color.chroma;
    const baseTone = color.tone;

    const hueList: Array<number> = [];
    const palette: Palette = [];

    // Generate a list of hue values
    hueList.push(color.hue);
    /* eslint-disable no-magic-numbers */
    // eslint-disable-next-line id-length
    for (let i = 0; i < hueSize - 1; i++) {
        if (color.hue + hueStep <= 360) {
            color.hue += hueStep;
        } else {
            color.hue += hueStep - 360;
        }
        hueList.push(color.hue);
    }
    /* eslint-enable no-magic-numbers */

    const row = hueList.map((hue) => {
        color.hue = hue;
        color.chroma = baseChroma;
        color.tone = baseTone;
        return {
            hex: hexFromArgb(color.toInt()),
            hue,
            isBaseColor: false
        };
    });
    palette.push({
        colors: row,
        tone: baseTone
    });
    /* eslint-disable no-magic-numbers */
    // eslint-disable-next-line id-length
    for (let i = 0; i < toneSize - 1; i++) {
        if (color.tone + toneStep <= 100) {
            color.tone += toneStep;
        } else {
            color.tone += toneStep - 100;
        }
        /* eslint-enable no-magic-numbers */

        const { tone } = color;

        // eslint-disable-next-line no-shadow
        const row = hueList.map((hue) => {
            // If chroma and tone are not re-set, their values will shift slightly
            color.hue = hue;
            color.chroma = baseChroma;
            color.tone = tone;

            return {
                hex: hexFromArgb(color.toInt()),
                hue,
                isBaseColor: false
            };
        });
        palette.push({
            colors: row,
            tone
        });
    }

    // Error correction of base_color
    palette[0].colors[0].hex = baseColor.toLowerCase();
    palette[0].colors[0].isBaseColor = true;

    return palette;
};

/**
 * Insert palette to specified HTML element.
 * @param outer Insert palette to this element.
 * @param palette Palette data.
 */
// eslint-disable-next-line max-statements
const renderPalette = (outer: HTMLElement, palette: Palette): void => {
    // Remove old palette from the element.
    while (outer.firstChild) {
        outer.removeChild(outer.firstChild);
    }

    const fragment = document.createDocumentFragment();

    for (const row of palette) {
        const rowOuter = document.createElement("div");
        fragment.appendChild(rowOuter);

        for (const color of row.colors) {
            const div = document.createElement("div");
            div.style.background = color.hex;
            div.title = color.hex;
            if (color.isBaseColor) {
                div.classList.add("base_color");
            }
            rowOuter.appendChild(div);
        }
    }

    outer.appendChild(fragment);
};

/**
 * Sort palette data with hue value and tone value.
 * @param palette Palette data.
 * @returns Sorted palette data.
 */
const sortPalette = (palette: Palette): Palette => {
    // eslint-disable-next-line id-length
    palette.sort((a, b) => parseFloat(b.tone.toString()) - parseFloat(a.tone.toString()));

    // eslint-disable-next-line id-length
    for (let i = 0; i < palette.length; i++) {
        // eslint-disable-next-line id-length
        palette[i].colors.sort((a, b) => parseFloat(a.hue.toString()) - parseFloat(b.hue.toString()));
    }

    return palette;
};

export { generatePalette, renderPalette, sortPalette };
