import { PaletteData } from "../common/palette";

/**
 * Message to insert palette to Figma document.
 */
type MessageInsert = {
    type: "insert";
    palette: PaletteData;
};

/**
 * Message to display a notification to the user.
 */
type MessageNotify = {
    type: "notify";
    message: string;
    option: NotificationOptions;
};

/**
 * Type of the messages sent from UI to backend script.
 */
type Message = MessageInsert | MessageNotify;

export { Message, MessageInsert, MessageNotify };
