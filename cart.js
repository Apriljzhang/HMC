/**
 * Prince Education site cart (browser localStorage only).
 * Checkout completes on the official AALA registration portal for card payment.
 */
(function () {
    var STORAGE_KEY = "princeEducationCartV1";

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
        if (typeof window.updateCartBadge === "function") {
            window.updateCartBadge();
        }
    }

    function countItems(items) {
        return items.reduce(function (sum, line) {
            return sum + (line.qty || 1);
        }, 0);
    }

    window.PrinceCart = {
        get: readCart,
        count: function () {
            return countItems(readCart());
        },
        add: function (item) {
            var cart = readCart();
            var id = item.id;
            var found = -1;
            for (var i = 0; i < cart.length; i++) {
                if (cart[i].id === id) {
                    found = i;
                    break;
                }
            }
            if (found >= 0) {
                cart[found].qty = (cart[found].qty || 1) + (item.qty || 1);
            } else {
                cart.push({
                    id: id,
                    title: item.title || "Item",
                    note: item.note || "",
                    priceNote: item.priceNote || "",
                    qty: item.qty || 1
                });
            }
            writeCart(cart);
        },
        remove: function (id) {
            writeCart(readCart().filter(function (x) {
                return x.id !== id;
            }));
        },
        setQty: function (id, qty) {
            var n = parseInt(qty, 10);
            if (isNaN(n) || n < 1) n = 1;
            var cart = readCart().map(function (x) {
                if (x.id === id) return Object.assign({}, x, { qty: n });
                return x;
            });
            writeCart(cart);
        },
        clear: function () {
            writeCart([]);
        }
    };
})();
