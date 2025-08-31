
import EditContentPage from './components/EditContentPage'
import SharedContent from './components/SharedContent'
import Dashboard from './pages/Dashboard'
import Login from './pages/login'
import SignIn from './pages/SignIn'
import { BrowserRouter, Routes, Route } from 'react-router-dom'


function App() {
 

  return <BrowserRouter>
  <Routes>
    <Route path='/' element={<SignIn/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/dashboard' element={<Dashboard/>}/>
    <Route path='/share/:shareLink' element={<SharedContent/>}/>
    <Route path="/edit/:contentId" element={<EditContentPage />} />

  </Routes>
  </BrowserRouter>
   
}

export default App
