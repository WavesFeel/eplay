console.log('Script loaded');
// alert('test'); // Тестовый alert
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    const cardsContainer = document.querySelector('.cards');

    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Data loaded:', data); // Отладочное сообщение
            const restaurants = data.restaurants;
            const page = getPageType();

            if (page === 'index') {
                console.log('Rendering restaurant cards for index page'); // Отладочное сообщение
                renderRestaurantCards(restaurants);
            } else if (page === 'menu') {
                const restaurantId = getQueryParameter('restaurantId');
                renderMenuCards(restaurants, restaurantId);
            } else if (page === 'food') {
                const restaurantId = getQueryParameter('restaurantId');
                const dishType = getQueryParameter('dishType');
                renderFoodCards(restaurants, restaurantId, dishType);
            } else if (page === 'card') {
                const restaurantId = getQueryParameter('restaurantId');
                const dishId = getQueryParameter('dishId');
                renderDishDetail(restaurants, restaurantId, dishId);
            }
        })
        .catch(error => console.error('Error fetching the data:', error));
});

function getPageType() {
    const path = window.location.pathname;
    if (path === '/' || path.includes('index.html') || path === '/Restaurant/') {
        return 'index';
    } else if (path.includes('Menu.html')) {
        return 'menu';
    } else if (path.includes('Food.html')) {
        return 'food';
    } else if (path.includes('Card.html')) {
        return 'card';
    }
}


function getQueryParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function renderRestaurantCards(restaurants) {
    const cardsContainer = document.querySelector('.cards');
    if (!cardsContainer) {
        console.error('No cards container found');
        return;
    }
    console.log('Rendering cards:', restaurants);

    restaurants.forEach(restaurant => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card_img_block">
                <img src="${restaurant.image || '/assets/images/default-restaurant.jpg'}" alt="${restaurant.name}" class="card_img">
            </div>
            <p class="card_inner_title">${restaurant.name}</p>
            <p class="card_inner_dec">${restaurant.desc}</p>
        `;
        card.addEventListener('click', () => {
            window.location.href = `Menu.html?restaurantId=${restaurant.id}`;
        });
        cardsContainer.appendChild(card);
    });
}


function renderMenuCards(restaurants, restaurantId) {
    const restaurant = restaurants.find(r => r.id == restaurantId);
    if (restaurant) {
        const cardsContainer = document.querySelector('.cards');
        Object.keys(restaurant.menu).forEach(dishType => {
            const card = document.createElement('a');
            card.classList.add('card');
            card.href = `Food.html?restaurantId=${restaurantId}&dishType=${dishType}`;
            card.innerHTML = `
                <img src="${restaurant.menu[dishType][0]?.image || 'assets/images/default-dish.jpg'}" alt="${dishType}" class="card_img">
                <p class="card_title">${translateDishType(dishType)}</p>
            `;
            cardsContainer.appendChild(card);
        });
    }
}

function renderFoodCards(restaurants, restaurantId, dishType) {
    const restaurant = restaurants.find(r => r.id == restaurantId);
    if (restaurant && restaurant.menu[dishType]) {
        const cardsContainer = document.querySelector('.cards');
        restaurant.menu[dishType].forEach(dish => {
            const card = document.createElement('a');
            card.classList.add('card');
            card.href = `Card.html?restaurantId=${restaurantId}&dishId=${dish.id}`;
            card.innerHTML = `
                <img src="${dish.image}" alt="${dish.title}" class="card_img">
                <p class="card_title">${dish.title}</p>
            `;
            cardsContainer.appendChild(card);
        });
    }
}

function renderDishDetail(restaurants, restaurantId, dishId) {
    const restaurant = restaurants.find(r => r.id == restaurantId);
    if (restaurant) {
        let dish;
        Object.keys(restaurant.menu).forEach(dishType => {
            if (!dish) {
                dish = restaurant.menu[dishType].find(d => d.id == dishId);
            }
        });

        if (dish) {
            const cardContainer = document.querySelector('.card');
            cardContainer.innerHTML = `
                <img class="card_img" src="${dish.image}" alt="${dish.title}">
                <div class="card_left">
                    <p class="card_title">${dish.title}</p>
                    <p class="card_price">${dish.price}</p>
                    <p class="card_dec">${dish.description}</p>
                    <div class="btns">
                        <button class="btn">Время ожидания ${dish.waitTime}</button>
                        <button class="btn">Добавить в избранное</button>
                    </div>
                </div>
            `;
        }
    }
}
