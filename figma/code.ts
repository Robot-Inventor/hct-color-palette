figma.showUI(__html__, { height: 600, themeColors: true, width: 800 });

const generate = (msg: generateMessage): void => {
    figma.ui.postMessage(msg);
};

// eslint-disable-next-line max-lines-per-function, max-statements
const insert = (msg: insertMessage): void => {
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

    let positionX = RECT_MARGIN;
    let positionY = RECT_MARGIN;

    for (const row of msg.palette) {
        positionX = RECT_MARGIN;

        for (const color of row.colors) {
            const { hex } = color;
            /* eslint-disable no-magic-numbers */
            const red = parseInt(hex.substring(1, 3), 16) / 255;
            const green = parseInt(hex.substring(3, 5), 16) / 255;
            const blue = parseInt(hex.substring(5), 16) / 255;
            /* eslint-enable no-magic-numbers */

            const rect = figma.createRectangle();
            rect.x = positionX;
            rect.y = positionY;
            rect.resize(RECT_SIZE, RECT_SIZE);
            rect.name = hex;
            rect.cornerRadius = RECT_CORNER_RADIUS;
            // eslint-disable-next-line sort-keys
            rect.fills = [{ type: "SOLID", color: { r: red, g: green, b: blue } }];

            if (color.isBaseColor) {
                /**
                 * Rect for border representing the basic color.
                 */
                const borderRect = figma.createRectangle();

                borderRect.x = positionX;
                borderRect.y = positionY;
                borderRect.cornerRadius = RECT_CORNER_RADIUS;
                borderRect.resize(RECT_SIZE, RECT_SIZE);

                /* eslint-disable no-magic-numbers */
                rect.resize(RECT_SIZE * 0.9, RECT_SIZE * 0.9);
                rect.x += RECT_SIZE * 0.05;
                rect.y += RECT_SIZE * 0.05;
                /* eslint-enable no-magic-numbers */

                borderRect.name = "Base Color Pointer";
                borderRect.fills = [];
                // eslint-disable-next-line sort-keys
                borderRect.strokes = [{ type: "SOLID", color: { r: red, g: green, b: blue } }];
                borderRect.strokeAlign = "OUTSIDE";
                // eslint-disable-next-line no-magic-numbers
                borderRect.strokeWeight = RECT_SIZE * 0.08;

                frame.appendChild(borderRect);
            }

            frame.appendChild(rect);
            positionX += RECT_SIZE + RECT_MARGIN;
        }
        positionY += RECT_SIZE + RECT_MARGIN;
    }

    figma.currentPage.selection = nodeList;
    figma.viewport.scrollAndZoomIntoView(nodeList);
};

figma.ui.onmessage = (msg: message): void => {
    switch (msg.type) {
        case "generate":
            generate(msg);
            break;

        case "insert":
            insert(msg);
            break;

        case "notify":
            figma.notify(msg.message, msg.option);
            break;

        default:
            // eslint-disable-next-line no-console
            console.error("Unknown message type sent by UI.");
            break;
    }
};
