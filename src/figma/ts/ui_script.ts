import type { Message } from "../../types/figma";
import type { PaletteData } from "../../common/ts/palette";
import { UI } from "../../common/ts/ui";

/**
 * Send message to the backend script.
 * @param message Message to be sent.
 */
const postMessage = (message: Message): void => {
    parent.postMessage({ pluginMessage: message }, "*");
};

const onActionButtonClick = (paletteData: PaletteData): void => {
    postMessage({ palette: paletteData, type: "insert" });
};

const onErrorMessage = (message: string): void => {
    const messageData: Message = {
        message,
        option: {
            error: true,
            timeout: 5000
        },
        type: "notify"
    } as const;
    postMessage(messageData);
};

const UIOptions = {
    actionButtonLabel: "Insert to Figma",
    onActionButtonClick,
    onErrorMessage
};

new UI(UIOptions);
