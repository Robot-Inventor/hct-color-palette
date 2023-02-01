/**
 * Input element width to automatically change based on input content.
 */
const adjust_input_width = () => {
    document.querySelectorAll("input").forEach((element) => {
        element.addEventListener("input", () => {
            const input_style = getComputedStyle(element);
            const font_size = parseFloat(input_style.fontSize.replace("px", ""));

            const div = document.createElement("div");
            div.textContent = element.value;
            div.style.display = "inline-block";
            div.style.visibility = "hidden";
            div.style.position = "fixed";
            div.style.fontSize = `${font_size}px`;
            document.body.appendChild(div);
            element.style.width = `${div.offsetWidth}px`;
            div.remove();
        });
    });
};

adjust_input_width();
