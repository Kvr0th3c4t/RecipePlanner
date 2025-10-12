import { AppRoutes } from '../routing/AppRoutes.jsx'
import { UserProvider } from '../context/UserContext.jsx'
import { Toaster } from 'react-hot-toast'; // ✅ AGREGAR ESTO

function App() {
  return (
    <UserProvider>
      <div className='App'>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#00786F',
                secondary: '#fff',
              },
            },
          }}
        />
        <AppRoutes></AppRoutes>
      </div>
    </UserProvider>
  )
}

export default App