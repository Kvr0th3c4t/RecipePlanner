import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useContext } from 'react'
import { MainContainer } from '../components/layout/mainContainer'
import { pdf } from '@react-pdf/renderer';
import PlanningPDFDocument from '../components/pdf/PlanningPDFDocument';
import { useUser } from '../../context/UserContext'

export const RecipePlanner = () => {
    const { user } = useUser();
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [planningData, setPlanningData] = useState()
    const [modal, setModal] = useState(false);
    const [slot, setSlot] = useState(null);
    const [recipeData, setRecipeData] = useState([]);
    const [modalRecipes, setModalRecipes] = useState([]);
    const [modalSearch, setModalSearch] = useState("");
    const [modalPage, setModalPage] = useState(1);
    const [selectedRecipe, setSelectedRecipe] = useState(null)
    const [pendingChanges, setPendingChanges] = useState({})
    const modalLimit = 10;

    const days = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"]
    const mealType = ["DESAYUNO", "ALMUERZO", "COMIDA", "MERIENDA", "CENA"]
    const navigate = useNavigate()

    const fetchData = (day, mealType, planData) => {
        return planData[day][mealType] ? planData[day][mealType].receta_nombre : null;
    }
    const fetchRecipePlanningData = async () => {
        try {
            const recipeResponse = await fetch("/api/recipes");
            const data = await recipeResponse.json();
            const planningResponse = await fetch("/api/planning")
            const validateData = (await planningResponse.json()).data;
            setRecipeData(data.data.recetas)
            setPlanningData(validateData)
        } catch (error) {
            setError("No se han podido cargar los datos")
        }
        setLoading(false)
    }

    const fetchModalRecipes = async () => {
        const response = await fetch(`/api/recipes/search?searchType=recipe&searchTerm=${modalSearch}&page=${modalPage}&limit=${modalLimit}`);
        const data = await response.json();
        setModalRecipes(data);
    }

    const handleSlot = (dia, comida) => {
        setSlot({
            day: dia,
            meal: comida
        })
        setModalSearch("");
        setModalPage(1);
        setSelectedRecipe(null);
        setModal(true);
    }
    const handleFilter = async () => {
        setLoading(true)
        await fetchModalRecipes()
        setLoading(false)
    }

    const handleSearchParam = () => {
        setModalSearch("");
    }

    const handleRecipeSelect = (recipeId) => {
        setSelectedRecipe(recipeId)
    }

    const handleAssignRecipe = () => {
        if (selectedRecipe != null) {
            const selectedRecipeData = modalRecipes.data.recipes.find(recipe => recipe.receta_id === selectedRecipe);
            if (selectedRecipeData != undefined) {
                const recipeName = selectedRecipeData.receta_nombre;
                const key = `${slot.day}_${slot.meal}`;
                setPendingChanges(prev => ({
                    ...prev,
                    [key]: {
                        receta_id: selectedRecipe,
                        receta_nombre: recipeName
                    }
                }))
                setSelectedRecipe(null)
                setModalSearch("")
                setModalPage(1)
                setModal(false)
            }
        }
    }

    const getSlotStatus = (day, mealType) => {
        const key = `${day}_${mealType}`;
        const hasServerData = fetchData(day, mealType, planningData);
        const hasPendingChange = pendingChanges[key];

        if (hasPendingChange) {
            return 'pending';
        } else if (hasServerData) {
            return 'assigned';
        } else {
            return 'empty';
        }
    }

    const handleClearSlot = () => {
        const key = `${slot.day}_${slot.meal}`;

        setPendingChanges(prev => {
            const newChanges = {
                ...prev,
                [key]: {
                    action: 'delete',
                    day: slot.day,
                    tipo_comida: slot.meal,
                    receta_id: planningData[slot.day][slot.meal].receta_id
                }
            };
            return newChanges;
        });

        setModal(false);
    }

    const handleSaveChanges = async () => {
        setLoading(true);

        for (const [key, assignment] of Object.entries(pendingChanges)) {
            console.log('Processing assignment:', assignment);
            if (assignment.action === 'delete') {
                console.log('Sending delete request:', { day: assignment.day, tipo_comida: assignment.tipo_comida });
                const response = await fetch('/api/planning/deleteRecipe', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        day: assignment.day,
                        tipo_comida: assignment.tipo_comida,
                        receta_id: planningData[slot.day][slot.meal].receta_id
                    })
                });

                if (!response.ok) {
                    alert(`Error eliminando receta`);
                    setLoading(false);
                    return;
                }
            } else {
                const [day, tipo_comida] = key.split('_');
                const response = await fetch('/api/planning/asignRecipe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        receta_id: assignment.receta_id,
                        day: day,
                        tipo_comida: tipo_comida
                    })
                });

                if (!response.ok) {
                    alert(`Error guardando ${assignment.receta_nombre}`);
                    setLoading(false);
                    return;
                }
            }
        }

        await fetchRecipePlanningData();
        setPendingChanges({});
        setLoading(false);
        alert("Todos los cambios guardados correctamente");
    }

    const handleDownloadPDF = async () => {
        console.log('Usuario:', user);

        if (!planningData) {
            alert('No hay datos de planificación cargados');
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
            console.error('Error generando PDF:', error);
            alert('Error generando el PDF');
        }
    };

    useEffect(() => {
        if (modal) {
            fetchModalRecipes()
        }
    }, [modal, modalPage])

    useEffect(() => {
        fetchRecipePlanningData()
    }, [])

    return (
        <MainContainer title="Planificación semanal">
            <div className='relative h-full max-w-7xl p-10 flex flex-col gap-4'>
                {!loading && (
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
                                                className={`py-1 px-2 text-center rounded-lg transition-all duration-300 flex items-center justify-center border-2 ${slotStyles[slotStatus]}`}>
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

                <div className='flex flex-row w-full gap-4 flex-shrink-0 sticky bottom-0'>
                    <button
                        onClick={() => handleDownloadPDF()}
                        className="flex-1 bg-brand-primary/85 hover:bg-brand-primary text-white px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                    >
                        Descargar planificación
                    </button>
                    <button
                        onClick={() => handleSaveChanges()}
                        disabled={Object.keys(pendingChanges).length === 0}
                        className="flex-1 bg-brand-secondary/85 hover:bg-brand-secondary text-white px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Guardar cambios
                    </button>

                </div>
            </div>

            {modal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-10">
                    <div className="w-full h-full bg-white p-6 rounded-lg flex flex-col">
                        <h1 className='mb-5 flex-shrink-0'>Asignación de receta para <span className='text-brand-primary/85'>{slot.meal}</span> del  <span className='text-brand-secondary/85'>{slot.day}</span></h1>

                        <div className="flex gap-4 px-4 w-full mb-5 flex-shrink-0">
                            <input
                                type="text"
                                value={modalSearch}
                                onChange={(e) => setModalSearch(e.target.value)}
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
                                onClick={handleSearchParam}
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

                        {modalRecipes?.data?.recipes && (
                            <div className="flex-shrink-0 sticky bottom-0 bg-white pt-4 border-t border-gray-200">
                                <div className="flex justify-center items-center gap-4 px-4 w-full">
                                    <button
                                        onClick={() => setModalPage(prev => Math.max(prev - 1, 1))}
                                        hidden={modalPage === 1}
                                        className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                                    >
                                        Anterior
                                    </button>

                                    <span className="text-gray-700">
                                        Página {modalPage} de {modalRecipes.data.totalPages}
                                    </span>

                                    <button
                                        onClick={() => setModalPage(prev => Math.min(prev + 1, modalRecipes.data.totalPages))}
                                        hidden={modalPage === modalRecipes.data.totalPages}
                                        className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className='flex flex-row w-full gap-4 flex-shrink-0 sticky bottom-0 bg-white pt-4'>
                            <button
                                onClick={() => {
                                    setSelectedRecipe(null);
                                    setModal(false);
                                }}
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Volver
                            </button>

                            {getSlotStatus(slot.day, slot.meal) === 'assigned' && (
                                <button
                                    onClick={() => handleClearSlot()}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                                >
                                    Vaciar asignación
                                </button>
                            )}

                            <button
                                onClick={() => handleAssignRecipe()}
                                disabled={selectedRecipe == null}
                                className="flex-1 bg-brand-secondary/85 hover:bg-brand-secondary text-white px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Asignar receta
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </MainContainer>
    )
}