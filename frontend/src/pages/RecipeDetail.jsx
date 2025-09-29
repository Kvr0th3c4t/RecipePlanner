import React, { useEffect, useState } from 'react'
import { useUser } from '../../context/UserContext';
import { useNavigate, useParams } from 'react-router-dom';
import { MainContainer } from '../components/layout/mainContainer';

export const RecipeDetail = () => {
    const { user } = useUser();
    const [loading, setLoading] = useState(true);
    const [recipeData, setRecipeData] = useState();
    const navigate = useNavigate();
    const { id } = useParams();

    const fetchRecipeData = async () => {
        console.log('Fetching recipe with ID:', id); // Debug
        const response = await fetch(`/api/recipes/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        console.log('Response status:', response.status); // Debug
        const data = await response.json();
        console.log('Recipe data:', data); // Debug
        setRecipeData(data);

    }

    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            await fetchRecipeData()
            setLoading(false)
        }
        loadData()
    }, [])

    const handleUpdate = () => {
        navigate(`/recipe/${id}/edit`);
    }
    const handleDownload = () => {
        alert("Función de descarga - próximamente");
    }

    return (
        <MainContainer title="Detalle de receta">
            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <div className="text-lg text-gray-600">Cargando receta...</div>
                </div>
            ) : recipeData ? (
                <div className='h-full overflow-hidden'>
                    <main className='max-w-7xl mx-auto p-6 h-full flex flex-col'>
                        <div className='mb-8 flex-shrink-0'>
                            <h1 className='text-4xl md:text-5xl font-light text-gray-900 mb-4 pt-2 leading-tight'>
                                {recipeData?.data?.receta?.recetaNombre}
                            </h1>
                            <div className='w-full h-0.5 bg-brand-primary'></div>
                        </div>

                        <div className='grid grid-cols-1 lg:grid-cols-5 gap-8 flex-1 min-h-0'>
                            <div className='lg:col-span-3 flex flex-col min-h-0'>
                                <div className='flex-1 flex flex-col min-h-0'>
                                    <h2 className='text-2xl font-medium text-gray-700 mb-6 border-b border-gray-200 pb-2 flex-shrink-0'>
                                        Ingredientes
                                    </h2>

                                    <div className='max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400'>
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 pb-4'>
                                            {recipeData.data.ingredientes.map((ingrediente, index) => (
                                                <div key={ingrediente.nombreIngrediente}
                                                    className='flex justify-between items-center py-3 border-b border-gray-100 hover:bg-gray-50 px-2 rounded transition-colors'>
                                                    <div className='flex items-center space-x-3'>
                                                        <span className='w-6 h-6 bg-brand-primary/20 text-brand-primary rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0'>
                                                            {index + 1}
                                                        </span>
                                                        <span className='text-gray-800 font-medium text-sm'>{ingrediente.nombreIngrediente}</span>
                                                    </div>
                                                    <div className='text-right flex-shrink-0'>
                                                        <span className='text-brand-secondary text-sm font-semibold block'>
                                                            {ingrediente.cantidad} {ingrediente.abreviatura}
                                                        </span>
                                                        <span className='text-xs text-gray-500'>
                                                            {ingrediente.categoria}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='lg:col-span-2'>
                                <div className='sticky top-6'>
                                    <div className='relative group'>
                                        <img
                                            src={recipeData.data.receta.recetaFoto}
                                            alt={recipeData.data.receta.recetaNombre}
                                            className="w-full h-96 object-cover rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                                            onError={(e) => e.target.src = 'https://placehold.co/600x400/00786F/FFF?text=Añade una foto a tu receta'}
                                        />
                                        <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-row w-full gap-4'>
                            <button
                                onClick={() => navigate('/myRecipes')}
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Volver
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="flex-1 bg-brand-secondary/85 hover:bg-brand-secondary text-white px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Modificar receta
                            </button>
                            <button
                                onClick={handleDownload
                                }
                                className="flex-1 bg-brand-primary/85 hover:bg-brand-primary text-white px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Descargar receta
                                <span className="mt-1 text-[0.60rem] tracking-wide text-white font-bold bg-brand-secondary/85 px-3 py-1 rounded-full shadow-sm w-fit">
                                    Próximamente
                                </span>
                            </button>

                        </div>
                    </main>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full">
                    <div className="text-xl font-semibold text-gray-700 mb-2">Error cargando receta</div>
                    <p className="text-gray-500 mb-4">No se pudo cargar la información de la receta</p>
                    <button
                        onClick={() => navigate('/myRecipes')}
                        className="bg-brand-secondary text-white px-6 py-2 rounded-lg hover:bg-brand-secondary/90 transition-colors"
                    >
                        Volver a mis recetas
                    </button>
                </div>
            )}
        </MainContainer>
    )
}