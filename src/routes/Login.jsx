import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useState } from 'react'
import app from '../firebase/firebaseConfig'
import { getFirestore, doc, setDoc } from "firebase/firestore"
import { useNavigate } from 'react-router-dom'

const auth = getAuth(app)
const firestore = getFirestore(app)

function Login() {
    const [isRegistrando, setIsRegistrando] = useState(false)
    const navigate = useNavigate()

    const submitHandler = (e) => {
        e.preventDefault()
        const email = e.target.elements.email.value
        const password = e.target.elements.contrasena.value
        const rol = e.target.elements.rol?.value

        async function registerSubmit(email, password, rol) {
            const authentification = await createUserWithEmailAndPassword(auth, email, password)
                .then((usuarioFirebase) => (
                    usuarioFirebase
                ))
            console.log(authentification)
            const docuRef = await doc(firestore, `usuarios/${authentification.user.uid}`)
            setDoc(docuRef, { correo: email, rol, uid: authentification.user.uid })
        }

        if (isRegistrando) {
            //registrar
            registerSubmit(email, password, rol)
        } else {
            //login
            signInWithEmailAndPassword(auth, email, password).then(() => (navigate("/home")))
        }
    }

    return (
        <div>
            <h1>
                {isRegistrando ? "Registrate" : "Inicia sesión"}
            </h1>
            <form onSubmit={submitHandler}>
                <label htmlFor="">
                    Correo electrónico:
                    <input type="email" id='email' />
                </label>
                <label htmlFor="">
                    Contraseña:
                    <input type="password" id='contrasena' />
                </label>
                {
                    isRegistrando && <label htmlFor="">
                        Rol:
                        <select name="rol" id="rol">
                            <option value="admin">Administrador</option>
                            <option value="operador">Operador</option>
                            <option value="cliente">Cliente</option>
                        </select>
                    </label>
                }
                <input type="submit" value={isRegistrando ? "Registrar" : "Iniciar sesión"} />
                <button type='button' onClick={() => setIsRegistrando(!isRegistrando)}>
                    {
                        isRegistrando ? "Ya tengo una cuenta" : "Quiero registrarme"
                    }
                </button>
            </form>
        </div>
    )
}

export default Login