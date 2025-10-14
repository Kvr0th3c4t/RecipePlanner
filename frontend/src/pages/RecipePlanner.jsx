import React from 'react'
import { MainContainer } from '../components/layout/mainContainer.jsx'
import { pdf } from '@react-pdf/renderer';
import PlanningPDFDocument from '../components/pdf/PlanningPDFDocument.jsx';
import { useUser } from '../../context/UserContext.jsx'
import { usePlanning } from '../../hooks/usePlanning.js'
import { Loader } from '../components/ui/Loader.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Pagination } from '../components/ui/Pagination.jsx';
import { SearchInput } from '../components/ui/Inputs/SearchInput.jsx';
import toast from 'react-hot-toast';

export const RecipePlanner = () => {
    const { user } = useUser();

    const {
        loading, planningData, modal, slot, modalRecipes,
        modalSearch, modalPage, selectedRecipe, pendingChanges,
        days, mealType,
        setModal, setSelectedRecipe, setModalSearch, setModalPage,
        handleSlot, handleSearchParam, handleRecipeSelect,
        handleAssignRecipe, getSlotStatus, handleClearSlot,
        handleSaveChanges, fetchData
    } = usePlanning();

    const handleDownloadPDF = async () => {

        if (!planningData) {
            toast.error('No hay datos de planificación cargados');
            return;
        }

        try {
            const userName = user?.username || user?.email?.split('@')[0] || "Usuario";

            const blob = await pdf(
                <PlanningPDFDocument
                    planningData={planningData}
                    userName={userName}
                />
            ).toBlob();

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `planificacion-semanal-${new Date().toISOString().split('T')[0]}.pdf`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            toast.error('Error generando el PDF');
        }
    };

    const onSaveChanges = async () => {
        const success = await handleSaveChanges();
        if (success) {
            toast.success("Todos los cambios guardados correctamente");
        } else {
            toast.error("Error al guardar cambios");
        }
    };

    return (
        <MainContainer title="Planificación semanal">
            <div className='relative h-full max-w-7xl p-10 flex flex-col gap-4'>
                {loading ? (
                    <Loader text="Cargando planificación..." subtitle="Organizando tu semana..." />
                ) : (
                    <div className="flex-1 min-h-0">
                        <section className='grid grid-cols-8 grid-rows-7 gap-x-5 gap-y-2 h-full'>
                            <div></div>

                            {days.map((dia) => (
                                <div key={dia} className='py-4 px-9 bg-gradient-to-r from-brand-primary to-brand-primary/80 text-white font-bold text-xs text-center rounded-lg shadow-sm flex items-center justify-center'>
                                    {dia}
                                </div>
                            ))}

                            {mealType.map((comida) => (
                                <React.Fragment key={comida}>
                                    <div className='py-2 px-5 bg-gradient-to-r from-brand-secondary to-brand-secondary/80 text-white font-bold text-xs text-center rounded-lg shadow-sm flex items-center justify-center'>
                                        {comida}
                                    </div>

                                    {days.map((dia) => {
                                        const hasData = fetchData(dia, comida, planningData)
                                        const slotStatus = getSlotStatus(dia, comida);
                                        const slotStyles = {
                                            pending: 'bg-orange-50 border-orange-200 border-dashed text-orange-800 hover:bg-orange-100',
                                            assigned: 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-sm hover:shadow-md hover:bg-emerald-100',
                                            empty: 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100'
                                        };
                                        return (

                                            <div key={`${comida}-${dia}`} onClick={() => handleSlot(dia, comida)}
                                                className={`py-1 px-2 text-center rounded-lg transition-all duration-300 flex items-center justify-center border-2 cursor-pointer ${slotStyles[slotStatus]}`}>
                                                {(() => {
                                                    const key = `${dia}_${comida}`;
                                                    const displayText = pendingChanges[key]
                                                        ? pendingChanges[key].receta_nombre
                                                        : hasData
                                                            ? hasData
                                                            : "Sin planificar";

                                                    const dotColor = slotStatus === 'pending' ? 'bg-orange-500'
                                                        : slotStatus === 'assigned' ? 'bg-emerald-500'
                                                            : 'bg-red-300';

                                                    return (
                                                        <div className="flex flex-col items-center">
                                                            <div className={`w-2 h-2 ${dotColor} rounded-full mb-1`}></div>
                                                            <span className="text-xs font-medium leading-tight text-center line-clamp-2 text-wrap">
                                                                {displayText}
                                                            </span>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        )
                                    })}
                                </React.Fragment>
                            ))}
                        </section>
                    </div>
                )}

                {/* BOTONES PRINCIPALES */}
                <div className='flex flex-row w-full gap-4 flex-shrink-0 sticky bottom-0'>
                    <Button
                        variant="secondary"
                        fullWidth
                        onClick={() => handleDownloadPDF()}
                    >
                        Descargar planificación
                    </Button>
                    <Button
                        variant="primary"
                        fullWidth
                        onClick={() => onSaveChanges()}
                        disabled={Object.keys(pendingChanges).length === 0}
                        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>}
                    >
                        Guardar cambios
                    </Button>

                </div>
            </div>

            {/* MODAL DE ASIGNACIÓN */}
            {modal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-10">
                    <div className="w-full h-full bg-white p-6 rounded-lg flex flex-col">
                        <h1 className='mb-5 flex-shrink-0'>Asignación de receta para <span className='text-brand-primary/85'>{slot.meal}</span> del  <span className='text-brand-secondary/85'>{slot.day}</span></h1>

                        {/* BUSCADOR DEL MODAL */}
                        <div className="flex gap-4 px-4 w-full mb-5 flex-shrink-0">
                            <SearchInput
                                placeholder="Buscar..."
                                value={modalSearch}
                                onChange={(e) => setModalSearch(e.target.value)}
                            />
                            <Button
                                variant="secondary"
                                onClick={handleSearchParam}
                            >
                                Limpiar filtros
                            </Button>
                        </div>

                        {/* GRID DE RECETAS */}
                        <div className="flex-1 overflow-hidden">
                            <div className="grid grid-cols-5 gap-5 h-full overflow-y-auto">
                                {modalRecipes?.data?.recipes?.map((recipe) => (
                                    <div
                                        key={recipe.receta_id}
                                        onClick={() => handleRecipeSelect(recipe.receta_id)}
                                        className={`border rounded-lg p-3 cursor-pointer h-fit transition-all duration-200 ${recipe.receta_id === selectedRecipe
                                            ? 'border-brand-primary bg-brand-primary/10 shadow-md'
                                            : 'border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        <img src={recipe.receta_foto} className="w-full h-20 object-cover rounded"
                                            onError={(e) => e.target.src = 'https://placehold.co/600x400/00786F/FFF?text=Añade una foto a tu receta'} />
                                        <p className="text-sm mt-2">{recipe.receta_nombre}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* PAGINACIÓN DEL MODAL */}
                        {modalRecipes?.data?.recipes && (
                            <Pagination
                                currentPage={modalPage}
                                totalPages={modalRecipes.data.totalPages}
                                onNext={() => setModalPage(prev => Math.min(prev + 1, modalRecipes.data.totalPages))}
                                onPrev={() => setModalPage(prev => Math.max(prev - 1, 1))}
                            />
                        )}

                        {/* BOTONES DEL MODAL */}
                        <div className='flex flex-row w-full gap-4 flex-shrink-0 sticky bottom-0 bg-white pt-4'>
                            <Button
                                variant="ghost"
                                fullWidth
                                onClick={() => {
                                    setSelectedRecipe(null);
                                    setModal(false);
                                }}
                                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>}
                            >
                                Volver
                            </Button>

                            {getSlotStatus(slot.day, slot.meal) === 'assigned' && (
                                <Button
                                    variant="danger"
                                    fullWidth
                                    onClick={() => handleClearSlot()}
                                >
                                    Vaciar asignación
                                </Button>
                            )}

                            <Button
                                variant="primary"
                                fullWidth
                                onClick={() => handleAssignRecipe()}
                                disabled={selectedRecipe == null}
                                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>}
                            >
                                Asignar receta
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </MainContainer>
    )
}