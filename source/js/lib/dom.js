$NS$.makeNS('$NS$/dom', function () {

    var dom = {
            nodeidMap : {},
            nodeAttrForIndex : '__ownid__'
        },
        _out = {

            addClass : function (elem, addingClass) {
                var cls = !!(elem.className) ? elem.className : '',
                    reg = new RegExp('(\\s|^)' + addingClass + '(\\s|$)');
                if (!cls.match(reg)) {
                    elem.className = addingClass + ' '+ cls;
                }
                return true;
            },

            childs : function (node, only_elements) {
                return only_elements? node.children : node.childNodes;
            },

            removeAttr : function (el, valore) {
                el.removeAttribute(valore);
                return el;
            },

            attr : function (elem, name, value) {
                if (!elem) {
                    return '';
                }
                if (!('nodeType' in elem)) {
                    return false;
                }
                if (elem.nodeType === 3 || elem.nodeType === 8) {
                    return undefined;
                }

                var attrs = false,
                    l = false,
                    i = 0,
                    result,
                    is_obj = false;
         
                is_obj = $NS$.util.isObject(name);
                
                if (is_obj && elem.setAttribute) {
                    for (i in name) {
                        elem.setAttribute(i, name[i]);
                    }
                    return elem;
                }
                
                // Make sure that avalid name was provided, here cannot be an object
                // 
                if (!name || name.constructor !== String) {
                    return '';
                }
                
                // If the user is setting a value
                // 
                if (typeof value !== 'undefined') {
                    
                    // Set the quick way first 
                    // 
                    elem[{'for': 'htmlFor', 'class': 'className'}[name] || name] = value;
                    
                    // If we can, use setAttribute
                    // 
                    if (elem.setAttribute) {
                        elem.setAttribute(name, value);
                    }
                } else {
                    result = (elem.getAttribute && elem.getAttribute(name)) || 0;
                    if (!result) {
                        attrs = elem.attributes;
                        l = attrs.length;
                        for (i = 0; i < l; i += 1) {
                            if (attrs[i].nodeName === name) {
                                return attrs[i].value;
                            }
                        }
                    }
                    elem = result;
                }
                return elem;
            },

            toggleClass : function (elem, cls) {
                var ret = _out.hasClass(elem, cls);
                _out[ret ? 'removeClass' : 'addClass'](elem, cls);
                return !ret;
            },

            hasClass : function (elem, className) {
                return !!(elem.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)')))
            },

            removeClass : function (elem, removingClass) {
                var reg = new RegExp('(\\s|^)' + removingClass + '(\\s|$)');
                if (elem.className) {
                    elem.className = elem.className.replace(reg, ' ');
                }
                return true;
            },

            switchClass : function (elem, classToGo, classToCome) {
                _out.removeClass(elem, classToGo);
                _out.addClass(elem, classToCome);
                return true;
            },

            descendant : function () {
                var args = Array.prototype.slice.call(arguments, 0),
                    i = 0,
                    res = args.shift(),
                    l = args.length;
                if (!l) return res;
                while (i < l) {
                    res = res.children.item(~~args[i++]);
                }
                return res;
            },
            remove : function (el) {
                var parent = el.parentNode;
                parent && parent.removeChild(el);
            },

            idize : function (el, prop) {
                prop = prop || dom.nodeAttrForIndex;
                //if (!el.hasOwnProperty(prop)) {
                if (!(prop in el)) {
                    var nid = $NS$.util.uniqueid + '';
                    el[prop] = nid;
                    //save inverse
                    dom.nodeidMap[nid] = el;
                }
                return el[prop];
            },
            /**
             * [ description]
             * @param  {[type]} node          [description]
             * @param  {[type]} referenceNode [description]
             * @return {[type]}               [description]
             */
            insertAfter : function (node, referenceNode) {
                var p = referenceNode.parentNode,
                    ns = referenceNode.nextSibling;
                ns ? 
                    p.insertBefore(node, ns)
                    :
                    p.appendChild(node);
                return node;
            },

            headScript : function (opt) {
                var s = document.createElement('script'),
                    head = document.getElementsByTagName('head').item(0);
                if ('src' in opt)s.src = opt.src;
                if ('content' in opt)s.appendChild(document.createTextNode(opt.content));
                head.appendChild(s);
            },

            walk : function (root, func, mode) {
                mode = {pre : 'pre', post : 'post'}[mode] || 'post';
                var nope = function () {},
                    pre = mode === 'pre' ? func : nope,
                    post = mode === 'post' ? func : nope,
                    walk = (function () {
                        return function (node, _n) {
                            pre(node);
                            _n = node.firstChild;
                            while (_n) {
                                walk(_n);
                                _n = _n.nextSibling;
                            }
                            post(node);
                        };
                    })();
                walk(root);
            },
            /**
             * [wrapIn description]
             * @param  {[type]} node  [description]
             * @param  {[type]} attrs [description]
             * @return {[type]}       [description]
             */
            wrap : function (node, tag) {
                var wrap = document.createElement(tag || 'div');
                _out.insertAfter(wrap, node);
                wrap.appendChild(node);     
                return wrap;
            },

            clone : function (n, deep) {
                return n.cloneNode(!!deep);
            },
            getNodePosition : function (node) {

                var box = node.getBoundingClientRect(),
                    body = document.body,
                    docElem = document.documentElement,
                    scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop,
                    scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft,
                    clientTop = docElem.clientTop || body.clientTop || 0,
                    clientLeft = docElem.clientLeft || body.clientLeft || 0;
                
                return {
                    top  : box.top +  scrollTop - clientTop,
                    left : box.left + scrollLeft - clientLeft
                };
            },
            gebtn : function (n, name) {
                return Array.prototype.slice.call(n.getElementsByTagName(name), 0);
            },
            addStyle : function (src, ret) {
                var style = document.createElement('link');
                style.rel = 'stylesheet',
                style.href = src;
                if (ret) return style;
                head = document.getElementsByTagName('head').item(0);
                head.appendChild(style);
            },

            
            //Returns true if it is a DOM element    
            /**
             * [ description]
             * @param  {[type]} o [description]
             * @return {[type]}   [description]
             */
            isElement : function (o) {
                return (
                    typeof HTMLElement === 'object' ?
                        o instanceof HTMLElement
                    : //DOM2
                        o && typeof o === 'object' &&
                        typeof o.nodeType !== undefined && o.nodeType === 1 &&
                        typeof o.nodeName === 'string'
                );
            },

            parent : function (node) {
                return (node.parentNode && node.parentNode.nodeType !== 11) ?
                    node.parentNode : false;
            }

        };





    return _out;
});
