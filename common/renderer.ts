import { PaletteData } from "./palette";

class Renderer {
    private parent: HTMLElement;

    /**
     * Create a new renderer.
     * @param parent Parent element to render the palette.
     */
    public constructor(parent: HTMLElement) {
        this.parent = parent;
    }

    /**
     * Render palette to the parent element.
     * @param palette Palette data to render.
     */
    // eslint-disable-next-line max-statements
    public renderPalette(palette: PaletteData): void {
        this.clearPalette();

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

        this.parent.appendChild(fragment);
    }

    /**
     * Clear palette from the parent element.
     */
    private clearPalette(): void {
        while (this.parent.firstChild) {
            this.parent.removeChild(this.parent.firstChild);
        }
    }
}

export { Renderer };
