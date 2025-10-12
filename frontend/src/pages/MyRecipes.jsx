import React from 'react'
import { useNavigate } from 'react-router-dom';
import { MainContainer } from '../components/layout/mainContainer';
import { useRecipeSearch } from '../../hooks/useRecipeSearch.js';
import { Loader } from '../components/ui/Loader.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Pagination } from '../components/ui/Pagination.jsx';
import toast from 'react-hot-toast';

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
                    toast.success("Receta eliminada correctamente");
                    handleFilter();
                } else {
                    toast.error("Error al borrar la receta");
                }
            } catch (error) {
                toast.error("Error al eliminar la receta");
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

                                <Button
                                    variant="primary"
                                    onClick={handleFilter}
                                >
                                    Filtrar
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={clearFilters}
                                >
                                    Limpiar filtros
                                </Button>
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

                                                        <div className="grid grid-cols-3 gap-2 mt-2">
                                                            <Button
                                                                variant="link"
                                                                size="sm"
                                                                onClick={() => handleDetailView(receta.receta_id)}
                                                            >
                                                                Ver
                                                            </Button>
                                                            <Button
                                                                variant="warning"
                                                                size="sm"
                                                                onClick={() => handleUpdate(receta.receta_id)}
                                                            >
                                                                Editar
                                                            </Button>
                                                            <Button
                                                                variant="danger"
                                                                size="sm"
                                                                onClick={() => handleDelete(receta.receta_id)}
                                                            >
                                                                Eliminar
                                                            </Button>
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
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onNext={nextPage}
                                onPrev={prevPage}
                            />
                        )}
                    </>
                )}
            </div>
        </MainContainer>
    )
}