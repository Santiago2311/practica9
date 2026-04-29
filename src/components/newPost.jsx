import '../newPost.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NewPost() {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [img, setImg] = useState(null);
    const [authors, setAuthors] = useState([]);
    const [selectedAuthor, setSelectedAuthor] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetch(import.meta.env.VITE_API_URL +'/authors')
            .then((res) => res.json())
            .then((data) => {
                setAuthors(data);
                if (data.length > 0) setSelectedAuthor(data[0].id_author);
            })
            .catch((error) => console.log(error));
    }, []);

    function handleFile(e) {
        const fileInfo = {
            file: e.target.files[0],
            filename: e.target.files[0].name
        };
        setImg(fileInfo);
    }

    function handleSubmit() {
        if (!img || !title || !selectedAuthor) {
            alert('Por favor completa todos los campos');
            return;
        }

        const formInfo = new FormData();
        formInfo.append('title', title);
        formInfo.append('text', text);
        formInfo.append('img', img.file, img.filename);
        formInfo.append('id_author', selectedAuthor);

        fetch(import.meta.env.VITE_API_URL + '/posts/new', {
            method: "POST",
            body: formInfo,
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            navigate('/blog');
        })
        .catch((error) => console.log(error));
    }

    return (
        <div className="new-post-input">
            <h2>Nuevo post</h2>
            <input type='text' placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea placeholder="Contenido..." value={text} onChange={(e) => setText(e.target.value)} />
            <select value={selectedAuthor} onChange={(e) => setSelectedAuthor(e.target.value)}>
                {authors.map((author) => (
                    <option key={author.id_author} value={author.id_author}>{author.name}</option>
                ))}
            </select>
            <label className="np-file">
                {img ? img.filename : 'Seleccionar imagen'}
                <input type='file' onChange={handleFile} style={{ display: 'none' }} />
            </label>
            <button onClick={handleSubmit}>Agregar</button>
        </div>
    );
}