/**
 * Message to generate palette data.
 */
type generateMessage = {
    type: "generate";
    baseColor: string;
    hueSize: number;
    toneSize: number;
};

/**
 * Message to insert palette to Figma document.
 */
type insertMessage = {
    type: "insert";
    palette: palette;
};

/**
 * Message to display a notification to the user.
 */
type notifyMessage = {
    type: "notify";
    message: string;
    option: NotificationOptions;
};

/**
 * Type of the messages sent from UI to backend script.
 */
type message = generateMessage | insertMessage | notifyMessage;
