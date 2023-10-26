import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import React, { useState } from 'react'
import app from '../firebase/firebaseConfig'
import { getFirestore, doc, setDoc } from "firebase/firestore"

const auth = getAuth(app)
const firestore = getFirestore(app)

function Login() {
    const [isRegistrando, setIsRegistrando] = useState(false)

    const submitHandler = (e) => {
        e.preventDefault()
        const email = e.target.elements.email.value
        const password = e.target.elements.contrasena.value
        const rol = e.target.elements.rol.value
        console.log("Hola ", email, password, rol)

        async function registerSubmit(email, password, rol){
            const authentification = await createUserWithEmailAndPassword(auth, email, password)
            .then((usuarioFirebase)=>(
                usuarioFirebase
            ))
            console.log(authentification)
            const docuRef = await doc(firestore, `usuarios/${authentification.user.uid}`)
            setDoc(docuRef, {correo: email, rol})
        }

        if(isRegistrando){
            //registrar
            registerSubmit(email, password, rol)
        }/* else{
            //login
        } */
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
                <lapbel htmlFor="">
                    Rol:
                    <select name="rol" id="rol">
                        <option value="admin">Administrador</option>
                        <option value="operador">Operador</option>
                        <option value="cliente">Cliente</option>
                    </select>
                    <input type="submit" value={isRegistrando ? "Registrar" : "Iniciar sesión"} />
                    <button type='button' onClick={() => setIsRegistrando(!isRegistrando)}>
                        {
                            isRegistrando ? "Ya tengo una cuenta" : "Quiero registrarme"
                        }
                    </button>
                </lapbel>
            </form>
        </div>
    )
}

export default Login