import React from 'react'
import logo from '../../assets/logoSinTexto.svg'

export const Loader = () => {
    return (
        <div className='w-screen h-screen flex justify-center items-center gap-15 bg-brand-primary/90'>
            <picture className='h-25 w-25 animate-spin rounded-full'>
                <img src={logo} alt="" />
            </picture>
            <p className='text-2xl text-white font-bold drop-shadow-lg'>Cargando planner...</p>
        </div>
    )
}
