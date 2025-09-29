import React, { useEffect, useState, useRef } from 'react'
import loginFondo from '../assets/loginFondo.webp'
import registerFondo from '../assets/registerFondo.webp'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Loader } from '../components/ui/Loader'
import { gsap } from "gsap"
import { LoginForm } from "../components/auth/LoginForm.jsx"
import { RegisterForm } from '../components/auth/RegisterForm.jsx'

export const RegisterLogin = () => {
    //Estados para redirección de valores no válidos
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams()
    const [activeTab, setActiveTab] = useState(null);
    const navigate = useNavigate();

    //Referencias para animaciones
    const loginFormRef = useRef()
    const registerFormRef = useRef()
    const loginImageRef = useRef()
    const registerImageRef = useRef()

    useEffect(() => {
        const tabValue = searchParams.get('tab')
        if (tabValue === 'login' || tabValue === 'register') {
            setLoading(false)
            setActiveTab(tabValue)
        } else {
            setLoading(false)
            navigate('/')
        }
    }, [searchParams])

    useEffect(() => {
        if (activeTab && loginFormRef.current) {
            if (activeTab === 'login') {
                gsap.set(loginFormRef.current, { opacity: 1, filter: "blur(0px)", scale: 1 })
                gsap.set(registerImageRef.current, { opacity: 0.65, filter: "blur(0px) brightness(0.65)", scale: 1 })
                gsap.set(registerFormRef.current, { opacity: 0, filter: "blur(0px)", scale: 1 })
                gsap.set(loginImageRef.current, { opacity: 0, filter: "blur(0px) brightness(0.65)", scale: 1 })
            } else if (activeTab === 'register') {
                gsap.set(registerFormRef.current, { opacity: 1, filter: "blur(0px)", scale: 1 })
                gsap.set(loginImageRef.current, { opacity: 0.65, filter: "blur(0px) brightness(0.65)", scale: 1 })
                gsap.set(loginFormRef.current, { opacity: 0, filter: "blur(0px)", scale: 1 })
                gsap.set(registerImageRef.current, { opacity: 0, filter: "blur(0px) brightness(0.65)", scale: 1 })
            }
        }
    }, [activeTab])

    const handleActiveTab = (newTab) => {
        const tl = gsap.timeline()

        if (newTab === 'login') {
            tl.to([registerFormRef.current, loginImageRef.current], {
                filter: "blur(5px) brightness(0.65)",
                scale: 0.95,
                opacity: 0,
                duration: 0.4
            })
                .to(loginFormRef.current, {
                    filter: "blur(0px)",
                    scale: 1,
                    opacity: 1,
                    duration: 0.4
                })
                .to(registerImageRef.current, {
                    filter: "blur(0px) brightness(0.65)",
                    scale: 1,
                    opacity: 0.65,
                    duration: 0.4
                }, "-=0.4")
                .call(() => {
                    setActiveTab(newTab)
                    setSearchParams({ tab: newTab })
                })
        } else if (newTab === 'register') {
            tl.to([loginFormRef.current, registerImageRef.current], {
                filter: "blur(5px) brightness(0.65)",
                scale: 0.95,
                opacity: 0,
                duration: 0.4
            })
                .to(registerFormRef.current, {
                    filter: "blur(0px)",
                    scale: 1,
                    opacity: 1,
                    duration: 0.4
                })
                .to(loginImageRef.current, {
                    filter: "blur(0px) brightness(0.65)",
                    scale: 1,
                    opacity: 0.65,
                    duration: 0.4
                }, "-=0.4")
                .call(() => {
                    setActiveTab(newTab)
                    setSearchParams({ tab: newTab })
                })
        }
    }

    return loading ? <Loader /> : (
        <div className='w-screen h-screen flex justify-center bg-brand-primary/90 overflow-hidden'>
            <div className="absolute top-4 left-0 right-0 px-10 flex z-50">
                <button
                    onClick={() => handleActiveTab('login')}
                    className={` w-3/7 px-6 py-2 rounded-l-lg mask-r-from-60% ${activeTab === 'login'
                        ? 'bg-brand-secondary/90 text-white'
                        : 'bg-gray-700 text-gray-300'
                        }`}
                >
                    Inicio de sesión
                </button>
                <button
                    onClick={() => navigate('/')}
                    className='w-1/7 px-3 py-2 rounded-l-lg mask-r-from-60% mask-l-from-60% bg-brand-secondary/35 border border-t-2 border-b-2 border-amber-600 text-gray-300'
                >
                    Home
                </button>
                <button
                    onClick={() => handleActiveTab('register')}
                    className={` w-3/7 px-6 py-2 rounded-r-lg mask-l-from-60% ${activeTab === 'register'
                        ? 'bg-brand-secondary/90 text-white'
                        : 'bg-gray-700 text-gray-300'
                        }`}
                >
                    Registro
                </button>
            </div>

            <section className='w-full h-full relative flex items-center'>
                <div ref={loginImageRef}
                    className={`absolute inset-0 bg-cover bg-center bg-no-repeat
        mask-r-from-80% brightness-65`}
                    style={{ backgroundImage: `url(${loginFondo})` }}
                />
                <main ref={loginFormRef} className={`relative z-10 w-full h-full flex flex-col justify-center items-center gap-5 px-4`}>
                    <LoginForm></LoginForm>
                </main>
            </section>
            <section className='w-full h-full relative flex items-center'>
                <div ref={registerImageRef}
                    className={`absolute inset-0 bg-cover bg-center bg-no-repeat
        mask-l-from-80% brightness-65`}
                    style={{ backgroundImage: `url(${registerFondo})` }}
                />
                <main ref={registerFormRef} className={`relative z-10 w-full h-full flex flex-col justify-center items-center gap-5 px-4`}>
                    <RegisterForm></RegisterForm>
                </main>
            </section>
        </div >
    )
}