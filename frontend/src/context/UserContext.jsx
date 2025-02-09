import { useState } from 'react'
import { createContext } from 'react'

const UserContext = createContext()

function UserProvider(children) {

  const [isLoggedIn, setisLoggedIn] = useState(false)
  return <>

    <UserContext.Provider value={{ isLoggedIn, setisLoggedIn}}>

      {children}

    </UserContext.Provider>

  </>
}

export { UserContext, UserProvider }