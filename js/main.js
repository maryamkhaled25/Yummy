
function hideAll() {
    // $('#heroSec, #allMealsSec, #searchSec, #categoriesSec, #selectedCategSec, #oneMealSec, #areaSec, #ingrediantsSec, #contactUsSec').fadeOut(500)
    $('#heroSec, #allMealsSec, #searchSec, #categoriesSec, #selectedAreaSec , #selectedCategSec, #selectedIngrediantSec, #oneMealSec, #areaSec, #ingrediantsSec, #contactUsSec').addClass('d-none')
}

function closeSidebar() {
    $('.sidebar-nav').animate({ left: `-${navTabsWidth}px` }, 1500);
    $('.fa-xmark').addClass('d-none');
    $('.fa-bars').removeClass('d-none');
    isOpened = false;
    // $('.nav-tabs .links li').animate({ top: "300px" }, 500)
    $('.nav-tabs .links li').animate({ top: '300px', opacity: 1 },2000)


}


$(document).ready(function () {
    closeSidebar();
    showHero();
});


function showHero() {
    hideAll()
    $('#heroSec').removeClass('d-none')
    $('#allMealsSec').removeClass('d-none')
    showAllMeals()
    closeSidebar()
}

function showLoading(fullscreen = false) {
    if (fullscreen) {
        $('#mainLoading').addClass('full');
    } else {
        $('#mainLoading').removeClass('full');
        $('body').css({ overflow: 'hidden' });

    }

    $('#mainLoading').fadeIn(2000);
    if (fullscreen) {
        $('body').css({ overflow: 'hidden' });
    }
}

function hideLoading() {
    $('#mainLoading').fadeOut(2000, function () {
        $('body').css({ overflow: 'auto' });
    });
}





// ================================================
// Sidebar Nav
const navTabsWidth = $('.nav-tabs').outerWidth()
$('.sidebar-nav').css({ left: `-${navTabsWidth}px` })
let isOpened = false

$('.iconClick').on('click', function () {
    if (isOpened) {
        closeSidebar()
    } else {
        $('.sidebar-nav').animate({ left: `0px` }, 1500);
        $('.fa-bars').addClass('d-none')
        $('.fa-xmark').removeClass('d-none')
        isOpened = true
        for (let i = 0; i < $('.nav-tabs .links li').length; i++) {
            $('.nav-tabs .links li').eq(i).animate({ top: 0 }, (i + 5) * 150)
        }
    }
})




// ================================================
// Show all meals
async function showAllMeals() {
    try {
        const result = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`)

        if (!result.ok) {
            throw new Error(`HTTP error! status: ${result.status}`);
        }

        const data = await result.json()
        const dataArr = data.meals
        let cartona = ''
        if (dataArr && dataArr.length > 0) {
            for (let meal of dataArr) {
                cartona += `
                    <div class="col-md-3">
                        <div class="meal" onclick="getMealDetailsById('${meal.idMeal}')">
                            <img src="${meal.strMealThumb}" class="w-100" alt="${meal.strMeal}">
                            <div class="layer d-flex flex-column justify-content-center align-items-center">
                                <h3>${meal.strMeal}</h3>
                                <p>Click To see more</p>
                            </div>
                        </div>
                    </div>
                `

            }
        } else {
            console.warn("No meals found for your search")
            cartona = `<h3 class="text-center text-dark py-5">No meals found</h3>`

        }
        $('#allMealsSec #rowDataAllMeals').html(cartona)


    } catch (err) {
        console.error('Error in fetching results', err);
        $('#searchSec #rowDataSearch').html(`<h3 class="text-center text-danger py-5">Failed to load Meals. Please try again later.</h3>`)
    }
}



// =====================================================
// Search Page

$('#heroBtn').on('click', function () {
    hideAll()
    $('#searchSec').removeClass('d-none')

    // showPage('searchSec')
    // $('#searchSec').fadeIn(500)
})

$('#searchLi').on('click', function () {
    hideAll()
    $('#searchSec').removeClass('d-none')
    closeSidebar()
})


//get input value & search by name
$('#searchNameInput').on('keyup', function () {


    let searchVal = $(this).val()
    showLoading(false)
    searchByName(searchVal)
})

async function searchByName(name) {
    try {
        if (name.trim() === '') {
            $('#searchSec #rowDataSearch').html('')
            return;
        }

        const result = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)

        if (!result.ok) {
            throw new Error(`HTTP error! status: ${result.status}`);
        }

        const data = await result.json()

        const dataArr = data.meals

        let cartona = ''
        if (dataArr && dataArr.length > 0) {
            for (let meal of dataArr) {
                cartona += `
                <div class="col-md-3">
                    <div class="meal" onclick="getMealDetailsById('${meal.idMeal}')">

                        <img src="${meal.strMealThumb}" class="w-100 " alt="">

                        <div class="layer d-flex flex-column justify-content-center align-items-center">
                            <h3>${meal.strMeal}</h3>
                            <p>Click To see more</p>
                        </div>
                    </div>
                </div>
            `
            }
        } else {
            console.warn("No meals found for your search")
            cartona = `<h3 class="text-center text-dark py-5">No meals found</h3>`
        }

        $('#searchSec #rowDataSearch').html(cartona)
    } catch (err) {
        console.error('Error in fetching results', err);
        $('#searchSec #rowDataSearch').html(`<h3 class="text-center text-danger py-5">Failed to load search results. Please try again later.</h3>`)
    } finally {
        hideLoading();
    }

}



//get input value & search by letter
$('#searchLetterInput').on('keyup', function () {
    let searchVal = $(this).val()

    if (searchVal.length === 1 && searchVal.trim() !== '') {
        showLoading(false)
        searchByLetter(searchVal)
    } else if (searchVal.trim() === '') {
        $('#searchSec #rowDataSearch').html('')
    } else {
        $('#searchSec #rowDataSearch').html(`<h3 class="text-center text-dark py-5">Please enter one letter only.</h3>`)
    }
})



async function searchByLetter(char) {
    try {

        const result = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${char}`)

        if (!result.ok) {
            throw new Error(`HTTP error! status: ${result.status}`);
        }

        const data = await result.json()

        let dataArr = data.meals
        let cartona = ''

        if (dataArr && dataArr.length > 0) {
            for (let meal of dataArr) {
                cartona += `
                <div class="col-md-3">
                    <div class="meal" onclick="getMealDetailsById('${meal.idMeal}')">

                        <img src="${meal.strMealThumb}" class="w-100 " alt="">

                        <div class="layer d-flex flex-column justify-content-center align-items-center">
                            <h3>${meal.strMeal}</h3>
                            <p>Click To see more</p>
                        </div>
                    </div>
                </div>
            
            `
            }
        } else {
            console.warn("No meals found for your search")
            cartona = `<h3 class="text-center text-dark py-5">No meals found</h3>`

        }

        $('#searchSec #rowDataSearch').html(cartona)


    } catch (err) {
        console.error('Error in fetching results', err);
        $('#searchSec #rowDataSearch').html(`<h3 class="text-center text-danger py-5">Failed to load search results. Please try again later.</h3>`)
    } finally {
        hideLoading();
    }
}





// =====================================================
// Categories Page
$('#categoriesLi').on('click', function () {
    hideAll()
    $('#categoriesSec').removeClass('d-none')
    closeSidebar()

    showAllCategories()
})

async function showAllCategories() {
    try {
        showLoading(false)
        const result = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)

        if (!result.ok) {
            throw new Error(`HTTP error! status: ${result.status}`);
        }

        const data = await result.json()

        const dataArr = data.categories
        let cartona = ''

        if (dataArr && dataArr.length > 0) {
            for (let categ of dataArr) {
                cartona += `
                 <div class="col-md-3">
                        <div class="meal category-card" data-category="${categ.strCategory}">
                            <img src="${categ.strCategoryThumb}" class="w-100 " alt="Category Meal">
                            <div class="layer d-flex flex-column justify-content-center align-items-center">
                                <h3>${categ.strCategory}</h3>
                                <p>Click To see more</p>
                            </div>
                        </div>
                    </div>
            `
            }
        } else {
            console.warn("No categories found")
            cartona = `<h3 class="text-center text-dark py-5">No categories found</h3>`
        }

        $('#categoriesSec #rowDataCategories').html(cartona)
    } catch (err) {
        console.error('Error in fetching categories', err);
        $('#categoriesSec #rowDataCategories').html(`<h3 class="text-center text-danger py-5">Failed to load categories. Please try again later.</h3>`)
    } finally {
        hideLoading();
    }
}



// =====================================================
// Show meals by category 
$(document).on('click', '.category-card', function () {
    let selectedCategory = $(this).data('category');  // selectedCategory = Beef
    showMealsByCategory(selectedCategory);
});



async function showMealsByCategory(categoryName) {
    hideAll();
    $('#selectedCategSec').removeClass('d-none');
    $('#selectedCategSec .head h1').text(`${categoryName} Category`);

    try {

        showLoading(false)
        const result = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`);
        const data = await result.json();
        const dataArr = data.meals

        let cartona = '';
        dataArr.forEach(meal => {
            cartona += `
            <div class="col-md-3">
                <div class="meal" onclick="getMealDetailsById('${meal.idMeal}')">
                    <img src="${meal.strMealThumb}" class="w-100 " alt="${meal.strMeal}">
                    <div class="layer d-flex flex-column justify-content-center align-items-center">
                        <h3>${meal.strMeal}</h3>
                        <p>Click To see more</p>
                        </div>
                        </div>
            </div>
            `;
        });

        $('#selectedCategSec .row').html(cartona);
    } catch (err) {
        console.error('Error in fetching categories', err);
        $('#selectedCategSec .row').html(`<h3 class="text-center text-danger py-5">Failed to load categories. Please try again later.</h3>`)
    } finally {
        hideLoading();
    }
}






// =====================================================
// Area Page
$('#areaLi').on('click', function () {
    hideAll()
    $('#areaSec').removeClass('d-none')
    closeSidebar()
    getAreas()
})


async function getAreas() {

    showLoading(false)
    const result = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list")
    const data = await result.json()

    const dataArr = data.meals
    console.log(data.meals);

    displayAreas(dataArr)
    hideLoading();

}


function displayAreas(areasArr) {
    let cartona = '';

    areasArr.forEach(area => {
        let areaName = area.strArea;

        let imgName = `${areaName}.png`;

        cartona += `
      <div class="col-md-3">
        <div class="inner">
          <div class="country">
            <img src="./images/flags/${imgName}" class="pb-2" alt="${areaName}-flag">
            <h4>${areaName}</h4>
          </div>
        </div>
      </div>
    `;
    });

    $('#areaSec #rowDataArea').html(cartona);
}




// =====================================================
// Show meals by Area 
$(document).on('click', '.country', async function () {
    let areaName = $(this).find('h4').text();

    hideAll()
    $('#selectedAreaSec').removeClass('d-none');

    $('#selectedAreaSec .head h1').text(`${areaName} Meals`);


    showLoading(false)
    const result = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaName}`);
    const data = await result.json();
    const dataArr = data.meals

    displayMeals(dataArr);
    hideLoading();

});

function displayMeals(mealsArr) {
    let cartona = '';

    mealsArr.forEach(meal => {
        cartona += `
        <div class="col-md-3">
            <div class="mealOne" data-id="${meal.idMeal}">
                <img src="${meal.strMealThumb}" class="w-100" alt="${meal.strMeal}">
                <div class="layer d-flex flex-column justify-content-center align-items-center">
                    <h3>${meal.strMeal}</h3>
                    <p>Click To see more</p>
                </div>
            </div>
        </div>
        `;
    });

    $('#selectedAreaSec .row').html(cartona);
}





// =====================================================
// Show one meal 
$(document).on('click', '.mealOne', function () {
    let mealId = $(this).attr('data-id');
    getMealDetails(mealId);
});

async function getMealDetails(mealId) {

    hideAll()
    $('#selectedAreaSec').removeClass('d-none');
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    const data = await res.json();
    const meal = data.meals[0];

    displayMealDetails(meal);

}

function displayMealDetails(meal) {
    hideAll();
    $('#oneMealSec').removeClass('d-none');

    let ingredients = '';
    for (let i = 1; i <= 20; i++) {
        const ing = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ing && ing.trim() !== "") {
            ingredients += `<li class="border-1">${measure} ${ing}</li>`;
        }
    }

    let tags = '';
    if (meal.strTags) {
        const tagsArr = meal.strTags.split(',');
        tagsArr.forEach(tag => {
            tags += `<li class="border-1">${tag}</li>`;
        });
    } else {
        tags = '<li class="border-1">No Tags</li>';
    }

    let cartona = `
         <div class="row py-5">
            <div class="col-md-5 px-3">
                <img src='${meal.strMealThumb}' class="w-100 rounded-3" alt="meal-img">
                <div class="ingrediants-details pt-3 pb-1">
                    <h3 class="ingrediants text-dark">Ingrediants:</h3>
                    <ul class="list-unstyled text-dark-emphasis flex-wrap d-flex">
                        ${ingredients}
                    </ul>
                </div>
                <div class="tags-details pt-1">
                    <h3 class="tags text-dark">Tags:</h3>
                    <ul class="list-unstyled text-dark-emphasis flex-wrap d-flex">
                        ${tags}
                    </ul>
                </div>
            </div>

            <div class="col-md-7">
                <h2 class="recipeName text-danger ">${meal.strMeal}</h2>

                <h3 class="instructures text-dark">Instructions:</h3>
                <p class="text-dark-emphasis">${meal.strInstructions}</p>

                <div class="recipe-details d-flex justify-content-around">
                    <div class="area d-flex align-items-center gap-2">
                        <h3 class="text-dark">Area: </h3>
                        <span class="text-dark-emphasis">${meal.strArea}</span>
                    </div>
                    <div class="category d-flex align-items-center gap-2">
                        <h3 class="text-dark">Category: </h3>
                        <span class="text-dark-emphasis">${meal.strCategory}</span>
                    </div>
                </div>

                <div class="btngroup text-center ">
                    <button onclick='SrcBtn("${meal.strSource}")' class="src-btn btn btn-success mx-3"> Source </button>
                    <button onclick='YouBtn("${meal.strYoutube}")' class="you-btn btn btn-danger "> Youtube </button>
                </div>
            </div>
        </div>
    `;

    $('#oneMealSec .container').html(cartona);
}


function SrcBtn(strSource) {
    window.open(strSource, '_blank');
}

function YouBtn(strYoutube) {
    window.open(strYoutube, '_blank');
}


// =====================================================
// Ingrediants Page

$('#ingredientsLi').on('click', function () {
    hideAll()
    $('#ingrediantsSec').removeClass('d-none')
    closeSidebar()
    showAllIngrediants()
})

async function showAllIngrediants() {
    try {

        showLoading(false)
        const result = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)

        if (!result.ok) {
            throw new Error(`HTTP error! status: ${result.status}`);
        }

        const data = await result.json()

        const dataArr = data.meals.slice(0, 20)
        let cartona = ''

        if (dataArr && dataArr.length > 0) {
            for (let ingred of dataArr) {
                cartona += `
                        <div class="col-md-3">
                            <div class="ingred text-center cursor-pointer" onclick="getMealsByIngredient('${ingred.strIngredient}')">
                                <img src="https://www.themealdb.com/images/ingredients/${ingred.strIngredient}.png" class="w-100 mb-2" alt="${ingred.strIngredient}">
                                <div class="text">
                                    <h3>${ingred.strIngredient}</h3>
                                    <p>${ingred.strDescription ? ingred.strDescription.split(" ").slice(0, 15).join(" ") + '...' : 'No description available.'}</p>
                                </div>
                            </div>
                        </div>
                `

            }
        } else {
            console.warn("No ingredients found")
            cartona = `<h3 class="text-center text-dark py-5">No ingredients found</h3>`
        }

        $('#ingrediantsSec #rowDataIngrediants').html(cartona)

    } catch (err) {
        console.error('Error fetching ingredients:', err);
        $('#ingrediantsSec #rowDataIngrediants').html(`<h3 class="text-center text-danger py-5">Failed to load ingredients. Please try again later.</h3>`)
    } finally {
        hideLoading();
    }
}




// =====================================================
// Show meals by Ingrediants 
async function getMealDetailsById(id) {
    try {

        showLoading(false)
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await res.json();
        const meal = data.meals[0];
        displayMealDetails(meal);
        hideLoading();

    } catch (err) {
        console.error('Error fetching meal details:', err);
    }
}


async function getMealsByIngredient(ingredientName) {
    hideAll();
    $('#selectedIngrediantSec').removeClass('d-none');
    $('#selectedIngrediantSec .head h1').text(`${ingredientName} Ingredient Meals`)

    try {
        showLoading(false)
        const result = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientName}`);
        const data = await result.json();
        const dataArr = data.meals

        let cartona = '';

        if (dataArr && dataArr.length > 0) {
            for (let meal of dataArr) {
                cartona += `
                    <div class="col-md-3">
                        <div class="meal text-center" onclick="getMealDetailsById('${meal.idMeal}')">
                            <img src="${meal.strMealThumb}" class="w-100 rounded " alt="${meal.strMeal}">
                             <div class="layer d-flex flex-column justify-content-center align-items-center">
                                <h3>${meal.strMeal}</h3>
                                <p>Click To see more</p>
                            </div>
                        </div>
                    </div>
                `;
            }
        } else {
            cartona = `<h3 class="text-center text-dark py-5">No meals found with "${ingredientName}"</h3>`;
        }

        $('#rowDataSelectedIngrediants').html(cartona);
    } catch (err) {
        console.error('Error fetching meals by ingredient:', err);
        $('#rowDataSelectedIngrediants').html(`<h3 class="text-center text-danger py-5">Failed to load meals.</h3>`);
    } finally {
        hideLoading();
    }
}






// =====================================================
// Contact Us Page

$('#contactUsLi').on('click', function () {
    hideAll()
    $('#contactUsSec').removeClass('d-none')
    closeSidebar()
    showContactUs()
})


function validateName() {
    let nameVal = $('#nameInput').val()
    let regex = /^[A-Z][a-zA-Z\s]{2,}$/

    if (regex.test(nameVal)) {
        $('#nameMsg').addClass('d-none')
        $('#nameInput').addClass('is-valid')
        $('#nameInput').removeClass('is-invalid')
        return true
    } else {
        $('#nameMsg').removeClass('d-none')
        $('#nameInput').removeClass('is-valid')
        $('#nameInput').addClass('is-invalid')
        return false
    }

}

function validateEmail() {
    let emailVal = $('#emailInput').val()
    let regex = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook)\.com$/

    if (regex.test(emailVal)) {
        $('#emailMsg').addClass('d-none')
        $('#emailInput').addClass('is-valid')
        $('#emailInput').removeClass('is-invalid')
        return true
    } else {
        $('#emailMsg').removeClass('d-none')
        $('#emailInput').removeClass('is-valid')
        $('#emailInput').addClass('is-invalid')
        return false
    }

}


function validatePassword() {
    let passwordVal = $('#passwordInput').val()
    let regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/

    if (regex.test(passwordVal)) {
        $('#passwordMsg').addClass('d-none')
        $('#passwordInput').addClass('is-valid')
        $('#passwordInput').removeClass('is-invalid')
        return true
    } else {
        $('#passwordMsg').removeClass('d-none')
        $('#passwordInput').removeClass('is-valid')
        $('#passwordInput').addClass('is-invalid')
        return false
    }

}


function validateRePassword() {
    let passwordVal = $('#passwordInput').val()
    let rePasswordVal = $('#rePasswordInput').val()

    if (passwordVal === rePasswordVal && rePasswordVal !== '') {
        $('#rePasswordMsg').addClass('d-none')
        $('#rePasswordInput').addClass('is-valid')
        $('#rePasswordInput').removeClass('is-invalid')
        return true
    } else {
        $('#rePasswordMsg').removeClass('d-none')
        $('#rePasswordInput').removeClass('is-valid')
        $('#rePasswordInput').addClass('is-invalid')
        return false
    }
}


function validatePhone() {
    let phoneVal = $('#phoneInput').val()
    let regex = /^01\d{9}$/

    if (regex.test(phoneVal)) {
        $('#phoneMsg').addClass('d-none')
        $('#phoneInput').addClass('is-valid')
        $('#phoneInput').removeClass('is-invalid')
        return true
    } else {
        $('#phoneMsg').removeClass('d-none')
        $('#phoneInput').removeClass('is-valid')
        $('#phoneInput').addClass('is-invalid')
        return false
    }

}


function validateAge() {
    let ageVal = $('#ageInput').val()
    if (parseInt(ageVal) > 2) {
        $('#ageMsg').addClass('d-none')
        $('#ageInput').addClass('is-valid')
        $('#ageInput').removeClass('is-invalid')
        return true
    } else {
        $('#ageMsg').removeClass('d-none')
        $('#ageInput').removeClass('is-valid')
        $('#ageInput').addClass('is-invalid')
        return false
    }

}



function checkValidation() {
    if (validateName() && validateEmail() && validatePassword() &&
        validateRePassword() && validatePhone() && validateAge()) {
        $('#submitBtn').removeClass('disabled')
    } else {
        $('#submitBtn').addClass('disabled')

    }
}



$('#nameInput').on('input', function () {
    validateName()
    checkValidation()
})
$(' #emailInput').on('input', function () {
    validateEmail()
    checkValidation()
})
$('#passwordInput').on('input', function () {
    validatePassword()
    checkValidation()
})
$('#rePasswordInput').on('input', function () {
    validateRePassword()
    checkValidation()
})
$('#phoneInput').on('input', function () {
    validatePhone()
    checkValidation()
})
$('#ageInput').on('input', function () {
    validateAge()
    checkValidation()
})


function submitAll() {
    if (!$('#submitBtn').hasClass('disabled')) {
        $('#ageInput, #phoneInput, #rePasswordInput, #passwordInput, #emailInput, #nameInput').removeClass('is-valid')

        $('#rowDataContact').html(`<h3 class="text-center text-dark border w-50 h-50 border-black  py-5">Thanks for your submission...</h3>`)
    }
}














// =====================================================
// Loading screen

jQuery(async function () {

    showLoading(true);
    showHero();
    hideLoading();


})
