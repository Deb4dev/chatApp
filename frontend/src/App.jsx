import React from 'react'
import {Routes , Route , Navigate } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore.js'
import {HomePage} from './pages/HomePage.jsx'
import {SignUpPage} from './pages/SignUpPage.jsx'
import {LoginPage} from './pages/LoginPage.jsx'
import {SettingsPage} from './pages/SettingsPage.jsx'
import {ProfilePage} from './pages/ProfilePage.jsx'
import {NavBar} from './components/NavBar.jsx'
import {Loader} from 'lucide-react'
import {useEffect} from 'react'
function App() {
    const {authUser , checkAuth , isCheckingAuth} = useAuthStore();
    useEffect(()=>{checkAuth()},[checkAuth])
    console.log(authUser)

    useEffect(()=>{
      checkAuth();
    },[checkAuth])

    if(isCheckingAuth &&  !authUser){
      return (
        <div  className='flex justify-center items-center h-screen'>
          <Loader className='animate-spin'/>
        </div>
      )
    }
  return (
    <>
      <NavBar/>
      <Routes>
        <Route path = '/' element = {authUser?<HomePage/>:<Navigate to='/login'  />}/> 
        <Route path = '/signup' element = {!authUser?<SignUpPage/>:<Navigate to='/'  />}/> 
        <Route path = '/login' element = {!authUser?<LoginPage/>:<Navigate to='/'  />}/>

        <Route path = '/settings' element = {<SettingsPage/>}/>
        <Route path = '/Profile' element = {authUser?<ProfilePage/>:<Navigate to='/login'  />}/>   
      </Routes>
    </>
  )
}

export default App
