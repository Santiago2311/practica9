import "./Blog.css"
import { useState, useEffect} from 'react'
/*import { entries } from './data'*/
import {CardList} from './components/cards'

function Blog() {
    const [filteredText, setFilteredText] = useState('')
    const [entries, setEntries] = useState([]);
    
    useEffect(() => {
        fetch(import.meta.env.VITE_API_URL + '/posts')
        .then((res) => res.json())
        .then((posts) => setEntries(posts));
    }, []);

    function handleChange(e){
        setFilteredText(e.target.value)
    }

  return (
    <>
        <h1>Mis Lugares Favoritos</h1>
        <div className='filter'>
            <p>Filtra por destino:</p>
            <input id="filter-input" type='text' placeholder='Busca tu destino favorito' value={filteredText} onChange={handleChange}></input>
        </div>
        <CardList entries={entries} filteredText={filteredText}></CardList>
    </>
  )
}

export default Blog