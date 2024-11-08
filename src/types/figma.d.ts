import type { PaletteData } from "../common/ts/palette";

/**
 * Message to insert palette to Figma document.
 */
interface MessageInsert {
    type: "insert";
    palette: PaletteData;
}

/**
 * Message to display a notification to the user.
 */
interface MessageNotify {
    type: "notify";
    message: string;
    option: NotificationOptions;
}

/**
 * Type of the messages sent from UI to backend script.
 */
type Message = MessageInsert | MessageNotify;

export type { Message, MessageInsert, MessageNotify };
