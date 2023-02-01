type generate_message = {
    type: "generate";
    base_color: string;
    palette_size_hue: number;
    palette_size_tone: number;
};

type insert_message = {
    type: "insert";
    palette: palette;
};

type notify_message = {
    type: "notify";
    message: string;
    option: NotificationOptions;
};

type message = generate_message | insert_message | notify_message;
