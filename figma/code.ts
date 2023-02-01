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

figma.showUI(__html__, { width: 800, height: 600, themeColors: true });

figma.ui.onmessage = (msg) => {
    if (msg.type === "generate") {
        const palette = generate_palette(msg.base_color, msg.palette_size_hue, msg.palette_size_tone);
        figma.ui.postMessage(palette);
    }

    if (msg.type === "insert") {
        const rect_size = 100;
        const rect_margin = 25;
        const rect_corner_radius = 10;

        const nodes: SceneNode[] = [];

        const frame = figma.createFrame();
        const frame_width = (rect_size + rect_margin) * msg.palette[0].colors.length + rect_margin;
        const frame_height = (rect_size + rect_margin) * msg.palette.length + rect_margin;
        frame.resize(frame_width, frame_height);
        frame.name = "Easy Palette";
        figma.currentPage.appendChild(frame);
        nodes.push(frame);

        let x = rect_margin;
        let y = rect_margin;

        for (const row of msg.palette) {
            x = rect_margin;

            for (const color of row.colors) {
                const hex = color.hex;
                const r = parseInt(hex.substring(1, 3), 16) / 255;
                const g = parseInt(hex.substring(3, 5), 16) / 255;
                const b = parseInt(hex.substring(5), 16) / 255;

                const rect = figma.createRectangle();
                rect.x = x;
                rect.y = y;
                rect.resize(rect_size, rect_size);
                rect.name = hex;
                rect.cornerRadius = rect_corner_radius;
                rect.fills = [{ type: "SOLID", color: { r, g, b } }];

                if (color.isBaseColor) {
                    const border_rect = figma.createRectangle();
                    border_rect.x = x;
                    border_rect.y = y;
                    border_rect.cornerRadius = rect_corner_radius;
                    border_rect.resize(rect_size, rect_size);
                    rect.resize(rect_size * 0.9, rect_size * 0.9);
                    rect.x += rect_size * 0.05;
                    rect.y += rect_size * 0.05;
                    border_rect.name = "Base Color Pointer";
                    border_rect.fills = [];
                    border_rect.strokes = [{ type: "SOLID", color: { r, g, b } }];
                    border_rect.strokeAlign = "OUTSIDE";
                    border_rect.strokeWeight = rect_size * 0.08;
                    frame.appendChild(border_rect);
                }

                frame.appendChild(rect);

                x += rect_size + rect_margin;
            }

            y += rect_size + rect_margin;
        }

        figma.currentPage.selection = nodes;
        figma.viewport.scrollAndZoomIntoView(nodes);
    }
};
