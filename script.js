const mealsEls = document.getElementById('meals');
const favoriteContainer = document.getElementById('fav-meals');

const refreshBtn = document.getElementById('btn-refresh');

const searchTerm = document.getElementById('search-term');
const searchBtn = document.getElementById('search');

const mealPopup = document.getElementById('meal-popup');
const mealInfoEl = document.getElementById('meal-info');
const popupCloseBtn = document.getElementById('close-popup');

getRandomMeal();
fetchFavMeals();

async function getRandomMeal() {
    const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const resData = await res.json();
    const randomMeal = resData.meals[0];

    console.log(randomMeal)
    addMeal(randomMeal, true);
}

async function getMealById(id) {
    const res = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id);

    const resData = await res.json();

    const meal = resData.meals[0];

    return meal;
}

async function getMealsBySearch(term) {
    const res = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + term);

    const resData = await res.json();

    const meals = resData.meals;

    return meals;
}

function addMeal(mealData, random = false) {

    // clear random meal
    mealsEls.innerHTML = ``;

    const meal = document.createElement('div');
    meal.classList.add('meal');

    meal.innerHTML = `
    <div class="meal-header">
        ${random ? `<span class="random">
            Random Recipe
        </span>` : ''}
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
    </div>
    <div class="meal-body">
        <h4>${mealData.strMeal}</h4>
        <button class="fav-btn">
            <i class="fas fa-heart">
            </i>
        </button>
    </div>`;

    const btn = meal.querySelector('.meal-body .fav-btn');
    btn.addEventListener('click', () => {
        if (btn.classList.contains('active')) {
            removeMealLS(mealData.idMeal)
            btn.classList.remove("active");
        } else {
            addMealLS(mealData.idMeal)
            btn.classList.add("active");
        }

        fetchFavMeals();
    });

    const mealHeader = meal.querySelector('.meal-header')
    mealHeader.addEventListener('click', () => {
        showMealInfo(mealData);
    });

    mealsEls.appendChild(meal);
}

function addMealLS(mealId) {
    const mealIds = getMealsLS();

    localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]));
}

function removeMealLS(mealId) {
    const mealIds = getMealsLS();

    localStorage.setItem('mealIds', JSON.stringify(mealIds.filter(id => id !== mealId)));
}

function getMealsLS() {
    const mealIds = JSON.parse(localStorage.getItem('mealIds'));

    return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals() {
    // clean the container
    favoriteContainer.innerHTML = "";
    const mealIds = getMealsLS();

    const meals = [];

    for (let i = 0; i < mealIds.length; i++) {
        const mealId = mealIds[i];
        meal = await getMealById(mealId);

        addMealFav(meal);
    }
}

function addMealFav(mealData) {
    const favMeal = document.createElement('li');

    favMeal.innerHTML = `
    <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
    <span>${mealData.strMeal}</span>
    <button class="clear"><i class="fas fa-window-close"></i></button>`;


    const btn = favMeal.querySelector('.clear');

    btn.addEventListener('click', () => {
        removeMealLS(mealData.idMeal);

        fetchFavMeals();
    })

    const mealThumb = favMeal.querySelector('img');
    mealThumb.addEventListener('click', () => {
        showMealInfo(mealData);
    })

    favoriteContainer.appendChild(favMeal);
}

function showMealInfo(mealData) {
    // clean it up
    mealInfoEl.innerHTML = "";

    // update meal info
    const mealEl = document.createElement('div');

    const ingredients = [];

    // add ingredients and measures
    for (let i = 1; i <= 20; i++) {
        if (mealData['strIngredient' + i]) {
            ingredients.push(`${mealData['strIngredient' + i]} / ${mealData['strMeasure' + i]}`);
        } else {
            break;
        }
    }

    mealEl.innerHTML = `<h1>${mealData.strMeal}</h1>
    <img src="${mealData.strMealThumb}" alt="${mealData.strMealThumb}">
    <h3>
    Country: ${mealData.strArea}
    </h3>
    <h3>
    Category: ${mealData.strCategory}
    </h3>
    <p>
    ${mealData.strInstructions}
    </p>
    <h3>Ingredients:</h3>
    <ul>
    ${ingredients.map((ing) => `
    <li>${ing}</li>`).join("")}
    </ul>
    `;

    mealInfoEl.appendChild(mealEl);

    mealPopup.classList.remove('hidden');
}

searchBtn.addEventListener('click', async () => {
    // clear the container    
    mealsEls.innerHTML = "";

    const search = searchTerm.value;

    const meals = await getMealsBySearch(search);

    if (meals) {
        meals.forEach((meal) => {
            addMeal(meal);
        })
    }
})

popupCloseBtn.addEventListener('click', () => {
    mealPopup.classList.add('hidden');
});

refreshBtn.addEventListener('click', () => {
    getRandomMeal();
});