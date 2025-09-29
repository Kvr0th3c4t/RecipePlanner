import React from 'react'
import { useNavigate } from 'react-router-dom'
import logo from "../assets/logoSintexto.svg"
import fondo from "../assets/fondoHome.webp"

export const Home = () => {
    const navigate = useNavigate()

    return (
        <section className='h-screen w-screen justify-center items-center bg-brand-primary/90 relative'>
            <div
                className='absolute inset-0 bg-cover bg-center bg-no-repeat
                mask-radial-[100%_100%] mask-radial-from-40% mask-radial-at-right
                mask-t-from-93% mask-b-from-93% mask-r-from-93%'
                style={{ backgroundImage: `url(${fondo})` }}
            />

            <main className='relative z-10 min-h-screen flex justify-left items-center py-20 text-center'>
                <div className='flex flex-col pl-20'>
                    <div className="flex items-center mb-10 gap-4">
                        <picture>
                            <img
                                className="h-24 w-24 rounded-full p-2 bg-white shadow-md"
                                src={logo}
                                alt="Logo"
                            />
                        </picture>
                        <div className="flex flex-col">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl text-white font-bold drop-shadow-xl">
                                RecipePlanner
                            </h1>
                            <span className="mt-1 text-[0.60rem] tracking-wide text-white font-bold bg-brand-secondary/85 px-3 py-1 rounded-full shadow-sm w-fit">
                                MVP · Early Access
                            </span>
                        </div>
                    </div>



                    <div className='mb-20 pl-37 justify-center text-left'>
                        <h1 className='text-xl py-4 text-white font-bold drop-shadow-lg'>Crea tus propias recetas</h1>
                        <h2 className='text-xl py-4 text-white font-semibold drop-shadow-md'>Organiza tus recetas durante la semana</h2>
                        <h3 className='text-xl py-4 text-white drop-shadow-md'>Descarga tu lista de la compra</h3>
                    </div>

                    <div className='flex justify-evenly gap-4'>
                        <button
                            onClick={() => navigate('/registerLogin?tab=register')}
                            className="
                                bg-brand-secondary/85 text-white 
                                hover:bg-brand-secondary 
                                focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 focus:ring-offset-2
                                px-5 py-3 
                                rounded-lg 
                                safe-touch 
                                transition-colors duration-200 
                                font-medium text-lg
                                shadow-lg hover:shadow-xl
                                flex items-center gap-2
                                w-full max-w-[250px]
                                justify-center
                                backdrop-blur-sm
                            "
                        >Registro
                        </button>

                        <button
                            onClick={() => navigate('/registerLogin?tab=login')}
                            className="
                                text-white 
                                bg-brand-primary/55
                                hover:bg-brand-primary
                                outline-2 outline-brand-primary
                                focus:ring-2 focus:ring-brand-primary/50 focus:ring-offset-2
                                px-5 py-3 
                                rounded-lg 
                                safe-touch 
                                transition-colors duration-200 
                                font-medium text-lg
                                shadow-lg hover:shadow-xl
                                flex items-center gap-2
                                w-full max-w-[250px]
                                justify-center
                                backdrop-blur-sm
                            "
                        >
                            Login
                        </button>
                    </div>
                </div>
            </main>
        </section>
    )
}