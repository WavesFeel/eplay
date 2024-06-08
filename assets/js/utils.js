// document.addEventListener('DOMContentLoaded', () => {
//     const cardsContainer = document.querySelector('.cards');

//     fetch('data.json')
//         .then(response => response.json())
//         .then(data => {
//             const restaurants = data.restaurants;
//             const page = getPageType();
            
//             if (page === 'index') {
//                 renderRestaurantCards(restaurants);
//             } else if (page === 'menu') {
//                 const restaurantId = getQueryParameter('restaurantId');
//                 renderMenuCards(restaurants, restaurantId);
//             } else if (page === 'food') {
//                 const restaurantId = getQueryParameter('restaurantId');
//                 const dishType = getQueryParameter('dishType');
//                 renderFoodCards(restaurants, restaurantId, dishType);
//             } else if (page === 'card') {
//                 const restaurantId = getQueryParameter('restaurantId');
//                 const dishId = getQueryParameter('dishId');
//                 renderDishDetail(restaurants, restaurantId, dishId);
//             }
//         })
//         .catch(error => console.error('Error fetching the data:', error));
// });

// Здесь происходит вызов функции перевода
function renderMenuCards(restaurants, restaurantId) {
    const restaurant = restaurants.find(r => r.id == restaurantId);
    if (restaurant) {
        const cardsContainer = document.querySelector('.cards');
        Object.keys(restaurant.menu).forEach(dishType => {
            const card = document.createElement('a');
            card.classList.add('card');
            card.href = `Food.html?restaurantId=${restaurantId}&dishType=${dishType}`;
            card.innerHTML = `
                <img src="${restaurant.menu[dishType][0]?.image || 'assets/images/default.jpg'}" alt="${dishType}" class="card_img">
                <p class="card_title">${translateDishType(dishType)}</p> // Здесь используем переведенное название
            `;
            cardsContainer.appendChild(card);
        });
    }
}

// Функция перевода категорий блюд
function translateDishType(dishType) {
    switch(dishType) {
        case "firstDishes":
            return "Первые блюда";
        case "secondDishes":
            return "Вторые блюда";
        case "salads":
            return "Салаты";
        case "desserts":
            return "Десерты";
        default:
            return dishType; // Если категория не известна, возвращаем исходное название
    }
}
