import React from 'react'
import { useNavigate } from 'react-router-dom';
import { MainContainer } from '../components/layout/mainContainer';
import { useRecipeSearch } from '../../hooks/useRecipeSearch.js';
import { Loader } from '../components/ui/Loader.jsx';

export const MyRecipes = () => {


    const navigate = useNavigate();

    const {
        recipes, totalPages, loading,
        searchType, searchTerm, currentPage,
        setSearchType, setSearchTerm,
        handleFilter, clearFilters, nextPage, prevPage
    } = useRecipeSearch();

    const handleDetailView = (id) => {
        navigate(`/recipe/${id}`)
    }

    const handleUpdate = (id) => {
        navigate(`/recipe/${id}/edit`)
    }

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("¿Está seguro de que quiere eliminar esta receta?")

        if (confirmDelete) {
            try {
                const response = await fetch(`/api/recipes/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    alert("Receta eliminada correctamente")
                    handleFilter();
                } else {
                    alert("Error al borrar la receta")
                }
            } catch (error) {
                alert("Error al eliminar la receta");
            }
        }
    }

    return (
        <MainContainer title="Mis recetas">
            <div className="h-full flex flex-col">
                {loading ? (
                    <Loader text="Cargando recetas..." subtitle="Preparando tus creaciones..." />
                ) : (
                    <>
                        <section className='sticky top-0 z-10 px-0 py-5 w-full'>
                            <div className="flex gap-4 px-4 w-full">
                                <select name="" value={searchType} onChange={(e) => setSearchType(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary">
                                    <option value="recipe">
                                        Nombre de receta
                                    </option>
                                    <option value="ingredient">
                                        Nombre de ingrediente
                                    </option>
                                </select>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Buscar..."
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                />

                                <button
                                    type='button'
                                    onClick={handleFilter}
                                    className="
                                px-6 py-2 
                                bg-brand-secondary/85 text-white 
                                hover:bg-brand-secondary
                                focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-brand-primary
                                rounded-lg 
                                safe-touch 
                                transition-all duration-200 
                                font-medium
                                shadow-sm hover:shadow-md
                                border border-white/10 hover:border-white/30
                            "
                                >
                                    Filtrar
                                </button>
                                <button
                                    type='button'
                                    onClick={clearFilters}
                                    className="
                                px-6 py-2 
                                bg-brand-primary/65 text-white 
                                hover:bg-brand-primary
                                focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-brand-primary
                                rounded-lg 
                                safe-touch 
                                transition-all duration-200 
                                font-medium
                                shadow-sm hover:shadow-md
                                border border-white/10 hover:border-white/30
                            "
                                >
                                    Limpiar filtros
                                </button>
                            </div>
                        </section>

                        <main className="flex-1 overflow-y-auto justify-center items-center px-4 py-4">
                            {!recipes || recipes.length === 0 ? (
                                <div className="flex flex-col items-center justify-center">
                                    <h2 className="text-xl font-semibold text-gray-700 mb-2">No se encontraron recetas</h2>
                                    <p className="text-gray-500 mb-4">Prueba con otros términos de búsqueda</p>
                                    <button
                                        onClick={() => navigate('/create-recipe')}
                                        className="bg-brand-secondary text-white px-6 py-2 rounded-lg hover:bg-brand-secondary/90 transition-colors"
                                    >
                                        Crear tu primera receta
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-4">
                                    {(() => {
                                        const recipesWithCTA = [...recipes];
                                        if (recipesWithCTA.length < 6 && searchTerm === "") {
                                            recipesWithCTA.push({ isCTA: true });
                                        }

                                        return recipesWithCTA.map((receta, index) =>
                                            receta.isCTA ? (
                                                <div key="create-cta" className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center h-32">
                                                    <button
                                                        onClick={() => navigate('/create-recipe')}
                                                        className="flex flex-col items-center gap-2 p-6 text-center"
                                                    >
                                                        <div className="text-4xl text-gray-400 font-light">+</div>
                                                        <span className="text-sm font-medium text-gray-600">Crear Receta</span>
                                                    </button>
                                                </div>
                                            ) : (
                                                <div key={receta.receta_nombre} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow w-90">
                                                    <img
                                                        src={receta.receta_foto}
                                                        alt={receta.receta_nombre}
                                                        className="w-full h-32 object-cover"
                                                        onError={(e) => e.target.src = 'https://placehold.co/600x400/00786F/FFF?text=Añade una foto a tu receta'}
                                                    />
                                                    <div className="p-3">
                                                        <h3 className="font-semibold text-xs mb-2">{receta.receta_nombre}</h3>

                                                        <div className="flex justify-center items-center gap-2">
                                                            <button
                                                                onClick={() => handleDetailView(receta.receta_id)}
                                                                className="bg-blue-400 text-white rounded text-xs hover:bg-blue-600 transition-colors w-25 px-2 py-1"
                                                            >
                                                                Ver
                                                            </button>
                                                            <button
                                                                onClick={() => handleUpdate(receta.receta_id)}
                                                                className="bg-yellow-400 text-white rounded text-xs hover:bg-yellow-600 transition-colors w-25 px-2 py-1"
                                                            >
                                                                Editar
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(receta.receta_id)}
                                                                className="bg-red-400 text-white rounded text-xs hover:bg-red-600 transition-colors w-25 px-2 py-1"
                                                            >
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        );
                                    })()}
                                </div>
                            )}
                        </main>

                        {recipes && (
                            <div className="sticky bottom-0z-10 px-0 py-5 w-full">
                                <div className="flex justify-center items-center gap-4 px-4 w-full">
                                    <button
                                        onClick={prevPage}
                                        hidden={currentPage === 1}
                                        className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                                    >
                                        Anterior
                                    </button>

                                    <span className="text-gray-700">
                                        Página {currentPage} de {totalPages}
                                    </span>

                                    <button
                                        onClick={nextPage}
                                        hidden={currentPage === totalPages}
                                        className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </MainContainer>
    )
}