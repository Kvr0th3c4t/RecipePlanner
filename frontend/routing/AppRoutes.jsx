import React from "react"
import { Routes, Route, BrowserRouter } from "react-router-dom"
import { Dashboard } from "../src/pages/Dashboard.jsx"
import { Home } from "../src/pages/Home.jsx"
import { NotFound } from "../src/pages/NotFound.jsx"
import { RegisterLogin } from "../src/pages/RegisterLogin.jsx"
import { MyRecipes } from "../src/pages/MyRecipes.jsx"
import { RecipeForm } from "../src/pages/RecipeForm.jsx"
import { RecipeDetail } from "../src/pages/RecipeDetail.jsx"
import { RecipePlanner } from "../src/pages/RecipePlanner.jsx"

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            {/*LAYOUT*/}


            {/*Contenido central y rutas*/}
            <section>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/registerLogin" element={<RegisterLogin />} />
                    <Route path="/myRecipes" element={<MyRecipes />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/recipe/:id" element={<RecipeDetail />} />
                    <Route path="/recipe/:id/edit" element={<RecipeForm />} />
                    <Route path="/create-recipe" element={<RecipeForm />} />
                    <Route path="/recipePlanner" element={<RecipePlanner />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </section>

        </BrowserRouter>
    )
}