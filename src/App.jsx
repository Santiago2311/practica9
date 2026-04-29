import './App.css'
import Home from './Home'
import Blog from './Blog'
import Contact from './Contact'
import NewPost from './components/newPost';
import { Routes, Route } from 'react-router';
import { Link } from 'react-router';
import Post from './components/post';
import Login from './components/login';

function App() {
  return (
    <>
      <nav className="navbar">
        <Link to="/Home">Home</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/new">New Post</Link>
      </nav>
   
      <Routes>
        <Route path="/" element={<Login></Login>}></Route>
        <Route path="/Home" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/new" element={<NewPost></NewPost>}></Route>
        <Route path="/blog/:id_post" element={<Post></Post>}></Route>
      </Routes>
    </>
  )
}

export default App