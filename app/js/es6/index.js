class Menu{
    constructor(menu_selector){
        $('section.web-page__item').hide();
        this.menu = menu_selector; 
    }

    subscribe(){
        let m = this.menu;
        $(m).find('.navbar__link_category').on('click', function () {
            $(m).find('.navbar__link_category').removeClass('navbar__link_active');
            $(this).addClass('navbar__link_active');
        });
    }

    changePages(){
        window.addEventListener("popstate", function(e) {
            let page_id = location.hash;
            $('section.web-page__item').hide();
            $(page_id+'_').show();
            // alert(page_id);
            if ($(page_id+'_').text() == "") {
              $.ajax({
                url: `templates/${page_id.slice(1)}.html`,
                success: function(data){
                    $(page_id+'_').html(data);  
                }
              });
            }
        });
    }
}

class ShoppingBag{

    static get itemsIter() {
         return !this._count ? 0 : this._count;
    };
    static set itemsIter(val) {
        this._count = val;
    };

    constructor(data){
        this.data = data;
    }

    addItem(i){
        var serialObj = JSON.stringify(this.data[i]); //сериализуем список
        localStorage.setItem(ShoppingBag.itemsIter, serialObj); //запишем его в хранилище по ключу
        ShoppingBag.itemsIter++;
    }

    removeItem(key){
        localStorage.removeItem(key);
    }

    getSum(){
        let sum = 0;
        for (let key in localStorage){
           sum += JSON.parse(localStorage.getItem(key)).price;
        }
        $('#basket .basket__total').html(`Total: £ ${sum}`);
        return sum;
    }

    show(){
        let data = this.data;
        let ret = '';
        for (let key in localStorage){
            let obj = JSON.parse(localStorage.getItem(key))
            ret += 
                `<div class="basket__item">
                    <span class="basket__image-container">
                        <span class="basket__image"></span>
                    </span>
                    <span class="basket__item-description">
                        ${obj.name} ${obj.color} ${obj.size}
                        <span class="basket__remove-button" onclick=(sb.removeItem(${key}))>[Remove]</span>
                    </span>

                    <input type="number" class="basket__num-of">
                    <span class="basket__item-price">£${obj.price}</span>
                </div>`;
        }
        $('#basket').append(ret);
    }
}

class Goods{
    constructor(data){
        this.data = data;
    }

    getWithNameSelector(selector=""){
        let names = [];
        this.data.forEach(function(item, i, arr) {
            if (selector!="") {
                if (item.name.indexOf(selector) != -1){
                    names.push(i);
                }
            } else {
                names.push(i);
            }
        });
        return names;
    }

    show(names){
        let data = this.data;
        let ret = '';
        for (let i of names){
            ret += 
                `<article class="product__item grid__col grid__col_4 web-page__item">
                    <div class="product__image">
                        <object class="product__logo" type="image/svg+xml" data="img/vans.svg">
                            Ray ban
                        </object>
                    </div>
                    <div class="product__about">
                        <h2 class="product__header">${this.data[i].name}</h2>
                        <div class="product__color">${this.data[i].color}</div>
                        <div class="product__size">
                            Size: ${this.data[i].size}
                            <span class="product__size-changer">[Change]</span>
                        </div>
                        <div class="product__price">£${this.data[i].price}</div>
                        <button class="product__button button button__small button_blue" onclick=(sb.addItem(${i}))>ADD TO BASKET</button>
                    </div>
                </article>`;
        }
        $('.product').html(ret);

    }
}

var data_;
$.ajax({
    url: 'https://listatt.github.io/db/data.json',
    success: function(data){
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