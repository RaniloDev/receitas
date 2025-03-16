const input = document.querySelector(".search-input");
const form = document.querySelector(".search-form");
const recipeList = document.querySelector(".recipe-list");
const recipeDetails = document.querySelector(".recipe-details");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const inputValue = event.target[0].value.trim();
  if (inputValue) {
    searchRecipes(inputValue);
  }
});

async function searchRecipes(ingredient) {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${ingredient}`
    );
    const data = await response.json();

    if (data.meals) {
      showRecipes(data.meals);
    } else {
      recipeList.innerHTML =
        "<p>No recipes found. Try another ingredient.</p>";
    }
  } catch (error) {
    console.error("Erro ao buscar receitas:", error);
    recipeList.innerHTML = "<p>An error occurred while fetching recipes.</p>";
  }
}

const showRecipes = (recipes) => {
  recipeList.innerHTML = recipes
    .map(
      (item) => `
        <div class="recipe-card" onClick="getRecipesDetails(${item.idMeal})">
            <img src="${item.strMealThumb}" alt="Recipe photo">
            <h3>${item.strMeal}</h3>
        </div>
        `
    )
    .join("");
};

const getRecipesDetails = async (id) => {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const data = await response.json();

  if (!data.meals) {
    recipeDetails.innerHTML = "<p>Recipe not found.</p>";
    return;
  }

  const recipe = data.meals[0];
  console.log("Receita encontrada:", recipe);

  let ingredients = "";

  for (let i = 1; i <= 20; i++) {
    if (recipe[`strIngredient${i}`]) {
      ingredients += `
        <li>${recipe[`strIngredient${i}`]} - ${recipe[`strMeasure${i}`]}</li>
      `;
    } else {
      break;
    }
  }

  recipeDetails.innerHTML = `
    <h2>${recipe.strMeal}</h2>
    <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="recipe-img">
    <h3>Category: ${recipe.strCategory}</h3>
    <h3>Origin: ${recipe.strArea}</h3>
    <h3>Ingredients:</h3>
    <ul>${ingredients}</ul>
    <h3>Instructions:</h3>
    <p>${recipe.strInstructions}</p>
    <p>${recipe.strTags}</p>
    <p class="paragraphOfTheVideo">Video: <a href="${recipe.strYoutube}" target="_blank">Watch on YouTube</a></p>
  `;
};
