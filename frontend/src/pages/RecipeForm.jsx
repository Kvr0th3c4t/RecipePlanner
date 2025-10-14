import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useRecipeForm } from '../../hooks/useRecipeForm';
import { MainContainer } from '../components/layout/mainContainer';
import { Loader } from '../components/ui/Loader.jsx';
import { Button } from '../components/ui/Button.jsx';

import { Input } from '../components/ui/Inputs/Input.jsx';
import { NumberInput } from '../components/ui/Inputs/NumberInput.jsx';
import { Select } from '../components/ui/Inputs/Select.jsx';
import { Autocomplete } from '../components/ui/Inputs/Autocomplete.jsx';

import toast from 'react-hot-toast';

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
      toast.success(mode === "create" ? "Receta creada correctamente" : "Receta actualizada correctamente");
      navigate('/myRecipes');
    } else {
      toast.error("Error al procesar la receta");
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
              <Input
                variant="large"
                value={formData?.receta_nombre || ''}
                onChange={(e) => handleFormDataChange('receta_nombre', e.target.value)}
                placeholder="Nombre de la receta..."
                fullWidth
                className="mb-4"
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

                          <Autocomplete
                            placeholder="Buscar ingrediente..."
                            value={ingrediente.nombreIngrediente}
                            onChange={(e) => {
                              handleIngredientChange(index, 'nombreIngrediente', e.target.value);
                              searchIngredients(e.target.value, index);
                            }}
                            suggestions={searchResults[index]?.map(s => ({
                              id: s.ingrediente_id,
                              label: s.ingrediente_nombre,
                              data: s
                            })) || []}
                            showSuggestions={showSuggestions[index]}
                            onSuggestionClick={(suggestion) => selectIngredient(suggestion.data, index)}
                          />

                          <NumberInput
                            placeholder="Cantidad"
                            value={ingrediente.cantidad}
                            onChange={(e) => handleIngredientChange(index, 'cantidad', e.target.value)}
                          />

                          <Select
                            value={ingrediente.unidad_id}
                            onChange={(e) => handleIngredientChange(index, 'unidad_id', e.target.value)}
                            placeholder="Unidad"
                            options={units?.map(unit => ({
                              value: unit.unidad_id,
                              label: unit.abreviatura
                            })) || []}
                            className="w-24"
                          />

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
                    <Input
                      label="URL de la foto"
                      type="url"
                      value={formData?.receta_foto || ''}
                      onChange={(e) => handleFormDataChange('receta_foto', e.target.value)}
                      placeholder="https://ejemplo.com/foto.jpg"
                      fullWidth
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className='flex gap-4 mt-6 flex-shrink-0'>
              <Button
                variant="ghost"
                fullWidth
                type="button"
                onClick={() => navigate('/myRecipes')}
                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>}
              >
                Cancelar
              </Button>

              <Button
                variant="primary"
                fullWidth
                type="submit"
                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>}
              >
                {mode === "create" ? "Crear receta" : "Guardar cambios"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </MainContainer>
  )
}