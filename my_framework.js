var $$ = (function () {
    // Функция $$ принимает строку с именем (именами) css-класса и возвращает объект, содержащий
    // массив элементов данного класса (или всех указанных классов).
    function $$(classnames) {
        var elements = document.getElementsByClassName(classnames);
        return new __object(elements);
    }

    // Метод $$.ready задает функцию-обработчик для события onload окна.
    $$.ready = function (onLoadHandler) {
        window.onload = onLoadHandler;
    }

    // Далее определяется внутренний объект с массивом элементов документа.
    // Конструктор принимает объект NodeList и инициализирует им внутренний массив elements.
    function __object(elements) {
        this.elements = [].map.call(elements, function (element) { return element; });
    }

    // Метод attr() является get- и set-методом для html-атрибутов элементов __object.
    __object.prototype.attr = function (htmlAttr, val) {
        if (val != undefined) {
            this.elements.forEach(function (elem) { elem.setAttribute(htmlAttr, val); });
        } else if (this.elements.length > 0) {
            return this.elements[0].getAttribute(htmlAttr);
        }
    }

    // removeAttr() удаляет указанный атрибут у всех выбранных элементов.
    __object.prototype.removeAttr = function (htmlAttr) {
        this.elements.forEach(function (elem) { elem.removeAttribute(htmlAttr); });
    }

    // Метод css() является get- и set-методом для inline css-атрибута элементов __object.
    __object.prototype.css = function (cssProperty, val) {
        if (val != undefined) {
            this.elements.forEach(function (elem) { elem.setAttribute("style", cssProperty + ":" + val); });
        } else if (this.elements.length > 0) {
            return (this.elements[0].getAttribute("style")).split(":")[1];
        }
    }

    // addClass() добавляет новый css-класс к выбранным элементам:
    __object.prototype.addClass = function (className) {
        this.each(function (elem) {
            elem.setAttribute("class", elem.getAttribute("class") + " " + className);
        });
    }

    // Удаление css-классов. Аргумент данной функции должен задавать только один класс
    __object.prototype.removeClass = function (className) {
        this.elements.forEach(function (elem) {
            var cssClasses = elem.getAttribute("class").split(" ");
            var result = "";
            for (var i = 0; i < cssClasses.length; i++) {
                if (cssClasses[i] != className) {
                    result += cssClasses[i] + " ";
                }
            }
            elem.setAttribute("class", result);
        });
    }

    // Удаляет класс если он есть у выбранных элементов и добавляет его, если этого класса нет.
    __object.prototype.toggleClass = function (className) {
        this.each(function (elem) {
            if (elem.getAttribute("class").indexOf(className) > -1) {
                var cssClasses = elem.getAttribute("class").split(" ");
                var result = "";
                for (var i = 0; i < cssClasses.length; i++) {
                    if (cssClasses[i] != className) {
                        result += cssClasses[i] + " ";
                    }
                }
                elem.setAttribute("class", result);
            } else {
                elem.setAttribute("class", elem.getAttribute("class") + " " + className);
            }
        });
    }

    // Метод is() принимает строку класса в качестве аргумента и возвращает true, если  по крайней мере один элемент 
    // принадлежит к данному классу.
    __object.prototype.is = function (classArg) {
        for (var i = 0; i < this.size() ; i++) {
            if (this.elements[i].getAttribute("class").indexOf(classArg) > -1) {
                return true;
            }
        }
        return false;
    }

    // Get- и set-метод, задающий или возвращающий содержимое элементов как простой текст
    __object.prototype.text = function (content) {
        if (content) { // set-режим
            this.each(function (elem) { elem.textContent = content; });
        } else if (this.elements.length > 0) { // get-режим
            return this.elements[0].textContent;
        }
    }

    // Get- и set-метод, задающий или возвращающий содержимое элементов как HTML-разметку
    __object.prototype.html = function (htmlContent) {
        if (htmlContent) { // set-режим
            this.each(function (elem) { elem.innerHTML = htmlContent; });
        } else if (this.elements.length > 0) { // get-режим
            return this.elements[0].innerHTML;
        }
    }

    // Добавить контент в конец выделенных элементов
    // Может добавить строку текста или HTML или узел Node DOM
    __object.prototype.append = function (content) {
        for (var i = 0; i < this.elements.length; i++) {
            if (content instanceof Node) {
                this.elements[i].appendChild(content.cloneNode());
            } else if (typeof content == "string") {
                this.elements[i].innerHTML = this.elements[i].innerHTML + content;
            }
        }
    }

    // Добавление контента в начало выбранных элементов
    __object.prototype.prepend = function (content) {
        this.each(function (element) {
            if (content instanceof Node) {
                element.innerHTML = content.nodeValue + element.innerHTML;
            } else if (typeof content == "string") {
                element.innerHTML = content + element.innerHTML;
            }
        });
    }

    // Заменить выбранные элементы другими элементами 
    __object.prototype.replaceWith = function (content) {
        this.each(function (element) {
            if (content instanceof Node) {
                var n = content.cloneNode();
                n.innerHTML = content.innerHTML;
                element.parentNode.replaceChild(n, element);
            } else if (typeof content == "string") {
                // Здесь нужно конвертировать строку разметки в Node
                var div = document.createElement('div');
                div.innerHTML = content;
                // Ограничимся случаем разметки, содержащей только один элемент
                var node = div.childNodes[0];
                element.parentNode.replaceChild(node, element);
            }
        });
    }

    // Like jQuery empty() method
    __object.prototype.empty = function () {
        this.each(function (element) {
            while (element.childNodes.length) {
                var childNodes = element.childNodes;
                for (var i = 0; i < childNodes.length; i++) {
                    __object.deleteLowestNodes(childNodes[i]);
                }
            }
        });
    }

    // Auxiliary recursive method for empty() method
    __object.deleteLowestNodes = function (n) {
        if (n.childNodes.length) { // Если у узла есть потомки, рекурсивно вызываем эту же функцию
            for (var i = 0; i < n.childNodes.length; i++) {
                __object.deleteLowestNodes(n.childNodes[i]);
            }
        } else { // Если это "листовой" узел, удаляем его.
            n.parentNode.removeChild(n);
        }
    }

    // Like jQuery remove() method
    __object.prototype.remove = function () {
        this.each(function (element) {
            element.parentNode.removeChild(element);
        });
    }

    // each() ожидает в качестве аргумента функцию и осуществляет ее вызов для каждого элемента
    __object.prototype.each = function (callback) {
        this.elements.forEach(callback);
    }

    // Метод item() возвращает элемент массива с указанным индексом
    __object.prototype.item = function (ind) {
        return this.elements[ind];
    }

    // Количество элементов в массиве
    __object.prototype.size = function () {
        return this.elements.length;
    }

    // Метод map() подобен методу Array.map()
    __object.prototype.map = function (callback) {
        var $$obj = new __object();
        $$obj.elements = this.elements.map(callback);
        return $$obj;
    }

    return $$;
}());
