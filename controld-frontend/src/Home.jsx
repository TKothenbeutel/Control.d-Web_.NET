import { useEffect, useState } from "react";
import PortalImage from "./images/portal.jpg";
import "./style/home.css";

const DB_API = process.env.REACT_APP_API_URL;

const CATEGORIES = {
  "Popular" : "?SortBy=toprated",
  "Most Reviewed" : "?SortBy=mostreviewed",
  "Name" : "?SortBy=name"
};

async function retrieveGames(query){
  var result = await fetch(DB_API+`/Game${query}`)
    .then(result => result.status === 200 ? result.json() : null);
  if(result !== null){
    result = result.reduce(
      (prev, g) => ({...prev, [g.gameId]:g}),{}
    );
  }
  return result;
}

const GameBox = ({ game }) => (
  <div className="gameHome">
    <img src={game.name === "Portal" ? PortalImage : null} alt="Game cover art" className="nm"/>
    <h5 className="nm">{game.name}</h5>
    <h6 className="nm">{game.publisher.name}</h6>
    <div>
      {game.genres.map(genre => 
        <span key={genre.genreId} className="tag genre">{genre.name}</span>
      )}
    </div>
  </div>
);

function HomePage(){
  const [ games, setGames ] = useState({});
  const [ categories, setCategories ] = useState({});
  const ex = {hello: [1,2,3], bye: [6,7,8]};

  useEffect(() => {
    const cats = Object.getOwnPropertyNames(CATEGORIES)
    Promise.all(
      cats.map(cat => retrieveGames(CATEGORIES[[cat]]))
    ).then(results => {
      var g = {};
      var c = {};
      results.forEach((r,i) => {
        g = Object.assign(g,r);
        c = Object.assign(c,{[cats[i]] : Object.getOwnPropertyNames(r)});
      });
      setGames(g);
      setCategories(c);
    });
  }, [CATEGORIES]);
  
  return (
    <div className="onePage">
      {categories.length === 0 ? <></> : Object.getOwnPropertyNames(categories).map(cat => (
        <div key={cat} className="container category">
          <h2>{cat}</h2>
          <div className="sideScroll">
            {categories[cat].map(id =>
              <GameBox key={cat+id} game={games[id]} />
            )}
          </div>
          
        </div>
      ))}
    </div>
  );
}

export default HomePage;