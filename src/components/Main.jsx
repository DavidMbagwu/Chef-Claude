import React from "react";
import Recipe from "./Recipe";

import { getRecipeFromMistral } from "../ai";

export default function Main() {
  const [ingredientList, setIngredientList] = React.useState([]);

  const [showRecipe, setShowRecipe] = React.useState(false);

  const [recipe, setRecipe] = React.useState("");

  const recipeRef = React.useRef(null);

  React.useEffect(() => {
    console.log(recipeRef.current);
    if (recipe && recipeRef.current) {
      recipeRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [recipe]);

  function handleSubmit(formData) {
    const ingredient = formData.get("ingredient");
    console.log(ingredient);
    if (
      ingredient.trim() !== "" &&
      !ingredientList.includes(ingredient.toLowerCase())
    ) {
      setIngredientList((prevList) => [...prevList, ingredient.toLowerCase()]);
    }
  }

  async function getRecipe() {
    const recipeMarkdown = await getRecipeFromMistral(ingredientList);
    console.log(recipeMarkdown);
    setRecipe(recipeMarkdown);
  }
  return (
    <main>
      <form className="input-form" action={handleSubmit}>
        <input
          className="ingredient-input"
          name="ingredient"
          type="text"
          placeholder="e.g Oregano"
        />
        <button className="add-ingredient-btn" type="submit">
          + Add ingredient
        </button>
      </form>

      {ingredientList.length > 0 && (
        <section className="ingredient-list">
          <h1 className="ingredient-list-title">Ingredients on hand:</h1>
          <ul className="ingredient-list">
            {ingredientList.map((ingredient, index) => (
              <li key={index} className="ingredient-item">
                {ingredient}
              </li>
            ))}
          </ul>
        </section>
      )}
      {ingredientList.length > 3 && (
        <section className="get-recipe-section" ref={recipeRef}>
          <div className="get-recipe-text-container">
            <h3>Ready for a recipe?</h3>
            <p>Generate a recipe from your list of ingredients.</p>
          </div>
          <button
            className="get-recipe-btn"
            onClick={() => {
              getRecipe();
              setShowRecipe((prevState) => {
                return !prevState;
              });
            }}
          >
            Get a recipe
          </button>
        </section>
      )}
      {showRecipe && <Recipe recipe={recipe} />}
    </main>
  );
}
