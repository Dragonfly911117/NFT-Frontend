let shopping = [];
let allShop = [];

// Display shopping cart content
function displayShopping(coupon = 1) {
    // Retrieve the shopping cart data from the query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const cartParam = urlParams.get('cart');
    if (cartParam) {
        try {
            // Parse the JSON string to get the shopping cart array
            shopping = JSON.parse(decodeURIComponent(cartParam));
            allShop = [];
        } catch (error) {
            console.error('Error parsing shopping cart data:', error);
        }
    }

    // Perform checkout logic with the shopping cart data
    console.log('Checkout successful! Items purchased:', shopping);
    
    var cartItem = document.getElementById('cartItem'); // Corrected ID here
    cartItem.innerHTML = '';
    // Add table headers
    var headerRow = cartItem.insertRow(0);
    headerRow.innerHTML = '<th>Product Name</th><th>Quantity</th><th>Price</th>';

    var cost = 0;

    // Add table content
    shopping.forEach(function (item, index) {
        var row = cartItem.insertRow(index + 1); // Index + 1 to skip the header row
        row.innerHTML = `<td>${item.name}</td><td>${item.quantity}</td><td>${item.quantity * item.price}</td>`;
        cost += item.quantity * item.price;
        if (!allShop.includes(item.shopID)) {
            allShop.push(item.shopID);
        }
    });
    console.log(allShop);
    console.log(cost);
    console.log(coupon);
    console.log(cost * coupon);
    const totalCost = document.getElementById('totalCost');
    totalCost.innerHTML = `<h2>total cost: ${cost * coupon}</h2>`;
}

// Apply coupon function
async function applyCoupon() {
    var couponInput = document.getElementById('coupon');
    var message = document.getElementById('message');
    let resultPromise = getCurrentCoupons();
    let nowCoupons = await resultPromise;
    console.log(nowCoupons);
    let usingCoupon = false;

    if (nowCoupons && nowCoupons.coupons) {
        for (let index = 0; index < nowCoupons.coupons.length; index++) {
            const element = nowCoupons.coupons[index];
            if (couponInput.value.trim() === element.coupon_code) {
                message.textContent = 'Coupon applied successfully! Use Coupon: ' + element.coupon_code;
                displayShopping((100 - element.discount) / 100);
                usingCoupon = true;
                break;
            }
        }
    }
    if (! usingCoupon) {
        message.textContent = 'Invalid coupon code.';
        displayShopping();
    }
}

function getCookie(cookieName) {
    const cookies = document.cookie;
    const cookieArray = cookies.split('; ');
    const tokenCookie = cookieArray.find(row => row.startsWith(cookieName + '='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
}

async function getCurrentCoupons() {
    console.log('Get Current Counpons');
    try {
        const baseURL = `http://localhost:8000/api/coupon/`;
        const url = new URL(baseURL);
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (response.ok) {
            const jsonResponse = await response.json();
            console.log(jsonResponse);
            console.log('Success Get Current Coupons');
            return jsonResponse;
        } else {
            console.log('No coupons now');
            return null;
        }
    } catch (error) {
        console.error('Get Counpons API Error', error);
    }
}

// Checkout function
function checkout() {
    console.log('Checkout successful! Items purchased:', shopping);
    alert('Checkout successful!');
    clearShoppingCartCookie();
    window.location.href = '../home/Index.html';
}

// Continue shopping function
function continueShopping() {
    window.location.href = '../home/Index.html';
}


displayShopping();
