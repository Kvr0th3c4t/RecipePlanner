import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../../context/UserContext'

export const LoginForm = () => {
    const { login } = useUser()
    const [data, setData] = useState({ email: '', contraseña: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setError("")
        e.preventDefault();

        if (!data.email || !data.contraseña) return;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(data.email)) {
            setError("Formato de email inválido");
            return;
        }

        setLoading(true);

        try {

            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: data.email,
                    contraseña: data.contraseña
                })
            })

            if (response.ok) {
                const jsonData = await response.json();
                login(jsonData.data)
                navigate('/dashboard');
            } else {
                const jsonData = await response.json();
                const error = jsonData.error;
                setError(error)
            }
        } catch (error) {
            setError("Error al hacer login")
        } finally {
            setLoading(false);
        }
    }
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }
    return (
        <section className='p-10'>
            <form action="" onSubmit={handleSubmit} className='flex flex-col justify-center items-center gap-5 py-20'>
                <label htmlFor="email">Email</label>
                <input className='' name='email' id='email' placeholder='test@hotmail.com' type='text' value={data.email} onChange={handleChange}></input>
                <label htmlFor='contraseña'>Contraseña</label>
                <input name="contraseña" id='contraseña' placeholder='Ingrese la contraseña' type='password' value={data.contraseña} onChange={handleChange}></input>
                <button
                    className="
                                 bg-brand-secondary/85 text-white 
                                hover:bg-brand-secondary 
                                focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 focus:ring-offset-2
                                px-2 py-1 
                                rounded-lg 
                                safe-touch 
                                transition-colors duration-200 
                                font-medium text-lg
                                shadow-lg hover:shadow-xl
                                flex items-center gap-2
                                w-full max-w-[100px]
                                justify-center
                                backdrop-blur-sm
                            "
                >Enviar
                </button>
            </form>
            <span>{error}</span>
        </section>
    )
}
