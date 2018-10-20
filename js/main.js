$(document).ready(function() {
// close mobile navbar menu on link click
$('.nav-link').on('click', function(){
    $('.navbar-toggler-icon').click(); 
});

var subtotal = 0; // track price of all items in cart
var items = 0; // number of unique products in cart
var products = []; // track products in cart (e.g., id, name, quantity, price)

// event handler: when user clicks 'add to cart' button
$(document).on('click', '.btn-cart', function() {
    var $btn = $(this);
    var id = $btn.data('id');
    var name = $btn.data('name');
    var price = $btn.data('price');
    var quantity = $btn.data('quantity');

    products.push({id: id,
                   name: name,
                   price: price,
                   quantity: quantity});

    var productListing = '<p id="' + id + '"><button class="btn btn-sm btn-danger btn-delete" data-id="' + id + '">x</button> &nbsp; <input class="quantity" type="number" value="1" name=' + id + '> ' + name + ' $' + price +
                          ' = $' + price * 1 + '</p>';

    // overwrite cart contents if no other items in the cart
    if (items === 0) {
        $('.cart').html(productListing);
    } else {
        $('.cart').append(productListing);
    }

    items++;
    subtotal += price;
});

// event handler: when user clicks delete item button from cart
$(document).on('click', '.btn-delete', function() {
    var $btn = $(this);
    var id = $btn.data('id');
    $('#'+id).remove();
    items--;

    // update cart status to empty if there are no more items in the cart
    if (items === 0) {
        $('.cart').html('<p>Your shopping cart is currently empty.</p>');
    }
});

// event handler: when user changes product quantity
$(document).on('change', '.quantity', function() {
    var $input = $(this);
    var id = $input[0].name;
    var quantity = $input[0].valueAsNumber;
    updateProductQuantity(id, quantity);
});

function updateProductQuantity (id, quantity) {
    var result = $.grep(products, function(obj) { return obj.id == id});
    result[0].quantity = quantity;
    console.log('obj quantity updated to', result[0].quantity);
};

});
