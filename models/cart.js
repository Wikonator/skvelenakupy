module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function(item, id, colour) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = {item: item, color: colour, qty: 0, price: 0};
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    };

    this.odoberJednu = function(id) {
        this.items[id].qty--;
        this.items[id].price -= this.items[id].item.price;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.price;
        if (this.items[id].qty <= 0) {
            delete this.items[id];
        }
    };

    this.odoberVsetky = function(id) {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].item.price;
            delete this.items[id];
    };

    this.generateArray = function() {
        var array = [];
        for (var id in this.items) {
            array.push(this.items[id]);
        }
        return array;
    };
};
