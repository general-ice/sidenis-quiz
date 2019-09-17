(() => {
    class VirtualDOM {

        create(tagName, attributes, children) {
            return {
                tagName,
                attributes,
                children
            };
        }

        update(node, vNode) {
            this.__updateElement(node,vNode)
        }

        __updateElement(node, vNode) {
            const nodeChild = [...node.children];
            if (this.__isEqualElement(node, vNode) && nodeChild.length) {
                const vNodeChild = vNode.children;
                vNodeChild.forEach((vNode, i) => {
                    this.__updateElement(nodeChild[i], vNode)
                }, []);
            } else {
                const necessaryEl = this.__createElement(vNode);
                node.parentNode.append(necessaryEl);
                node.remove();
            }
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
            if (this.__isEqualName(node.tagName, vNode.tagName)) {
                return this.__isEqualAttr({ ...node.attributes }, vNode.attributes);
            }

            return false;
        }

        __isEqualAttr(attrMap1, attrMap2) {
            if (!(!!attrMap1 && !!attrMap2)) {
                return true;
            }

            if (!(!!attrMap1 || !!attrMap2)) {
                return false;
            }

            const attrList1 = Object.keys(attrMap1);
            const attrList2 = Object.keys(attrMap2);
            if (attrList1.length !== attrList2.length) {
                return false;
            }

            return !attrList1.some(attr1 => {
                return attrMap1[attr1] !== attrMap2[attr1];
            });
        }

        __isEqualName(s1, s2) {
            return s1.toLowerCase() === s2.toLowerCase();
        }

        __createElement(node) {
            if (typeof node === 'string') {
                return document.createTextNode(node)
            } else {
                const {tagName, attributes, children} = node;
                const root = document.createElement(tagName);
                const styledRoot = !attributes ? root : this.__setAttributes(root, {...attributes});
                children && children.length && styledRoot.appendChild(this.__combineChildren(children));
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

    const rootNode = document.createElement("DIV");
    document.body.appendChild(rootNode);

    const virtualDOM = new VirtualDOM();

    const rootVNode =
        virtualDOM.create('div', null, [
            virtualDOM.create('SPAN',
                { style: 'color: red;' },
                ['Span']),
            virtualDOM.create('ul',
                null,
                [
                    virtualDOM.create('li',
                        { style: 'color: green;' },
                        ['firstEl']),
                    virtualDOM.create('li',
                        { style: 'color: whitesmoke; font-size: 21px' },
                        ['secondEl']),
                ]),
            virtualDOM.create('BUTTON',
                { disabled: true },
                ['Button'])
        ]);


    virtualDOM.update(rootNode, rootVNode);
})();
