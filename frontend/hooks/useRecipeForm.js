import React from "react";
import { useState, useEffect, useCallback } from "react";
import { useFetch } from "./useFetch";

export const useRecipeForm = (recipeId) => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    receta_nombre: "",
    receta_foto: "",
  });
  const [ingredients, setIngredients] = useState([]);
  const [searchResults, setSearchResults] = useState({});
  const [showSuggestions, setShowSuggestions] = useState({});
  const mode = recipeId ? "edit" : "create";

  const { data: unitData } = useFetch("/api/units");
  const { data: recipeData } = useFetch(
    recipeId ? `/api/recipes/${recipeId}` : null
  );

  useEffect(() => {
    if (mode === "edit" && recipeData?.data) {
      setIngredients(recipeData.data.ingredientes);
      setFormData({
        receta_nombre: recipeData.data.receta.recetaNombre,
        receta_foto: recipeData.data.receta.recetaFoto,
      });
      setLoading(false);
    } else if (mode === "create" && unitData) {
      setLoading(false);
    }
  }, [recipeData, unitData, mode]);

  const handleFormDataChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleIngredientChange = useCallback((index, field, value) => {
    setIngredients((prev) =>
      prev.map((ingredient, i) =>
        i === index ? { ...ingredient, [field]: value } : ingredient
      )
    );
  }, []);
  const selectIngredient = useCallback(
    (suggestion, index) => {
      handleIngredientChange(
        index,
        "nombreIngrediente",
        suggestion.ingrediente_nombre
      );
      handleIngredientChange(
        index,
        "ingrediente_id",
        suggestion.ingrediente_id
      );
      setShowSuggestions((prev) => ({ ...prev, [index]: false }));
    },
    [handleIngredientChange]
  );

  const addIngredientRow = useCallback(() => {
    setIngredients((prev) => [
      ...prev,
      {
        ingrediente_id: "",
        nombreIngrediente: "",
        cantidad: "",
        unidad_id: "",
        categoria: "",
      },
    ]);
  }, []);

  const removeIngredientRow = useCallback((index) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const createRecipe = useCallback(async () => {
    const recipeResponse = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        receta_nombre: formData.receta_nombre,
        receta_foto: formData.receta_foto,
      }),
    });

    if (!recipeResponse.ok) throw new Error("Error creando receta");

    const recipeResult = await recipeResponse.json();
    const newRecipeId = recipeResult.data.recipe.receta_id;

    const validIngredients = ingredients.filter(
      (ing) => ing.ingrediente_id && ing.cantidad && ing.unidad_id
    );

    for (const ingredient of validIngredients) {
      const ingredientResponse = await fetch(
        `/api/recipes/${newRecipeId}/ingredients`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ingrediente_id: parseInt(ingredient.ingrediente_id),
            cantidad: parseFloat(ingredient.cantidad),
            unidad_id: parseInt(ingredient.unidad_id),
          }),
        }
      );

      if (!ingredientResponse.ok) {
        throw new Error(
          `Error agregando ingrediente: ${ingredient.nombreIngrediente}`
        );
      }
    }
  }, [formData, ingredients]);

  const updateRecipe = useCallback(async () => {
    const recipeResponse = await fetch(`/api/recipes/${recipeId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        receta_nombre: formData.receta_nombre,
        receta_foto: formData.receta_foto,
      }),
    });

    if (!recipeResponse.ok) throw new Error("Error actualizando receta");

    for (const originalIngredient of recipeData.data.ingredientes) {
      await fetch(
        `/api/recipes/${recipeId}/ingredients/${originalIngredient.ingrediente_id}`,
        {
          method: "DELETE",
        }
      );
    }

    const validIngredients = ingredients.filter(
      (ing) => ing.ingrediente_id && ing.cantidad && ing.unidad_id
    );

    for (const ingredient of validIngredients) {
      const ingredientResponse = await fetch(
        `/api/recipes/${recipeId}/ingredients`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ingrediente_id: parseInt(ingredient.ingrediente_id),
            cantidad: parseFloat(ingredient.cantidad),
            unidad_id: parseInt(ingredient.unidad_id),
          }),
        }
      );

      if (!ingredientResponse.ok) {
        throw new Error(
          `Error agregando ingrediente: ${ingredient.nombreIngrediente}`
        );
      }
    }
  }, [formData, ingredients, recipeId, recipeData]);

  const searchIngredients = useCallback(async (query, index) => {
    if (query.length < 2) {
      setSearchResults((prev) => ({ ...prev, [index]: [] }));
      return;
    }

    const response = await fetch(`/api/ingredients/search?q=${query}`);
    const data = await response.json();

    setSearchResults((prev) => ({
      ...prev,
      [index]: data.data.ingredient || [],
    }));
    setShowSuggestions((prev) => ({ ...prev, [index]: true }));
  }, []);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      if (mode === "create") {
        await createRecipe();
      } else {
        await updateRecipe();
      }
      return true;
    } catch (error) {
      console.error("Error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [mode, createRecipe, updateRecipe]);

  return {
    mode,
    loading,
    formData,
    ingredients,
    units: unitData?.data?.units,
    searchResults,
    showSuggestions,
    handleFormDataChange,
    handleIngredientChange,
    addIngredientRow,
    removeIngredientRow,
    searchIngredients,
    selectIngredient,
    handleSubmit,
  };
};
