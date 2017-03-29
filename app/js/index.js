'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Menu = function () {
    function Menu(menu_selector) {
        _classCallCheck(this, Menu);

        $('section.web-page__item').hide();
        this.menu = menu_selector;
    }

    _createClass(Menu, [{
        key: 'subscribe',
        value: function subscribe() {
            var m = this.menu;
            $(m).find('.navbar__link_category').on('click', function () {
                $(m).find('.navbar__link_category').removeClass('navbar__link_active');
                $(this).addClass('navbar__link_active');
            });
        }
    }, {
        key: 'changePages',
        value: function changePages() {
            window.addEventListener("popstate", function (e) {
                var page_id = location.hash;
                $('section.web-page__item').hide();
                $(page_id + '_').show();
                // alert(page_id);
                if ($(page_id + '_').text() == "") {
                    $.ajax({
                        url: 'templates/' + page_id.slice(1) + '.html',
                        success: function success(data) {
                            $(page_id + '_').html(data);
                        }
                    });
                }
            });
        }
    }]);

    return Menu;
}();

var ShoppingBag = function () {
    _createClass(ShoppingBag, null, [{
        key: 'itemsIter',
        get: function get() {
            return !this._count ? 0 : this._count;
        },
        set: function set(val) {
            this._count = val;
        }
    }]);

    function ShoppingBag(data) {
        _classCallCheck(this, ShoppingBag);

        this.data = data;
    }

    _createClass(ShoppingBag, [{
        key: 'addItem',
        value: function addItem(i) {
            var serialObj = JSON.stringify(this.data[i]); //сериализуем список
            localStorage.setItem(ShoppingBag.itemsIter, serialObj); //запишем его в хранилище по ключу
            ShoppingBag.itemsIter++;
        }
    }, {
        key: 'removeItem',
        value: function removeItem(key) {
            localStorage.removeItem(key);
        }
    }, {
        key: 'getSum',
        value: function getSum() {
            var sum = 0;
            for (var key in localStorage) {
                sum += JSON.parse(localStorage.getItem(key)).price;
            }
            $('#basket .basket__total').html('Total: \xA3 ' + sum);
            return sum;
        }
    }, {
        key: 'show',
        value: function show() {
            var data = this.data;
            var ret = '';
            for (var key in localStorage) {
                var obj = JSON.parse(localStorage.getItem(key));
                ret += '<div class="basket__item">\n                    <span class="basket__image-container">\n                        <span class="basket__image"></span>\n                    </span>\n                    <span class="basket__item-description">\n                        ' + obj.name + ' ' + obj.color + ' ' + obj.size + '\n                        <span class="basket__remove-button" onclick=(sb.removeItem(' + key + '))>[Remove]</span>\n                    </span>\n\n                    <input type="number" class="basket__num-of">\n                    <span class="basket__item-price">\xA3' + obj.price + '</span>\n                </div>';
            }
            $('#basket').append(ret);
        }
    }]);

    return ShoppingBag;
}();

var Goods = function () {
    function Goods(data) {
        _classCallCheck(this, Goods);

        this.data = data;
    }

    _createClass(Goods, [{
        key: 'getWithNameSelector',
        value: function getWithNameSelector() {
            var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

            var names = [];
            this.data.forEach(function (item, i, arr) {
                if (selector != "") {
                    if (item.name.indexOf(selector) != -1) {
                        names.push(i);
                    }
                } else {
                    names.push(i);
                }
            });
            return names;
        }
    }, {
        key: 'show',
        value: function show(names) {
            var data = this.data;
            var ret = '';
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = names[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var i = _step.value;

                    ret += '<article class="product__item grid__col grid__col_4 web-page__item">\n                    <div class="product__image">\n                        <object class="product__logo" type="image/svg+xml" data="img/vans.svg">\n                            Ray ban\n                        </object>\n                    </div>\n                    <div class="product__about">\n                        <h2 class="product__header">' + this.data[i].name + '</h2>\n                        <div class="product__color">' + this.data[i].color + '</div>\n                        <div class="product__size">\n                            Size: ' + this.data[i].size + '\n                            <span class="product__size-changer">[Change]</span>\n                        </div>\n                        <div class="product__price">\xA3' + this.data[i].price + '</div>\n                        <button class="product__button button button__small button_blue" onclick=(sb.addItem(' + i + '))>ADD TO BASKET</button>\n                    </div>\n                </article>';
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            $('.product').html(ret);
        }
    }]);

    return Goods;
}();

var data_;
$.ajax({
    url: 'https://listatt.github.io/db/data.json',
    success: function success(data) {
        data_ = data;
    }
});

$(window).on('load', function () {
    window.gd = new Goods(data_);
    gd.show(gd.getWithNameSelector());
    window.sb = new ShoppingBag(data_);
    sb.show();
    sb.getSum();
    var men = new Menu('.navbar');
    men.subscribe();
    men.changePages();
});