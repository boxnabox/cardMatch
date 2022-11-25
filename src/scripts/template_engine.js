function templateEngine(block) {

    if ((block === undefined) || (block === null) || block === (false)) {
        return document.createTextNode("");
    };

    if ((typeof block === "string") || (typeof block === "number") || (typeof block === true)) {
        return document.createTextNode(block);
    };

    if (Array.isArray(block)) {
        const fragment = document.createDocumentFragment();

        block.forEach(item => {
            const element = templateEngine(item);

            fragment.appendChild(element);
        });

        return fragment;
    };

    const result = document.createElement(block.tag);

    if (block.cls) {
        result.classList.add(...[].concat(block.cls).filter(Boolean));
    }

    if (block.attrs) {
        const keys = Object.keys(block.attrs);

        keys.forEach(key => {
            result.setAttribute(key, block.attrs[key]);
        })
        
    }


    const content = templateEngine(block.content);

    result.appendChild(content);

    return result;
}