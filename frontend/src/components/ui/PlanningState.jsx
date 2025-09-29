import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useUser } from '../../../context/UserContext.jsx'
import { pdf } from '@react-pdf/renderer'
import ShoppingListPDFDocument from '../pdf/ShoppingListPDFDocument.jsx'

export const PlanningState = () => {
    const { user } = useUser();
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [planningData, setPlanningData] = useState()
    const days = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"]
    const mealType = ["DESAYUNO", "ALMUERZO", "COMIDA", "MERIENDA", "CENA"]
    const navigate = useNavigate()

    const fetchData = (day, mealType, planData) => {
        return planData[day][mealType] ? planData[day][mealType].receta_nombre : null;
    }

    const fetchPlanning = async () => {
        try {
            const response = await fetch("/api/planning")
            const validateData = (await response.json()).data;
            setPlanningData(validateData)
            setLoading(false)
        } catch (error) {
            setError("No se han podido cargar los datos")
        }
    }

    const handleDownloadShoppingList = async () => {
        try {
            const response = await fetch('/api/planning/shopping-list');
            const data = await response.json();

            if (!data.success || !data.data.categorias) {
                alert('No se pudieron cargar los ingredientes');
                return;
            }

            const userName = user?.username || user?.email?.split('@')[0] || "Usuario";

            const blob = await pdf(
                <ShoppingListPDFDocument
                    categorias={data.data.categorias}
                    userName={userName}
                />
            ).toBlob();

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `lista-compras-${new Date().toISOString().split('T')[0]}.pdf`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error generando lista de compras:', error);
            alert('Error generando la lista de compras');
        }
    };

    useEffect(() => {
        fetchPlanning()
    }, [])

    return (
        <div className='relative h-full max-w-7xl px-4 flex flex-col gap-4'>
            <div className="flex-shrink-0 mb-3">
                <h1 className='text-2xl font-bold text-gray-800'>Tu Planificación Semanal</h1>
            </div>

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
                                    return (
                                        <div key={`${comida}-${dia}`}
                                            className={`py-1 px-2 text-center rounded-lg transition-all duration-300 flex items-center justify-center border-2 ${hasData
                                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-sm hover:shadow-md hover:bg-emerald-100'
                                                : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                                                }`}>
                                            {hasData ? (
                                                <div className="flex flex-col items-center">
                                                    <div className="w-2 h-2 bg-emerald-500 rounded-full mb-1"></div>
                                                    <span className="text-xs font-medium leading-tight text-center line-clamp-2 text-wrap">
                                                        {hasData}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <div className="w-2 h-2 bg-gray-300 rounded-full mb-1"></div>
                                                    <span className="text-xs">Sin planificar</span>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </React.Fragment>
                        ))}
                    </section>
                </div>
            )}

            <div className="flex-shrink-0">
                <div className="grid grid-cols-3 gap-x-6 max-w-7xl">


                    <div className="flex flex-col h-full">
                        <div className="flex-1">
                            <p className="text-sm text-gray-700 leading-relaxed text-center">
                                Crea todas las recetas que vayas a usar durante la semana
                            </p>
                        </div>
                        <div className="flex justify-center">
                            <button
                                onClick={() => navigate('/recipe/new')}
                                className="
                                    bg-brand-secondary/85 text-white 
                                    hover:bg-brand-secondary
                                    focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 focus:ring-offset-2
                                    px-5 py-3 
                                    rounded-lg 
                                    safe-touch 
                                    transition-colors duration-200 
                                    font-medium text-sm
                                    shadow-sm hover:shadow-md
                                    flex items-center gap-2
                                    w-full max-w-[180px]
                                    justify-center
                                "
                            >
                                Crear receta
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col h-full">
                        <div className="flex-1">
                            <p className="text-sm text-gray-700 leading-relaxed text-center">
                                Añade todas las recetas que has creado a tu calendario de planificación semanal
                            </p>
                        </div>
                        <div className="flex justify-center">
                            <button
                                onClick={() => navigate('/recipePlanner')}
                                className="
                                    bg-brand-primary/85 text-white 
                                    hover:bg-brand-primary
                                    focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:ring-offset-2
                                    px-5 py-3 
                                    rounded-lg 
                                    safe-touch 
                                    transition-colors duration-200 
                                    font-medium text-sm
                                    shadow-sm hover:shadow-md
                                    flex items-center gap-2
                                    w-full max-w-[180px]
                                    justify-center
                                "
                            >
                                Planificar semana
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col h-full">
                        <div className="flex-1">
                            <p className="text-sm text-gray-700 leading-relaxed text-center">
                                Fabrica tu lista de la compra en un solo click
                            </p>
                        </div>
                        <div className="flex justify-center">
                            <button
                                onClick={() => handleDownloadShoppingList()}
                                className="
                                    bg-brand-accent/85 text-white 
                                    hover:bg-brand-accent
                                    focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:ring-offset-2
                                    px-5 py-3 
                                    rounded-lg 
                                    safe-touch 
                                    transition-colors duration-200 
                                    font-medium text-sm
                                    shadow-sm hover:shadow-md
                                    flex items-center gap-2
                                    w-full max-w-[180px]
                                    justify-center
                                "
                            >
                                Lista de compra
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}