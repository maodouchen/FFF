/**
 * 基础框架
 * 包含继承,mix,namespace等基础方法
 * @return {Object}   FFF
 */
define([], function() {

    /*
    F -> the First store
    F -> Fast
    F -> Front-end
     */
    var FFF = {};

    FFF.core = {
        /**
         * [extend 继承方法]
         * @param  {Function} subClass   子类
         * @param  {Function} superClass 父类
         * @return {Function}        继承父类之后的子类
         * TODO: 类属性是否需要继承?
         * TODO: 需要加上一个callParent的判断，用于对父类的属性做修改
         */
        extend: function(subClass, superClass) {
            if (!superClass || !subClass) {
                throw new Error("extend failed, please check that all dependencies are included!");
            }

            //extend spo == superc prototype origin
            var sp = Object.create(superClass.prototype),spo = Object.create(superClass.prototype);
            var rp = subClass.prototype;

            //mix subc prototype
            FFF.core.mix(sp, rp, true);

            subClass.prototype = sp;
            subClass.prototype.constructor = subClass;
            /**
             * 存储父类原型链
             */
            subClass.prototype.superclass = spo;
            /**
             * 存储父类类属性
             */
            subClass.superclass = superClass;

            return subClass;
        },
        /**
         * [mix 混合两个Object的属性]
         * @param  {Object} receiver  接受supplier的属性
         * @param  {Object} supplier  提供属性给receiver
         * @param  {Boolean} overwrite 是否覆盖属性
         * @return {Object}           mix后的Object
         */
        mix: function(receiver, supplier, overwrite) {
            Object.keys(supplier).forEach(function(o) {
                if (overwrite) {
                    receiver[o] = supplier[o];
                } else {
                    if (!receiver.hasOwnProperty(o)) {
                        receiver[o] = supplier[o];
                    }
                }
            });
            return receiver;
        },
        /**
         * 设置私有属性
         * @param  {Object} obj 目标Object
         * @param  {String} key 需要设置的属性名
         * @param  {AnyObject} value 需要设置的属性值
         * @return {null}
         * TODO 无用方法?
         */
        tSet: function(obj, key, value) {

            var defineProperty = ('defineProperty' in Object) ? Object.defineProperty :
                function(object, name, descriptor) {
                    if (!Object.prototype.__defineGetter__) {
                        return;
                    }
                    if (descriptor.get) {
                        object.__defineGetter__(name, descriptor.get);
                    }

                    if (descriptor.set) {
                        object.__defineSetter__(name, descriptor.set);
                    }
                };

            var cName = key.charAt(0).toUpperCase() + key.substr(1);
            var setter = 'set' + cName;
            var getter = 'get' + cName;
            var delter = 'del' + cName;

            var cacheVal = value || '';

            defineProperty(obj, key, {
                configurable: true,
                get: function() {
                    return cacheVal;
                },
                set: function(val) {
                    cacheVal = val;
                }
            });

            obj[setter] = function(val) {
                Object.getOwnPropertyDescriptor(obj, key).set(val);
            };

            obj[getter] = function() {
                var val = Object.getOwnPropertyDescriptor(obj, key).get();
                return val;
            };

            obj[delter] = function() {
                defineProperty(obj, key, {
                    enumerable: true,
                    configurable: true
                });
                delete obj[key];
                delete obj[setter];
                delete obj[getter];
                delete obj[delter];

            };
        }
    };

    return FFF;

});
