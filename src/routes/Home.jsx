import { getAuth, signOut } from 'firebase/auth'
import React from 'react'
import app from '../firebase/firebaseConfig'

const auth = getAuth(app)

function Home() {

  return (
    <div>
        Home
        {/* <button>Cerrar sesión</button> */}
    </div>
  )
}

export default Home