import { useState } from 'react'
import Navbar from './components/navbar/navbar'
import { Route,Routes } from 'react-router-dom'
import Home from './pages/home/home'
import Video from './pages/video/video'
import SearchResults from './pages/search/SearchResults'

const App = () => {

  const [sidebar,setSidebar] = useState(true);
  return (
    <div>
      <Navbar setSidebar={setSidebar}/>
      <Routes>
        <Route path='/' element={<Home sidebar={sidebar}/>}/>
        <Route path='/search' element={<SearchResults/>}/>
        <Route path='/video/:categoryId/:videoId' element={<Video/>}/>
      </Routes>
    </div>
  )
}

export default App