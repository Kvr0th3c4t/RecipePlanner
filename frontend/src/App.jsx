
import { AppRoutes } from '../routing/AppRoutes.jsx'
import { UserProvider } from '../context/UserContext.jsx'

function App() {

  return (
    <UserProvider>
      <div className='App'>
        <AppRoutes></AppRoutes>
      </div>
    </UserProvider>


  )
}

export default App
