import { generatePalette } from "../common/palette";

figma.showUI(__html__, { width: 800, height: 600, themeColors: true });

figma.ui.onmessage = (msg: message) => {
    switch (msg.type) {
        case "generate":
            const palette = generatePalette(msg.baseColor, msg.hueSize, msg.toneSize);
            figma.ui.postMessage(palette);
            break;

        case "insert":
            const RECT_SIZE = 100;
            const RECT_MARGIN = 25;
            const RECT_CORNER_RADIUS = 10;

            const nodeList: SceneNode[] = [];

            /**
             * Frame for outer of palette.
             */
            const frame = figma.createFrame();
            const frameWidth = (RECT_SIZE + RECT_MARGIN) * msg.palette[0].colors.length + RECT_MARGIN;
            const frameHeight = (RECT_SIZE + RECT_MARGIN) * msg.palette.length + RECT_MARGIN;
            frame.resize(frameWidth, frameHeight);
            frame.name = "Smart Chroma";
            figma.currentPage.appendChild(frame);
            nodeList.push(frame);

            let x = RECT_MARGIN;
            let y = RECT_MARGIN;

            for (const row of msg.palette) {
                x = RECT_MARGIN;

                for (const color of row.colors) {
                    const hex = color.hex;
                    const r = parseInt(hex.substring(1, 3), 16) / 255;
                    const g = parseInt(hex.substring(3, 5), 16) / 255;
                    const b = parseInt(hex.substring(5), 16) / 255;

                    const rect = figma.createRectangle();
                    rect.x = x;
                    rect.y = y;
                    rect.resize(RECT_SIZE, RECT_SIZE);
                    rect.name = hex;
                    rect.cornerRadius = RECT_CORNER_RADIUS;
                    rect.fills = [{ type: "SOLID", color: { r, g, b } }];

                    if (color.isBaseColor) {
                        /**
                         * Rect for border representing the basic color.
                         */
                        const borderRect = figma.createRectangle();

                        borderRect.x = x;
                        borderRect.y = y;
                        borderRect.cornerRadius = RECT_CORNER_RADIUS;
                        borderRect.resize(RECT_SIZE, RECT_SIZE);

                        rect.resize(RECT_SIZE * 0.9, RECT_SIZE * 0.9);
                        rect.x += RECT_SIZE * 0.05;
                        rect.y += RECT_SIZE * 0.05;

                        borderRect.name = "Base Color Pointer";
                        borderRect.fills = [];
                        borderRect.strokes = [{ type: "SOLID", color: { r, g, b } }];
                        borderRect.strokeAlign = "OUTSIDE";
                        borderRect.strokeWeight = RECT_SIZE * 0.08;

                        frame.appendChild(borderRect);
                    }

                    frame.appendChild(rect);
                    x += RECT_SIZE + RECT_MARGIN;
                }
                y += RECT_SIZE + RECT_MARGIN;
            }

            figma.currentPage.selection = nodeList;
            figma.viewport.scrollAndZoomIntoView(nodeList);
            break;

        case "notify":
            figma.notify(msg.message, msg.option);
            break;

        default:
            console.error("Unknown message type sent by UI.");
            break;
    }
};
