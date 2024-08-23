// eslint-disable-next-line import-x/no-unassigned-import
import "./style.css";
// eslint-disable-next-line import-x/no-unassigned-import
import "./side_effect";
import { Palette, type PaletteData } from "./palette";
import { Renderer } from "./renderer";

interface UIOptions {
    actionButtonLabel: string;
    onActionButtonClick: (paletteData: PaletteData) => void;
    onErrorMessage: (message: string) => void;
}

class UI {
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    private readonly baseColorInput = document.querySelector<HTMLInputElement>("#base_color")!;
    private readonly hueSizeInput = document.querySelector<HTMLInputElement>("#palette_size_hue")!;
    private readonly toneSizeInput = document.querySelector<HTMLInputElement>("#palette_size_tone")!;
    private readonly baseColorPicker = document.querySelector<HTMLInputElement>("#base_color_picker")!;
    private readonly baseColorPreview = document.querySelector<HTMLElement>("#base_color_preview")!;
    private readonly sortButton = document.querySelector("#sort_button")!;
    private readonly paletteOuter = document.querySelector<HTMLElement>("#palette")!;
    private readonly generateButton = document.querySelector("#generate_button")!;
    private readonly actionButton = document.querySelector("#action_button")!;
    /* eslint-enable @typescript-eslint/no-non-null-assertion */

    public constructor(options: UIOptions) {
        const palette = new Palette();
        const renderer = new Renderer(this.paletteOuter);

        this.initializeColorPicker();

        this.sortButton.addEventListener("click", () => {
            const paletteData = palette.sortPalette();
            renderer.renderPalette(paletteData);
        });

        this.generateButton.addEventListener("click", () => {
            if (!this.validateForm()) {
                const errorMessage = "Parameters are invalid. Please check the form.";
                options.onErrorMessage(errorMessage);
                return;
            }

            const baseColor = this.baseColorInput.value;
            const hueSize = parseInt(this.hueSizeInput.value, 10);
            const toneSize = parseInt(this.toneSizeInput.value, 10);
            const paletteData = palette.generate(baseColor, hueSize, toneSize);
            renderer.renderPalette(paletteData);
        });

        this.actionButton.textContent = options.actionButtonLabel;
        this.actionButton.addEventListener("click", () => {
            const paletteData = palette.getPalette();
            if (!paletteData) {
                options.onErrorMessage("Palette data is not generated.");
                return;
            }
            options.onActionButtonClick(paletteData);
        });
    }

    private initializeColorPicker(): void {
        this.baseColorInput.addEventListener("input", () => {
            this.baseColorPreview.style.background = this.baseColorInput.value;
        });

        this.baseColorPreview.addEventListener("click", () => {
            this.baseColorPicker.click();
        });

        this.baseColorPicker.addEventListener("input", () => {
            this.baseColorInput.value = this.baseColorPicker.value;
            this.baseColorPreview.style.background = this.baseColorPicker.value;
        });
    }

    private validateForm(): boolean {
        return (
            this.baseColorInput.checkValidity() &&
            this.hueSizeInput.checkValidity() &&
            this.toneSizeInput.checkValidity()
        );
    }
}

export { UI };
