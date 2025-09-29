import React from 'react'
import planning from "../../assets/planning.png"
import { useNavigate } from 'react-router-dom'

export const EmptyStatePlanning = () => {

    const navigate = useNavigate()

    return (
        <div className="p-6 h-full">
            <section className='grid grid-cols-3 items-center '>

                <picture className='flex justify-center'>
                    <img
                        src={planning}
                        alt='Niña mirando un calendario'
                        className="w-full h-auto max-w-sm rounded-lg"
                    />
                </picture>
                <div className='flex flex-col justify-center items-center col-span-2 space-y-4'>
                    <h1 className="text-4xl text-gray-900 font-semibold">
                        ¡Hora de planificar una comida!
                    </h1>
                    <h3 className="text-2xl text-gray-700 font-medium">
                        Puedes hacerlo desde este menú
                    </h3>

                    <button
                        onClick={() => navigate("/planning/add")}
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
                        Ir a crear planificación
                    </button>
                </div>
            </section>
        </div >
    )
}