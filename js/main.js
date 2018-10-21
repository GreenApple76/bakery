$(document).ready(function() {
// close mobile navbar menu on link click
$('.nav-link').on('click', function(){
    $('.navbar-toggler-icon').click(); 
});

var subtotal = 0; // track price of all items in cart
var items = 0; // number of unique products in cart
var totalItems = 0; // number of total products in cart
var products = []; // track products in cart (e.g., id, name, quantity, price)

// event handler: when user clicks 'add to cart' button
$(document).on('click', '.btn-cart', function() {
    var $btn = $(this);
    var id = $btn.data('id');
    var name = $btn.data('name');
    var price = $btn.data('price');
    var quantity = $btn.data('quantity');
    var productFound = false; // use to determine if newly added product already
                              // exists in the cart
    
    var productListing = '<p id="' + id + '"><button class="btn btn-sm btn-danger btn-delete" data-id="' + id + '">x</button> &nbsp; <input class="quantity" type="number" value="1" name=' + id + '> ' + name + ' $' + price +
                          ' = $<span>' + price * 1 + '</span></p>';
    subtotal += price;

    // avoid creating duplicate entries within the cart
    for (var i=0; i < products.length; i++) {
        if (products[i].id === id) {
            productFound = true;
            products[i].quantity = Number(products[i].quantity) + Number(quantity);
            // refresh quantity textbox with latest quantity
            $('#'+products[i].id+'>input').attr('value', products[i].quantity);
            updateProductQuantity(id, products[i].quantity, calcTotals);
            break;
        }
    }

    if (productFound) {
        productFound = false;
    // product does not exist in cart - so add it
    } else {
        products.push({id: id,
            name: name,
            price: price,
            quantity: quantity});

        // overwrite cart contents if no other items in the cart
        if (items === 0) {
            $('.cart').html(productListing);
            $('.notify-badge').text(1);
            $('.checkout').html('<button type="submit" class="btn btn-primary">Checkout</button>');
            $('.cart-subtotal').text('Subtotal: $'+subtotal.toFixed(2));
        } else {
            $('.cart').append(productListing);
            // update with new subtotal
            calcTotals();
        }

        items++;
    }
    
    

    
});

// event handler: when user clicks delete item button from cart
$(document).on('click', '.btn-delete', function() {
    var $btn = $(this);
    var id = $btn.data('id');
    $('#'+id).remove();
    items--;

    // remove item from products array
    products = products.filter(function(obj) {
        return obj.id != id;
    });

    // update cart subtotal
    calcTotals();

    // update cart status to empty if there are no more items in the cart
    // reset subtotal and remove subtotal from page
    if (items === 0) {
        subtotal = 0;
        totalItems = 0;
        $('.cart').html('<p>Your shopping cart is currently empty.</p>');
        $('.cart-subtotal').text('');
        $('.notify-badge').text('');
    }
});

// event handler: when user changes product quantity
$(document).on('change', '.quantity', function() {
    var $input = $(this);
    var id = $input[0].name;
    var quantity = $input[0].valueAsNumber;
    // disallow negative quantities from being calculated
    if (quantity < 0) {
        quantity = 0;
        $input.val(0);
    }
    updateProductQuantity(id, quantity, calcTotals);
});

function updateProductQuantity (id, quantity, callback) {
    var result = $.grep(products, function(obj) { return obj.id == id});
    result[0].quantity = quantity;
    callback();
}

function calcTotals () {
    subtotal = 0;
    totalItems = 0;
    $.each(products, function(index, obj) {
        var lineItemTotal = (obj.price * obj.quantity).toFixed(2);
        subtotal += parseFloat(lineItemTotal);
        totalItems += Number(obj.quantity);
        $('#'+obj.id+'>span').text(lineItemTotal);
        $('.notify-badge').text(totalItems);
    });
    $('.cart-subtotal').text('Subtotal: $'+subtotal.toFixed(2));
}
});
