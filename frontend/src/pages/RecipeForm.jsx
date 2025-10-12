import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useRecipeForm } from '../../hooks/useRecipeForm';
import { MainContainer } from '../components/layout/mainContainer';
import { Loader } from '../components/ui/Loader.jsx';

export const RecipeForm = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const {
    mode,
    loading,
    formData,
    ingredients,
    units,
    searchResults,
    showSuggestions,
    handleFormDataChange,
    handleIngredientChange,
    addIngredientRow,
    removeIngredientRow,
    searchIngredients,
    selectIngredient,
    handleSubmit
  } = useRecipeForm(id);

  const onSubmit = async (e) => {
    e.preventDefault();
    const success = await handleSubmit();
    if (success) {
      alert(mode === "create" ? "Receta creada correctamente" : "Receta actualizada correctamente");
      navigate('/myRecipes');
    } else {
      alert("Error al procesar la receta");
    }
  };

  return (
    <MainContainer title={mode === "create" ? "Nueva receta" : "Editar receta"}>
      {loading ? (
        <Loader text="Cargando formulario..." subtitle={null} />
      ) : (
        <div className='h-full overflow-hidden'>
          <form onSubmit={onSubmit} className='max-w-7xl mx-auto p-6 h-full flex flex-col'>

            <div className='mb-8 flex-shrink-0'>
              <input
                type="text"
                value={formData?.receta_nombre || ''}
                onChange={(e) => handleFormDataChange('receta_nombre', e.target.value)}
                placeholder="Nombre de la receta..."
                className="text-4xl md:text-5xl font-light text-gray-900 mb-4 pt-2 leading-tight bg-transparent border-none outline-none w-full focus:bg-gray-50 px-2 py-1 rounded"
              />
              <div className='w-full h-0.5 bg-brand-primary'></div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-5 gap-8 flex-1 min-h-0'>

              <div className='lg:col-span-3 flex flex-col min-h-0'>



                <div className='flex-1 flex flex-col min-h-0'>
                  <h2 className='text-2xl font-medium text-gray-700 mb-6 border-b border-gray-200 pb-2 flex-shrink-0'>
                    Ingredientes
                  </h2>

                  <div className='flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 max-h-80'>
                    <div className='space-y-3 pb-4'>
                      {ingredients.map((ingrediente, index) => (
                        <div key={ingrediente.ingrediente_id || index}
                          className='flex items-center gap-3 py-3 px-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors'>

                          <span className='w-8 h-8 bg-brand-primary/20 text-brand-primary rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0'>
                            {index + 1}
                          </span>

                          <div className='flex-1 relative'>
                            <input
                              type="text"
                              value={ingrediente.nombreIngrediente}
                              onChange={(e) => {
                                handleIngredientChange(index, 'nombreIngrediente', e.target.value);
                                searchIngredients(e.target.value, index);
                              }}
                              placeholder="Buscar ingrediente..."
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-primary"
                            />

                            {showSuggestions[index] && searchResults[index]?.length > 0 && (
                              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                {searchResults[index].map(suggestion => (
                                  <div
                                    key={suggestion.ingrediente_id}
                                    onClick={() => selectIngredient(suggestion, index)}
                                    className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                  >
                                    {suggestion.ingrediente_nombre}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <input
                            type="number"
                            value={ingrediente.cantidad}
                            onChange={(e) => handleIngredientChange(index, 'cantidad', e.target.value)}
                            placeholder="Cantidad"
                            className="w-20 px-2 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-primary text-center"
                          />

                          <select
                            value={ingrediente.unidad_id}
                            onChange={(e) => handleIngredientChange(index, 'unidad_id', e.target.value)}
                            className="w-24 px-2 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-primary"
                          >
                            <option value="">Unidad</option>
                            {units?.map(unit => (
                              <option key={unit.unidad_id} value={unit.unidad_id}>
                                {unit.abreviatura}
                              </option>
                            ))}
                          </select>

                          <span className='text-xs text-gray-500 w-20 text-center flex-shrink-0'>
                            {ingrediente.categoria}
                          </span>

                          <button
                            type="button"
                            onClick={() => removeIngredientRow(index)}
                            className="w-8 h-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addIngredientRow}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-brand-primary hover:bg-brand-primary/5 transition-colors text-gray-600 hover:text-brand-primary flex items-center justify-center gap-2"
                      >
                        <span className="text-xl">+</span>
                        <span className="font-medium">Añadir ingrediente</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className='lg:col-span-2'>
                <div className='sticky top-6'>
                  <div className='relative group'>
                    {formData?.receta_foto ? (
                      <img
                        src={formData.receta_foto}
                        alt={formData.receta_nombre || "Preview de receta"}
                        className="w-full h-64 object-cover rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                        onError={(e) => e.target.src = 'https://placehold.co/600x400/00786F/FFF?text=Preview+de+receta'}
                      />
                    ) : (
                      <div className="w-full h-64 bg-brand-primary/10 rounded-lg shadow-lg flex items-center justify-center text-brand-primary">
                        <div className="text-center">
                          <div className="text-4xl mb-2">📸</div>
                          <p className="text-sm font-medium">Agrega una URL de imagen</p>
                          <p className="text-xs text-gray-500">para ver el preview</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className='mt-4 bg-gray-50 p-4 rounded-lg'>
                    <h3 className='font-semibold text-gray-700 mb-3'>URL de la foto</h3>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData?.receta_foto || ''}
                        onChange={(e) => handleFormDataChange('receta_foto', e.target.value)}
                        placeholder="https://ejemplo.com/foto.jpg"
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='flex gap-4 mt-6 flex-shrink-0'>
              <button
                type="button"
                onClick={() => navigate('/myRecipes')}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Cancelar
              </button>

              <button
                type="submit"
                className="flex-1 bg-brand-secondary hover:bg-brand-secondary/90 text-white px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {mode === "create" ? "Crear receta" : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      )}
    </MainContainer>
  )
}