import { UI } from "../common/ui";
import { toPng } from "html-to-image";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const paletteOuter: HTMLElement = document.querySelector("#palette")!;

const onActionButtonClick = (): void => {
    const anchor = document.createElement("a");
    anchor.download = "color_palette.png";

    void toPng(paletteOuter).then((data) => {
        anchor.href = data;
        anchor.click();
    });
};

const onErrorMessage = (message: string): void => {
    // eslint-disable-next-line no-console
    console.error(message);
    // eslint-disable-next-line no-alert
    alert(message);
};

const UIOptions = {
    actionButtonLabel: "Download as PNG",
    onActionButtonClick,
    onErrorMessage
};

new UI(UIOptions);
