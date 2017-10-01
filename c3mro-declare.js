(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === "object") {
        module.exports = factory();
    } else {
        root.c3mroDeclare = root.C3MRODeclare = factory();
    }
}(this, function () {
    // utils
    function toArray(obj) {
        return Array.prototype.slice.call(obj);
    }
    const toString = {}.toString;
    const isType = (obj, type) => toString.call(obj) === `[object ${type}]`;
    function isFunction(obj) {
        return isType(obj, 'Function');
    }
    function isString(obj) {
        return isType(obj, 'String');
    }
    const isArray = Array.isArray;
    const assign = Object.assign;

    // C3MRO
    function isGoodHead(head, rest) {
        let isGood = true;
        rest.some(lin => {
            if (lin.indexOf(head) > 0) {
                isGood = false;
            }
        });

        if (isGood) {
            rest.forEach(lin => {
                if (lin.indexOf(head) === 0) {
                    lin.shift();
                }
            });
        }
        return isGood;
    }

    function eachHead(bases) {
        const result = [];
        let badLinearization = 0;

        while (bases.length) {
            const base = bases.shift();
            if (!base.length) {
                continue;
            }

            if (isGoodHead(base[0], bases)) {
                result.push(base.shift());
                badLinearization = 0;
            } else {
                badLinearization += 1;
                if (badLinearization === bases.length) {
                    throw new TypeError('Bad Linearization');
                }
            }
            if (base.length) {
                bases.push(base);
            }
        }
        return result;
    }

    function c3mroMerge() {
        const args = toArray(arguments);
        return eachHead(args.map(toArray));
    }

    // declare
    function declare(/* name, superClasses, protoObj */) {
        const args = toArray(arguments);
        const lin = '_linearization';
        function Tmp() {};
        const name = isString(args[0]) ? args.shift() : '';
        let superClasses = isArray(args[0]) || isFunction(args[0]) ? args.shift() : [];
        superClasses = isArray(superClasses) ? superClasses : [superClasses];
        const finalProtoObj = args[0] ? args.shift() : {};

        let bases = [];

        superClasses.forEach(clazz => {
            clazz[lin] = clazz[lin] || [clazz];
            bases.push(clazz[lin]);
        });

        if (bases.length) {
            bases.push(superClasses);
            bases = c3mroMerge.apply(null, bases);
        }

        let ctor = function ctor() {};
        const tempConstructor = finalProtoObj.constructor;
        if (tempConstructor !== Object.prototype.constructor) {
            ctor = tempConstructor;
        }

        ctor[lin] = [ctor].concat(bases);
        ctor.parents = toArray(bases);

        let protoObj = {};
        let uberClass;
        while ((uberClass = bases.pop())) {
            protoObj = assign(protoObj, uberClass.prototype);
            Tmp.prototype = protoObj;
            protoObj.constructor = uberClass;
            protoObj = new Tmp();
        }

        ctor.className = name;
        ctor.prototype = protoObj;
        ctor.prototype.constructor = ctor;

        assign(ctor.prototype, finalProtoObj);

        return ctor;
    }

    return declare;
}));

