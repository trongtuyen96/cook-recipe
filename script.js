const mealsEls = document.getElementById('meals');
const favoriteContainer = document.getElementById('fav-meals');

const refreshBtn = document.getElementById('btn-refresh');

const searchTerm = document.getElementById('search-term');
const searchBtn = document.getElementById('search');

const mealPopup = document.getElementById('meal-popup');
const mealInfoEl = document.getElementById('meal-info');
const popupCloseBtn = document.getElementById('close-popup');

const areaFilterEl = document.getElementById('li-area');
const selectPopup = document.getElementById('select-popup');
const optionsEl = document.getElementById('options');
const selectPopupCloseBtn = document.getElementById('close-select-popup');

const categoryFilterEl = document.getElementById('li-category');

getRandomMeal();
fetchFavMeals();

async function getRandomMeal() {
    const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');

    const resData = await res.json();

    const randomMeal = resData.meals[0];

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

async function getAreaList() {
    const res = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');

    const resData = await res.json();

    const areaList = resData.meals;

    return areaList;
}

async function getCategoryList() {
    const res = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list');

    const resData = await res.json();

    const categoryList = resData.meals;

    return categoryList;
}

async function getMealsIdByArea(area) {
    const res = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?a=' + area);

    const resData = await res.json();

    const mealsId = resData.meals;

    return mealsId;
}

async function getMealsIdByCategory(cate) {
    const res = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=' + cate);

    const resData = await res.json();

    const mealsId = resData.meals;

    return mealsId;
}

function addMeal(mealData, random = false) {

    // clear random meal
    if (random === true) {
        mealsEls.innerHTML = ``;
    }

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

function getCountryCodeFromName(name) {
    const country = [["Unknown Flag", "EU"], ["Andorran", "AD"], ["United Arab Emirates", "AE"], ["Afghan", "AF"], ["Anguilla", "AI"], ["Albanian", "AL"], ["Armenian", "AM"], ["Angolan", "AO"], ["Argentinian", "AR"], ["Austrian", "AT"], ["Australian", "AU"], ["Azerbaijani", "AZ"], ["Bangladeshi", "BD"], ["Belgian", "BE"], ["Bulgarian", "BG"], ["Bahraini", "BH"], ["Bermuda", "BM"], ["Bruneian", "BN"], ["Bolivian", "BO"], ["Brazilian", "BR"], ["Bahamian", "BS"], ["Bhutanese", "BT"], ["Botswanan", "BW"], ["Belarusan", "BY"], ["Canadian", "CA"], ["Congolese", "CG"], ["Swiss", "CH"], ["Chilean", "CL"], ["Camaroonian", "CM"], ["Chinese", "CN"], ["Colombian", "CO"], ["Costa Rican", "CR"], ["Cuban", "CU"], ["Curacao", "CW"], ["Czech", "CZ"], ["German", "DE"], ["Danish", "DK"], ["Dominican", "DM"], ["Algerian", "DZ"], ["Ecuadorean", "EC"], ["Egyptian", "EG"], ["Spanish", "ES"], ["Ethiopian", "ET"], ["Finnish", "FL"], ["Fijian", "FJ"], ["French", "FR"], ["Garbonese", "GA"], ["British", "GB"], ["Georgian", "GE"], ["Ghanaian", "GH"], ["Greenland", "GL"], ["Guinean", "GN"], ["Greek", "GR"], ["Guam", "GU"], ["Guyanese", "GY"], ["Hong Kong", "HK"], ["Honduran", "HN"], ["Croatian", "HR"], ["Haitian", "HT"], ["Hungarian", "HU"], ["Indonesian", "ID"], ["Irish", "IE"], ["Israeli", "IL"], ["Indian", "TN"], ["Iraqi", "IQ"], ["Icelandic", "IS"], ["Italian", "IT"], ["Jamaican", "JM"], ["Jordanian", "JO"], ["Japanese", "JP"], ["Kenyan", "KE"], ["Kyrgyzstan", "KG"], ["Combodian", "KH"], ["Korean", "KR"], ["Kuwaiti", "KW"], ["Laotian", "LA"], ["Lebanese", "LB"], ["Sri Lankan", "LK"], ["Liberian", "LR"], ["Lesotho", "LS"], ["Latvian", "LV"], ["Libyan", "LY"], ["Moroccan", "MA"], ["Monacan", "MC"], ["Madagascan", "MG"], ["Malian", "ML"], ["Burmese", "MM"], ["Mongolian", "MN"], ["Macao", "MO"], ["Malta", "MT"], ["Maldivian", "MV"], ["Mexican", "MX"], ["Malaysian", "MY"], ["Mozambican", "MZ"], ["Nigerian", "NG"], ["Dutch", "NL"], ["Norwegian", "NO"], ["Nepalese", "NP"], ["New Zealand", "NZ"], ["Omani", "OM"], ["Panamanian", "PA"], ["Peruvian", "PE"], ["Philippine", "PH"], ["Pakistani", "PK"], ["Polish", "PL"], ["Puerto Rico", "PR"], ["Portuguese", "PT"], ["Paraguayan", "PY"], ["Qatari", "QA"], ["Romanian", "RO"],
    ["Russian", "RU"], ["Serbian", "RS"], ["Saudi Arabian", "SA"], ["Sudanese", "SD"], ["Sweden", "SE"], ["Singaporean", "SG"], ["Slovenian", "SI"], ["Senegalese", "SN"], ["Somali", "SO"], ["South Sudan", "SS"], ["Salvadorean", "SV"], ["Syrian", "SY"], ["Thai", "TH"], ["Timor-Leste", "TL"], ["Turkmen", "TM"], ["Tunisian", "TN"], ["Turkish", "TR"], ["Taiwanese", "TW"], ["Ukrainian", "UA"], ["Ugandan", "UG"], ["American", "US"], ["Uruguayan", "UY"], ["Uzbek", "UZ"], ["Venenzuelan", "VE"], ["Virgin Islands", "VG"], ["Vietnamese", "VN"], ["Yemeni", "YE"], ["South African", "ZA"], ["Zambian", "ZM"], ["Zimbabwean", "ZW"]];
    const element = country.find(element => element[0] === name)
    if (element) {
        return element[1];
    }
    else {
        return 'EU';
    }
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

    const countryCode = getCountryCodeFromName(mealData.strArea);

    mealEl.innerHTML = `
    <h1>${mealData.strMeal}</h1>
    <img src="${mealData.strMealThumb}" alt="${mealData.strMealThumb}">
        <h3>
            Country: ${mealData.strArea}
        </h3>
        <img src="https://www.countryflags.io/${countryCode}/flat/64.png" alt="${mealData.strArea}">
        <h3>
            Category: ${mealData.strCategory}
        </h3>
    <p>
        ${mealData.strInstructions}
    </p>
    <h3>Ingredients:</h3>
    <ul>
        ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
    </ul>
    <h3>Source:</h3>
    <a href="${mealData.strSource}">${mealData.strSource}</a>
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

async function showPopupArea(filter) {

    // clear the popup
    optionsEl.innerHTML = ``;

    if (filter === 'area') {
        const countryList = await getAreaList();

        for (let i = 0; i < countryList.length; i++) {
            const countryEl = document.createElement('li');
            const countryCode = getCountryCodeFromName(countryList[i].strArea);
            countryEl.innerHTML = `
        <img src="https://www.countryflags.io/${countryCode}/flat/64.png" alt="${countryList[i].strArea}">
        <span>${countryList[i].strArea}</span>
        `;
            optionsEl.appendChild(countryEl);
            countryEl.addEventListener('click', async () => {
                areaFilterEl.innerHTML = `<img src="https://www.countryflags.io/${countryCode}/flat/64.png" alt="${countryList[i].strArea}">
            <span>${countryList[i].strArea}</span>`
                selectPopup.classList.add('hidden');

                // clear the container    
                mealsEls.innerHTML = "";

                const mealsId = await getMealsIdByArea(countryList[i].strArea);

                if (mealsId) {
                    mealsId.forEach(async (mealId) => {
                        const specMeal = await getMealById(mealId.idMeal);
                        addMeal(specMeal);
                    })
                }
            })
        }
    }
    if(filter === 'category'){
        const categoryList = await getCategoryList();

        for (let i = 0; i < categoryList.length; i++) {
            const categoryEl = document.createElement('li');
          
            categoryEl.innerHTML = `
        <img src="/images/${categoryList[i].strCategory}.png" alt="$${categoryList[i].strCategory}">
        <span>${categoryList[i].strCategory}</span>
        `;
            optionsEl.appendChild(categoryEl);
            categoryEl.addEventListener('click', async () => {
                categoryFilterEl.innerHTML = `
                <img src="/images/${categoryList[i].strCategory}.png" alt="$${categoryList[i].strCategory}">
                <span>${categoryList[i].strCategory}</span>
                `
                selectPopup.classList.add('hidden');

                // clear the container    
                mealsEls.innerHTML = "";

                const mealsId = await getMealsIdByCategory(categoryList[i].strCategory);

                if (mealsId) {
                    mealsId.forEach(async (mealId) => {
                        const specMeal = await getMealById(mealId.idMeal);
                        addMeal(specMeal);
                    })
                }
            })
        }
    }
    selectPopup.classList.remove('hidden');
}

popupCloseBtn.addEventListener('click', () => {
    mealPopup.classList.add('hidden');
});

refreshBtn.addEventListener('click', () => {
    getRandomMeal();
});

areaFilterEl.addEventListener('click', () => {
    showPopupArea('area');
})

categoryFilterEl.addEventListener('click', () => {
    showPopupArea('category');
})

selectPopupCloseBtn.addEventListener('click', () => {
    selectPopup.classList.add('hidden');
});
