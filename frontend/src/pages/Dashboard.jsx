import React, { useState, useEffect } from 'react'
import { MainContainer } from '../components/layout/mainContainer.jsx';
import { EmptyStateRecipes } from '../components/ui/EmptyStateRecipes.jsx';
import { EmptyStatePlanning } from '../components/ui/EmptyStatePlanning.jsx';
import { PlanningState } from '../components/ui/PlanningState.jsx';


export const Dashboard = () => {

    const [recipeData, setRecipeData] = useState();
    const [planData, setPlanData] = useState();
    const [loading, setLoading] = useState(true);

    const fetchPlanData = async () => {
        const response = await (fetch('/api/planning'))

        setPlanData(await response.json())
    }

    const fetchRecipeData = async () => {
        const response = await (fetch('/api/recipes'))
        const data = await response.json();
        setRecipeData(data)
    }

    useEffect(() => {
        const loadData = async () => {
            await fetchRecipeData()
            await fetchPlanData()

            setLoading(false)
        }
        loadData()
    }, [])

    const hasMeal = (planData) => {
        return Object.values(planData).some(day => {
            return Object.values(day).some(meal => meal !== null)
        })
    }

    return (
        <MainContainer title="Panel de control">
            {loading ? (
                <div>"Cargando"</div>
            ) : (
                <div>
                    {!recipeData?.data ? (
                        <EmptyStateRecipes></EmptyStateRecipes>
                    ) : !hasMeal(planData?.data || {}) ? (
                        <EmptyStatePlanning></EmptyStatePlanning>
                    ) : (
                        <PlanningState></PlanningState>
                    )}
                </div>
            )}
        </MainContainer>
    )
}
