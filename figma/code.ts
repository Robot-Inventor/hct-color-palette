import { generate_palette } from "../common/palette";

figma.showUI(__html__, { width: 800, height: 600, themeColors: true });

figma.ui.onmessage = (msg: message) => {
    switch (msg.type) {
        case "generate":
            const palette = generate_palette(msg.base_color, msg.palette_size_hue, msg.palette_size_tone);
            figma.ui.postMessage(palette);
            break;

        case "insert":
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
            break;

        case "notify":
            figma.notify(msg.message, msg.option);
            break;

        default:
            console.error("Unknown message type sent by UI.");
            break;
    }
};
