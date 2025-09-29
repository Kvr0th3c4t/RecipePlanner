import React from 'react'
import recipes from "../../assets/recipes.png"
import { useNavigate } from 'react-router-dom'

export const EmptyStateRecipes = () => {

    const navigate = useNavigate()

    return (
        <div className='relative h-full'>
            <section className='grid grid-cols-3 gap-6 items-center'>
                <picture className='flex justify-center'>
                    <img
                        src={recipes}
                        alt='Niño cocinando'
                        className="w-full h-auto max-w-sm rounded-lg"
                    />
                </picture>
                <div className='flex flex-col justify-center items-center col-span-2 space-y-4'>
                    <h1 className="text-4xl text-gray-900 font-semibold">
                        ¡Vaya! Parece que no tienes recetas
                    </h1>
                    <h3 className="text-2xl text-gray-700 font-medium">
                        ¡Crea tu primera receta desde aquí!
                    </h3>

                    <button
                        onClick={() => navigate("/recipe/new")}
                        className="
                                bg-brand-primary/85 text-white 
                                hover:bg-brand-primary
                                focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:ring-offset-2
                                px-6 py-3 
                                rounded-lg 
                                safe-touch 
                                transition-colors duration-200 
                                font-medium
                                shadow-sm hover:shadow-md
                            "
                    >
                        Ir a crear recetas
                    </button>
                </div>
            </section>
        </div>
    )
}