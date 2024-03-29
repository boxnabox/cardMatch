export { templateEngine };

function templateEngine(
    block: LayoutTree | LayoutTree[] | string[] | string | undefined | null
) {
    if (block === undefined || block === null) {
        return document.createTextNode('');
    }

    if (typeof block === 'string') {
        return document.createTextNode(block);
    }

    if (Array.isArray(block)) {
        const fragment = document.createDocumentFragment();

        block.forEach((item) => {
            const element = templateEngine(item);
            fragment.appendChild(element);
        });

        return fragment;
    }

    const result = document.createElement(block.tag);

    if (block.cls) {
        if (typeof block.cls === 'string') {
            result.classList.add(block.cls);
        } else {
            result.classList.add(...block.cls);
        }
    }

    if (block.attrs) {
        const keys = Object.keys(block.attrs);

        keys.forEach((key) => {
            block.attrs && result.setAttribute(key, block.attrs[key]);
        });
    }

    const content = templateEngine(block.content);

    result.appendChild(content);

    return result;
}
