import { Link } from 'react-router'

export function CardList({entries, filteredText}){
  const cards = entries.filter(entry => entry.title.toLowerCase().includes(filteredText.toLowerCase())).map(entry => <Card id_post={entry.id_post} img={entry.image} title={entry.title} author={entry.author_name} description={entry.text} date={entry.date?.substring(0, 10) ?? ''}></Card>)

  return(
    <div className='card-list'>
      {cards}
    </div>
  )
}

function Card({id_post, img, title, date, author, description}){
    return (
        <div className='card'>
          <Link to={"/blog/"+id_post}>
            <h1>{title}</h1>
            {img && <img src={`http://localhost:8000/assets/${img}`} alt="Aquí deberia de ir la imagen del lugar :)"/>}
            <p>{description}</p>
            <p className="post-info">
              Publicación realizada el {date}    
              <span> Autor: {author} </span>
            </p>
          </Link>
        </div>
    )
}
