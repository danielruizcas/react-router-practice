import { useEffect, useState } from 'react'
import './App.css'
import Home from './routes/Home'
import Login from './routes/Login'
import app from './firebase/firebaseConfig'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import Cliente from './routes/Cliente'
import Administrador from './routes/Administrador'
import Operador from './routes/Operador'
import { ProtectedRoute } from './components/ProtectedRoute'
import { getDoc, getFirestore, doc } from 'firebase/firestore'

const auth = getAuth(app)
const firestore = getFirestore(app)

function App() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, handleUserStateChange)
  }, [])

  function handleUserStateChange(usuarioFirebase) {
    if (usuarioFirebase) {
      getRol(usuarioFirebase.uid).then((rol) => {
        const userData = {
          uid: usuarioFirebase.uid,
          email: usuarioFirebase.email,
          rol: rol
        }
        setUser(userData)
        setIsLoading(false)
      })
      console.log(user)
    } else {
      setUser(null)
      console.log("No hay nadie logueado")
      setIsLoading(false)
    }
  }

  async function getRol(uid) {
    const documentRef = doc(firestore, `usuarios/${uid}`)
    const document = await getDoc(documentRef)
    const dataFinal = document.data().rol
    return dataFinal
  }

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
        {
          isLoading ? (
            <div>Loading...</div>
          ) : (
            <Routes>
              <Route element={<ProtectedRoute isAllowed={!user} redirectTo='/home' />} >
                <Route path='/' element={<Login />} />
              </Route>
              <Route element={<ProtectedRoute isAllowed={!!user} />}>
                <Route path='/home' element={<Home />} />
                <Route path='/client' element={<Cliente />} />
              </Route>
              <Route path='/operador' element={<ProtectedRoute isAllowed={!!user && (user.rol === "operador" || user.rol === "admin")} redirectTo="/home">
                <Operador />
              </ProtectedRoute>} />
              <Route path='/admin' element={<ProtectedRoute isAllowed={!!user && user.rol === "admin"} redirectTo="/home">
                <Administrador />
              </ProtectedRoute>} />
              <Route path='*' element={<>Not Found</>} />
            </Routes>
          )}
        <button onClick={() => { signOut(auth) }}>Sign out</button>
      </BrowserRouter>
    </>
  )
}

export default App
