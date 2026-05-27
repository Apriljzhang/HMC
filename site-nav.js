function toggleMenu() {
    var nav = document.getElementById("navLinks");
    if (nav) nav.classList.toggle("active");
}

function updateCartBadge() {
    var el = document.getElementById("cartBadge");
    if (!el || typeof PrinceCart === "undefined") return;
    var n = PrinceCart.count();
    el.textContent = String(n);
    el.classList.toggle("cart-badge--empty", n === 0);
}

document.addEventListener("DOMContentLoaded", function () {
    updateCartBadge();
});

window.updateCartBadge = updateCartBadge;
