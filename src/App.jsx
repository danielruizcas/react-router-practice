import { useState } from 'react'
import './App.css'
import Home from './routes/Home'
import Login from './routes/Login'
import app from './firebase/firebaseConfig'
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { BrowserRouter, Link, Route, Routes, useNavigate } from 'react-router-dom'
import Cliente from './routes/Cliente'
import Administrador from './routes/Administrador'
import Operador from './routes/Operador'
import { ProtectedRoute } from './components/ProtectedRoute'

const auth = getAuth(app)

function App() {
  /* const navigate = useNavigate() */
  const [user, setUser] = useState(null)

  onAuthStateChanged(auth, (usuarioFirebase) => {
    if (usuarioFirebase) {
      setUser(usuarioFirebase)
      /* navigate("/home") */
    } else {
      setUser(null)
    }
  })
  /* const login = () => {
    setUser({
      uid: "72c8d7c0-735a-11ee-b50e-dfa93bc739e0",
      processCompleted: true,
      correo: "correodeprueba@gmail.com",
      displayName: "Anonimo",
      permissions: ["operador"],
      rol: ["Admin"]
    })
  }
 */
/*   const logout = () => setUser(null) */

  function Navigation() {
    return (
      <nav>
        <ul>
          <li>
            <Link to="/" >Login</Link>
          </li>
          <li>
            <Link to="/home" >Home</Link>
          </li>
          <li>
            <Link to="/client" >Cliente</Link>
          </li>
          <li>
            <Link to="/operador" >Operador</Link>
          </li>
          <li>
            <Link to="/admin" >Administrador</Link>
          </li>
        </ul>
      </nav>
    )
  }
  return (
    <>
      <BrowserRouter>
        <Navigation></Navigation>
        {/* {
          user ? (
            <button onClick={logout}>Logout</button>
          ) : (
            <button onClick={login}>Login</button>
          )
        } */}
        <Routes>
          <Route path='/' element={<Login />} />
          <Route element={<ProtectedRoute isAllowed={!!user} />}>
            <Route path='/home' element={<Home />} />
            <Route path='/client' element={<Cliente />} />
          </Route>
          <Route path='/operador' element={<ProtectedRoute isAllowed={!!user /* && user.permissions.includes("operador") */} redirectTo="/home">
            <Operador />
          </ProtectedRoute>} />
          <Route path='/admin' element={<ProtectedRoute isAllowed={!!user /* && user.rol.includes("Admin") */} redirectTo="/home">
            <Administrador />
          </ProtectedRoute>} />
          <Route path='*' element={<>Not Found</>} />
        </Routes>
      </BrowserRouter>
      {/* {
        user ? <Home /> : <Login />
      } */}
    </>
  )
}

export default App
