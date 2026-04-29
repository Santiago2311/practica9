import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function Post(){
    const {id_post} = useParams();
    const [post, setPost] = useState({});
    useEffect(() => {
        fetch(import.meta.env.VITE_API_URL + '/posts/' + id_post)
        .then( (res) => res.json())
        .then( (data) => setPost(data));
    },[id_post]);
    
    return(
        <>
            <h1>{post.title}</h1>
            {post.image && <img src={import.meta.env.VITE_API_URL + '/assets/' + post.image} alt="Aquí deberia de ir la imagen del lugar :)" height="300px"/>}
            <h2>Escrito por: {post.author_name}</h2>
            <h2>{post.date?.substring(0, 10)}</h2>
            <p>{post.text}</p>
        </>
    );
}