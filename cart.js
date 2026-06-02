(function () {
    var STORAGE_KEY = "companyCartV1";

    function readCart() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return [];
            var data = JSON.parse(raw);
            return Array.isArray(data) ? data : [];
        } catch (e) {
            return [];
        }
    }

    function writeCart(items) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }

    window.CompanyCart = {
        get: readCart,
        add: function (item) {
            var cart = readCart();
            cart.push({
                id: item.id || "item-" + Date.now(),
                title: item.title || "Item",
                amount: Number(item.amount) || 0,
                currency: item.currency || "MOP",
                qty: item.qty || 1
            });
            writeCart(cart);
        },
        remove: function (id) {
            writeCart(readCart().filter(function (x) {
                return x.id !== id;
            }));
        },
        clear: function () {
            writeCart([]);
        },
        total: function () {
            return readCart().reduce(function (sum, line) {
                return sum + (Number(line.amount) || 0) * (line.qty || 1);
            }, 0);
        }
    };
})();
