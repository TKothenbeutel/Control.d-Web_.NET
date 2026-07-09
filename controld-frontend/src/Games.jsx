import { Suspense, useEffect, useState } from "react";
import { Rating } from "./Rating";
import ReviewsBox from "./Reviews";
import PortalImage from "./portal.jpg"
import './games.css';

const DB_API = process.env.REACT_APP_API_URL;

function GameInfo({game, favorited, favoriteHandle}){

    return (
        <div>
            <div className="gameInfo">
                <img src={game.name === "Portal" ? PortalImage : null} alt="Game cover art"/>
                <div>
                    <h3>{game.name}</h3>      
                    <span>Publisher: <a href="/">{game.publisher.name}</a></span>
                    <div>
                        {game.genres.map(genre => 
                            <span key={genre.genreId} className="tag genre">{genre.name}</span>
                        )}  
                    </div>
                    <h4>Released on {game.date}</h4>
                    <div>
                        {game.platforms.map(platform => 
                            <span key={platform.platformId} className="tag platform">{platform.name}</span>
                        )}
                    </div>
                    <Rating rating={Math.round(game.rating * 10)/10} />
                    <button onClick={favoriteHandle}>{favorited ? "Favorited" : "Favorite"}</button>               
                </div>
            </div>
            
            <div className="descBox">
                <p>{game.description}</p>
            </div>
        </div>
    );
}

function GamePage(props){
    const gameId = props.gameId;
    const accountId = props.accountId;

    const [ game, setGame ] = useState({
        name : '',
        description : '',
        date : '',
        reviewCount : 0,
        rating : 0,
        publisher : [],
        genres : [],
        platforms : [],
    });
    const [ favorited, setFavorited] = useState(false);

    useEffect(() => {
        fetch(DB_API+`/Game/${gameId}`)
            .then(result => result.json())
            .then(d => {
                setGame({
                name : d.name,
                description : d.description,
                date : d.releaseDate,
                reviewCount : d.reviewCount,
                rating : d.reviewCount === 0 ? 0 : d.ratingTotal / d.reviewCount,
                publisher : d.publisher,
                genres : d.genres,
                platforms : d.platforms,
            })});
    }, [gameId]);

    //Check if game is favorited
    useEffect(() => {
        fetch(DB_API+`/Account/${accountId}`)
            .then(results => results.json())
            .then(data => setFavorited(data.favoriteGames.findIndex(g => g.gameId === gameId) !== -1));
    }, [gameId, accountId]);

    const handleFavorite = () => {
        if(favorited){
            fetch(DB_API+`/Account/${accountId}/FavoriteGame/${gameId}`, {method:"DELETE"})
                .then(results => {
                    if(results.status === 204){
                        setFavorited(false);
                    }
                });
        }else{
            fetch(DB_API+`/Account/${accountId}/FavoriteGame`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({...game, gameId: gameId})
            })
                .then(results => {
                    if(results.status === 204){
                        setFavorited(true);
                    }
                });
        }
    };

    return (
        <div className="gamePage">
            <GameInfo game={game} favorited={favorited} favoriteHandle={handleFavorite} />
            <div className="verticalSeparator" />
            <Suspense fallback={<p>Loading Reviews</p>}>
                <ReviewsBox gameId={gameId} accountId={accountId} reviewCount={game.reviewCount} />
            </Suspense>
        </div>
    );
}

export default GamePage;