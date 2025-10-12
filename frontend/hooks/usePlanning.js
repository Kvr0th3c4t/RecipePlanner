import React, { useCallback, useState } from "react";
import { useFetch } from "./useFetch";
import toast from "react-hot-toast";

export const usePlanning = () => {
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [slot, setSlot] = useState(null);
  const [modalSearch, setModalSearch] = useState("");
  const [modalPage, setModalPage] = useState(1);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [pendingChanges, setPendingChanges] = useState({});
  const modalLimit = 10;

  const days = [
    "LUNES",
    "MARTES",
    "MIERCOLES",
    "JUEVES",
    "VIERNES",
    "SABADO",
    "DOMINGO",
  ];
  const mealType = ["DESAYUNO", "ALMUERZO", "COMIDA", "MERIENDA", "CENA"];

  const { data: recipeData } = useFetch("/api/recipes");
  const { data: planningData, refetch } = useFetch("/api/planning");
  const { data: modalRecipes } = useFetch(
    modal
      ? `/api/recipes/search?searchType=recipe&searchTerm=${modalSearch}&page=${modalPage}&limit=${modalLimit}`
      : null
  );

  const fetchData = useCallback((day, mealType, planData) => {
    return planData?.[day]?.[mealType]?.receta_nombre || null;
  }, []);

  const handleSlot = useCallback((dia, comida) => {
    setSlot({
      day: dia,
      meal: comida,
    });
    setModalSearch("");
    setModalPage(1);
    setSelectedRecipe(null);
    setModal(true);
  }, []);

  const handleSearchParam = useCallback(() => {
    setModalSearch("");
  }, []);

  const handleRecipeSelect = useCallback((recipeId) => {
    setSelectedRecipe(recipeId);
  }, []);

  const handleAssignRecipe = useCallback(() => {
    if (selectedRecipe != null) {
      const selectedRecipeData = modalRecipes.data.recipes.find(
        (recipe) => recipe.receta_id === selectedRecipe
      );
      if (selectedRecipeData != undefined) {
        const recipeName = selectedRecipeData.receta_nombre;
        const key = `${slot.day}_${slot.meal}`;
        setPendingChanges((prev) => ({
          ...prev,
          [key]: {
            receta_id: selectedRecipe,
            receta_nombre: recipeName,
          },
        }));
        toast.success(`${recipeName} asignada para ${slot.meal}`);
        setSelectedRecipe(null);
        setModalSearch("");
        setModalPage(1);
        setModal(false);
      }
    }
  }, [selectedRecipe, modalRecipes, slot]);

  const getSlotStatus = useCallback(
    (day, mealType) => {
      const key = `${day}_${mealType}`;
      const hasServerData = planningData?.data
        ? fetchData(day, mealType, planningData.data)
        : null;
      const hasPendingChange = pendingChanges[key];

      if (hasPendingChange) {
        return "pending";
      } else if (hasServerData) {
        return "assigned";
      } else {
        return "empty";
      }
    },
    [planningData, pendingChanges, fetchData]
  );

  const handleClearSlot = useCallback(() => {
    const key = `${slot.day}_${slot.meal}`;

    setPendingChanges((prev) => {
      const newChanges = {
        ...prev,
        [key]: {
          action: "delete",
          day: slot.day,
          tipo_comida: slot.meal,
          receta_id: planningData?.data?.[slot.day]?.[slot.meal]?.receta_id,
        },
      };
      return newChanges;
    });
    toast.info("Receta marcada para eliminar");
    setModal(false);
  }, [slot, planningData]);

  const handleSaveChanges = useCallback(async () => {
    try {
      setLoading(true);

      for (const [key, assignment] of Object.entries(pendingChanges)) {
        if (assignment.action === "delete") {
          const response = await fetch("/api/planning/deleteRecipe", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              day: assignment.day,
              tipo_comida: assignment.tipo_comida,
              receta_id:
                planningData?.data?.[assignment.day]?.[assignment.tipo_comida]
                  ?.receta_id,
            }),
          });

          if (!response.ok) {
            setLoading(false);
            return false;
          }
        } else {
          const [day, tipo_comida] = key.split("_");
          const response = await fetch("/api/planning/asignRecipe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              receta_id: assignment.receta_id,
              day: day,
              tipo_comida: tipo_comida,
            }),
          });

          if (!response.ok) {
            setLoading(false);
            return false;
          }
        }
      }
      await refetch();
      setPendingChanges({});
      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [planningData, slot, pendingChanges, refetch]);

  return {
    // Estados
    loading,
    planningData: planningData?.data,
    modal,
    slot,
    modalRecipes,
    modalSearch,
    modalPage,
    selectedRecipe,
    pendingChanges,
    days,
    mealType,

    // Setters (para el componente)
    setModal,
    setSelectedRecipe,
    setModalSearch,
    setModalPage,

    // Handlers
    handleSlot,
    handleSearchParam,
    handleRecipeSelect,
    handleAssignRecipe,
    getSlotStatus,
    handleClearSlot,
    handleSaveChanges,

    // Helper
    fetchData,
  };
};
