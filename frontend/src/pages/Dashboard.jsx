import React from 'react'
import { MainContainer } from '../components/layout/mainContainer.jsx';
import { EmptyStateRecipes } from '../components/ui/EmptyStateRecipes.jsx';
import { EmptyStatePlanning } from '../components/ui/EmptyStatePlanning.jsx';
import { PlanningState } from '../components/ui/PlanningState.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { Loader } from '../components/ui/Loader.jsx';


export const Dashboard = () => {


    const { data: planData, loading: planLoading } = useFetch('/api/planning');
    const { data: recipeData, loading: recipesLoading } = useFetch('/api/recipes')

    const loading = recipesLoading || planLoading;

    const hasMeal = (planData) => {
        return Object.values(planData).some(day => {
            return Object.values(day).some(meal => meal !== null)
        })
    }

    return (
        <MainContainer title="Panel de control">
            {loading ? (
                <Loader text='Cargando...' subtitle='Preparando tu panel...' />
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
