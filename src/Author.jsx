import { useState, useEffect } from "react";
import {useNavigate, useParams} from "react-router";

export default function Author(){
    const {id_author} = useParams();
    const [author, setAuthor] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetch(import.meta.env.VITE_API_URL + '/authors/' + id_author, {
            method: "GET",
            credentials: 'include'
        })
        .then( (res) => {
            if (res.status === 401) {
                navigate('/login');
            }
            return res.json();
        })
        .then( (data) => setAuthor(data))
        .catch( (error) => console.log(error));
    }, [id_author, navigate]);

}