class VirtualDOM {

    create(tagName, attributes, children) {
        return {
            tagName,
            attributes,
            children
        };
    }

    update(node, vNode) {
        this.__updateElement(node,vNode, node.parentNode)
    }

    __updateElement(node, vNode, cParentNode) {
        debugger
        if (this.__isEqualElement(node, vNode)) {
            const vNodeChild = vNode.children;
            const nodeChild = Array.from(node.children);
            const maxChildLenght = Math.max(nodeChild.length, vNodeChild.length);
            for(let i = 0; i < maxChildLenght; i++) {
                this.__updateElement(nodeChild[i], vNodeChild[i], node)
            }
        } else {
            // Mismatch case
            this.__resolveConflict(node, vNode, cParentNode);
        }
    }

    __resolveConflict(node, vNode, parentNode) {
        // Case 1
        if (node && vNode) {
            return this.__replaceNode(node, this.__createElement(vNode));
        }
        // Case 2
        if (!node && vNode) {
            parentNode.appendChild(this.__createElement(vNode))
        }
        // Case 3
        if (node && !vNode) {
            node.remove();
        }

    }

    __replaceNode(oldNode, newNode) {
        oldNode.parentNode.replaceChild(oldNode, newNode);
    }

    __combineChildren(children) {
        const childBox = document.createDocumentFragment();
        children.forEach(el => {
            const child = this.__createElement(el);
            childBox.appendChild(child);
        });
        return childBox;
    }

    __isEqualElement(node, vNode) {
        const typeNode = typeof node;
        const typeVNode = typeof vNode;
        if (typeNode !== typeVNode) {
            return false;
        }
        if (typeNode === 'string') {
            return this.__isEqualName(node, vNode)
        }
        if (this.__isEqualName(node.tagName, vNode.tagName)) {
            return this.__isEqualAttr(Object.assign({}, node.attributes), vNode.attributes);
        }

        return false;
    }

    __isEqualAttr(attrMap1, attrMap2) {
        const exactAttr = Object.keys(attrMap1).length ? attrMap1 : null;
        if (!exactAttr && !attrMap2) {
            return true;
        }

        if (!!exactAttr ^ !!attrMap2) {
            return false;
        }

        const attrList1 = Object.keys(exactAttr);
        const attrList2 = Object.keys(attrMap2);
        if (exactAttr.length !== attrList2.length) {
            return false;
        }

        return !exactAttr.some(attr1 => {
            return exactAttr[attr1] !== attrMap2[attr1];
        });
    }

    __isEqualName(s1, s2) {
        return s1.toLowerCase() === s2.toLowerCase();
    }

    __createElement(node) {
        console.log('__createElement');
        if (Array.isArray(node)) {
            return document.createTextNode(node)
        } else {
            const {tagName, attributes, children} = node;
            const root = document.createElement(tagName);
            const styledRoot = !attributes ? root : this.__setAttributes(root, Object.assign({}, attributes));
            styledRoot.appendChild(this.__combineChildren(children));
            return root;
        }
    }

    __setAttributes(el, attributes) {
        for (const attr in attributes) {
            el.setAttribute(attr, attributes[attr]);
        }
        return el;
    }
}

const test = () => {
    const rootNode = document.createElement("DIV");
    const childNode = document.createElement('SPAN');
    const textNode = document.createTextNode('SPAN');
    childNode.appendChild(textNode);
    rootNode.appendChild(childNode);

    document.body.appendChild(rootNode);

    const virtualDOM = new VirtualDOM();

    const rootVNode = virtualDOM.create('div', null, [
        virtualDOM.create('span', null, ['Hello'])
        ]);


    virtualDOM.update(rootNode, rootVNode);
}

test();