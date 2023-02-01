import { argbFromHex, hexFromArgb, Hct } from "@material/material-color-utilities";

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
            hue: hue,
            isBaseColor: false
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
                hue: hue,
                isBaseColor: false
            };
        });
        palette.push({
            tone: tone,
            colors: row
        });
    }

    // Error correction of base_color
    palette[0].colors[0].hex = base_color.toLowerCase();
    palette[0].colors[0].isBaseColor = true;

    return palette;
};

export { generate_palette };
