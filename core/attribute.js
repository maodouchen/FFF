/**
 * Attribute处理类
 * 这里暂时放入Base
 */
define(['language'], function(L) {

    function Attribute() {
        this.__initAttr();
    }

    /**
     * 初始化所有属性 ATTRS
     * 注：如果extend中做过类属性的继承，那么此处将要改动
     */
    Attribute.prototype.__initAttr = function() {
        var attrs = mergeATTRS(this.constructor);
        addPrivates(this, attrs);
    };

    /**
     * merge所有父类的attrs
     * @param  {Function} cls 需要mergeATTRS属性的类
     * @param  {Object} attrs 需要merge的attrs
     * @return {Object} mixAttrs merge过所有父类ATTRS的attrs
     * 注：如果子类和父类的key一样，那么覆盖
     */
    function mergeATTRS(cls,attrs){

        var mixAttrs = attrs || {};

        if (cls.hasOwnProperty('ATTRS')) {
            //如果子类拥有同名的属性,默认使用子类的,即不覆盖
            L.core.mix(mixAttrs,cls.ATTRS,false);
        }

        if (cls.superclass) {
            mergeATTRS(cls.superclass,mixAttrs);
        }

        return mixAttrs;
    }

    /**
     * 添加私有属性
     * @param  {Object} obj 目标Object
     * @param  {Object} attrs 需要设置的属性对象
     */
    function addPrivates(obj, attrs) {

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

        Object.keys(attrs).forEach(function(key) {

            var cName = key.charAt(0).toUpperCase() + key.substr(1);
            var setter = 'set' + cName;
            var getter = 'get' + cName;
            var delter = 'del' + cName;

            var cacheVal = attrs[key].value || '';

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
                obj.__fireAttrEvent(key+'Change',val,obj[getter]());
                Object.getOwnPropertyDescriptor(obj, key).set(val);
            };

            obj[getter] = function() {
                return Object.getOwnPropertyDescriptor(obj, key).get();
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
        });
    }

    return Attribute;
});
