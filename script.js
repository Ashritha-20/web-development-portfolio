let cars = JSON.parse(localStorage.getItem('cars')) || [
    { name: "Vintage Mustang", price: "₹5,000", category: "vintage", img: "2022-Tesla-Model-S.png" },
    { name: "Vintage Rolls Royce", price: "₹7,000", category: "vintage", img: "Ford-Mustang.avif" },
    { name: "BMW Luxury", price: "₹10,000", category: "luxury", img: "Luxury.jpg" },
    { name: "Mercedes Luxury", price: "₹12,000", category: "luxury", img: "BMW_XM_SUV.avif" },
    { name: "Lamborghini Super Luxury", price: "₹20,000", category: "superluxury", img: "Mercedes-Benz-S-Class.jpg" },
    { name: "Ferrari Super Luxury", price: "₹22,000", category: "superluxury", img: "Sedans.jpg" }
];

let orders = JSON.parse(localStorage.getItem('orders')) || [];
let selectedCar = null;

function showPage(page) {
    document.querySelectorAll('section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(page).classList.remove('hidden');

    if (page === 'home') renderCars('allCars', cars);
    if (page === 'vintage') renderCars('vintageCars', cars.filter(c => c.category === 'vintage'));
    if (page === 'luxury') renderCars('luxuryCars', cars.filter(c => c.category === 'luxury'));
    if (page === 'superluxury') renderCars('superluxuryCars', cars.filter(c => c.category === 'superluxury'));
    if (page === 'adminPanel') renderAdminCars();
}

function renderCars(containerId, data) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    data.forEach((car) => {
        const card = document.createElement('div');
        card.className = 'car-card';
        card.innerHTML = `
            <img src="${car.img}">
            <h3>${car.name}</h3>
            <p>${car.price}</p>
            <button class="buy" onclick="buyCar(${getOriginalIndex(car)})">Buy Now</button>
        `;
        container.appendChild(card);
    });
}

function buyCar(index) {
    selectedCar = cars[index];
    showPage('buySection');
}

function confirmOrder() {
    const name = document.getElementById('custName').value;
    const email = document.getElementById('custEmail').value;
    const phone = document.getElementById('custPhone').value;

    if (!name || !email || !phone) {
        alert("Please fill all details.");
        return;
    }

    orders.push({ customerName: name, email, phone, car: selectedCar });
    localStorage.setItem('orders', JSON.stringify(orders));

    alert("Order Confirmed Successfully!");
    showPage('home');
}

function loginAdmin() {
    const user = document.getElementById('adminUser').value;
    const pass = document.getElementById('adminPass').value;

    if (user === "admin" && pass === "1234") {
        showPage('adminPanel');
        renderAdminCars();
        renderOrders();
    } else {
        alert("Invalid credentials");
    }
}

function addCar() {
    const name = document.getElementById('carName').value;
    const price = document.getElementById('carPrice').value;
    const cat = document.getElementById('carCategory').value;
    const img = document.getElementById('carImg').value;
    const desc = document.getElementById('carDesc').value;

    if (!name || !price || !img) {
        alert("Fill all fields");
        return;
    }

    cars.push({ name, price, category: cat, img, description: desc });
    localStorage.setItem('cars', JSON.stringify(cars));

    alert("Car Added Successfully!");
    renderAdminCars();
}

function renderAdminCars() {
    const container = document.getElementById('adminCarList');
    container.innerHTML = '';

    cars.forEach((car, idx) => {
        const card = document.createElement('div');
        card.className = 'car-card';
        card.innerHTML = `
            <img src="${car.img}">
            <h3>${car.name}</h3>
            <p>${car.price}</p>
            <p style="font-size:14px;font-style:italic;">
                ${car.category.charAt(0).toUpperCase() + car.category.slice(1)}
            </p>
            <p style="font-size:13px">${car.description || ''}</p>
            <button class="delete" onclick="deleteCar(${idx})">Delete</button>
        `;
        container.appendChild(card);
    });
}

function deleteCar(index) {
    if (confirm("Are you sure you want to delete this car?")) {
        cars.splice(index, 1);
        localStorage.setItem('cars', JSON.stringify(cars));

        renderAdminCars();
        renderCars('allCars', cars);
        renderCars('vintageCars', cars.filter(c => c.category === 'vintage'));
        renderCars('luxuryCars', cars.filter(c => c.category === 'luxury'));
        renderCars('superluxuryCars', cars.filter(c => c.category === 'superluxury'));
    }
}

function renderOrders() {
    const list = document.getElementById('orderList');
    list.innerHTML = '';

    orders.forEach(o => {
        const li = document.createElement('li');
        li.textContent = `${o.customerName} ordered ${o.car.name}`;
        list.appendChild(li);
    });
}

function getOriginalIndex(carObj) {
    return cars.findIndex(car =>
        car.name === carObj.name &&
        car.price === carObj.price &&
        car.category === carObj.category &&
        car.img === carObj.img
    );
}

showPage('home');
