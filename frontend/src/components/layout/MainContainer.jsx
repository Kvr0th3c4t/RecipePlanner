import React from 'react'
import { useUser } from '../../../context/UserContext.jsx'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/logoSinTexto.svg"
import home from "../../assets/home.webp"
import recetas from "../../assets/recetas.webp"
import calendario from "../../assets/calendario.webp"
import salir from "../../assets/salir.webp"
import left from "../../assets/left.webp"
import right from "../../assets/right.webp"

export const MainContainer = ({ title, children }) => {
    const { user, logout, sidebarExpanded, toggleSidebar } = useUser();

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogout = async (e) => {
        const success = await logout();

        if (success) {
            navigate("/");
        } else {
            setError("Error al hacer logout");
        }
    }

    return (
        <main className='flex flex-row h-screen w-screen bg-gray-800/20'>
            <aside className={`flex flex-col ${sidebarExpanded ? 'w-1/4' : 'w-26'} h-full bg-brand-primary shadow-lg`}>
                <div className="flex flex-row p-6 border-b border-white/20">
                    <div className='flex flex-col gap-2 items-center w-full justify-center'>
                        <picture className=''>
                            <img
                                src={logo}
                                className={`${sidebarExpanded ? 'h-12 w-12' : 'h-11 w-11'}  rounded-3xl object-cover`}
                                alt="RecipePlanner Logo"
                            />
                        </picture>
                        {sidebarExpanded && (
                            <div className='flex flex-col col-span-2 items-center text-center gap-2 w-full'>
                                <h1 className="text-xl font-bold text-white leading-tight">
                                    RecipePlanner
                                </h1>
                            </div>
                        )}
                    </div>
                </div>

                <nav className="flex-1 p-4 mt-10">
                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="
                    w-full text-center px-4 py-3 
                    rounded-lg 
                    text-white/90 hover:text-white 
                    hover:bg-white/10 
                    focus:outline-none focus:ring-2 focus:ring-white/30 
                    safe-touch 
                    transition-all duration-200 
                    font-medium
                    border border-transparent hover:border-white/20
                    hover:shadow-sm
                ">
                                {sidebarExpanded ? "Panel de control" : <img
                                    src={home}
                                    className='h-10 w-10 rounded-3xl object-cover'
                                    alt="RecipePlanner Logo"
                                />}
                            </button>
                        </li>

                        <li>
                            <button
                                onClick={() => navigate('/myRecipes')}
                                className="
                    w-full text-center px-4 py-3 
                    rounded-lg 
                    text-white/90 hover:text-white 
                    hover:bg-white/10 
                    focus:outline-none focus:ring-2 focus:ring-white/30 
                    safe-touch 
                    transition-all duration-200 
                    font-medium
                    border border-transparent hover:border-white/20
                    hover:shadow-sm
                ">
                                {sidebarExpanded ? "Mis Recetas" : <img
                                    src={recetas}
                                    className='h-10 w-10 rounded-3xl object-cover'
                                    alt="RecipePlanner Logo"
                                />}
                            </button>
                        </li>

                        <li>
                            <button
                                onClick={() => navigate('/recipePlanner')}
                                className="
                    w-full text-center px-4 py-3 
                    rounded-lg 
                    text-white/90 hover:text-white 
                    hover:bg-white/10 
                    focus:outline-none focus:ring-2 focus:ring-white/30 
                    safe-touch 
                    transition-all duration-200 
                    font-medium
                    border border-transparent hover:border-white/20
                    hover:shadow-sm
                ">
                                {sidebarExpanded ? "Planificación Semanal" : <img
                                    src={calendario}
                                    className='h-10 w-10 rounded-3xl object-cover'
                                    alt="RecipePlanner Logo"
                                />}
                            </button>
                        </li>
                    </ul>
                </nav>

                <div className="p-4 border-t border-white/20 space-y-3">
                    <button
                        onClick={toggleSidebar}
                        className="
                w-full px-2 py-1 
                bg-yellow-600/85 text-white 
                hover:bg-yellow-600
                focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-brand-primary
                rounded-lg 
                safe-touch 
                transition-all duration-200 
                font-medium
                shadow-sm hover:shadow-md
                border border-white/10 hover:border-white/30
            "
                    >
                        {sidebarExpanded ? "Minimizar menú"
                            : <img
                                src={right}
                                className='h-9 w-9 rounded-3xl object-cover'
                                alt="RecipePlanner Logo"
                            />}
                    </button>

                    {error && (
                        <div className="
                px-3 py-2 
                bg-red-100 border border-red-300 
                text-red-800 text-sm 
                rounded-lg
                shadow-sm
            ">
                            ⚠️ {error}
                        </div>
                    )}

                    <button
                        onClick={handleLogout}
                        className="
                w-full px-2 py-1 
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
                        {sidebarExpanded ? "Cerrar Sesión" : <img
                            src={salir}
                            className='h-9 w-9 rounded-3xl object-cover'
                            alt="RecipePlanner Logo"
                        />}
                    </button>
                </div>
            </aside>
            <div className='flex flex-col items-center h-screen w-full'>
                <header className='flex flex-row justify-between px-15 py-3 items-center w-full bg-brand-secondary/75 border-b border-l border-white/20'>
                    <h1 className='inline-block'>{title}</h1>
                    <span className='inline-block'>
                        Bienvenid@ {user ? user.username : " usuario"}
                    </span>
                </header>
                <div className='flex justify-between items-center h-full'>
                    <div className="absolute inset-0 -z-10 h-full w-full bg-[oklch(44.4%_0.011_73.639_/_0.05)] bg-[linear-gradient(to_right,oklch(51.1%_0.096_186.391_/_0.2)_1px,transparent_1px),linear-gradient(to_bottom,oklch(51.1%_0.096_186.391_/_0.2)_1px,transparent_1px)] bg-[size:6rem_4rem] [&>div]:absolute [&>div]:inset-0 [&>div]:bg-[radial-gradient(circle_800px_at_100%_200px,oklch(64.6%_0.222_41.116_/_0.06),transparent)]"></div>
                    {children}
                </div>
            </div>
        </main >
    )
}