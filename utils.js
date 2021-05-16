
function newElement(element, attributes) {
    const newEl = document.createElement(element);
    if (attributes) {
        Object.keys(attributes).forEach( key => newEl[key] = attributes[key]);
    }
    return newEl;
}

const El = {
    p: function (attributes) { return newElement('p', attributes); },
    div: function (attributes) { return newElement('div', attributes); },
    img: function (attributes) { return newElement('img', attributes); },
    span: function (attributes) { return newElement('span', attributes); },
    button: function (attributes) { return newElement('button', attributes); },
    label: function (attributes) { return newElement('label', attributes); },
    input: function (attributes) { return newElement('input', attributes); },
    text: function (content) { return document.createTextNode(content); },
}

function createLine(text) {
    const content = El.text(text);
    const line = El.div();
    line.appendChild(content);
    return line;
}

function appendLines(containingNode, ...texts) {
    texts.forEach( text => containingNode.appendChild(createLine(text)) );
}

export {
    El,
    appendLines,
};
