/**
 * @file This file is imported for side effects and performs the necessary processing for the UI.
 *       Functions in this file are not intended to be used within this file.
 */

((): void => {
    /**
     * Input element width to automatically change based on input content.
     */
    const adjustInputWidth = (): void => {
        document.querySelectorAll("input").forEach((element) => {
            // eslint-disable-next-line max-statements
            element.addEventListener("input", () => {
                const inputElementStyle = getComputedStyle(element);
                const fontSize = parseFloat(inputElementStyle.fontSize.replace("px", ""));

                const div = document.createElement("div");
                div.textContent = element.value;
                div.style.display = "inline-block";
                div.style.visibility = "hidden";
                div.style.position = "fixed";
                div.style.fontSize = `${fontSize.toString()}px`;
                document.body.appendChild(div);
                element.style.width = `${div.offsetWidth.toString()}px`;
                div.remove();
            });
        });
    };

    adjustInputWidth();
})();
