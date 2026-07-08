import { Suspense, useEffect, useState } from "react";
import { Rating } from "./Rating";
import ReviewsBox from "./Reviews";
import PortalImage from "./portal.jpg"
import './games.css';

const DB_API = process.env.REACT_APP_API_URL;

function GameInfo({game}){

    return (
        <div>
            <div className="gameInfo">
                <img src={game.name === "Portal" ? PortalImage : null} alt="Game cover art"/>
                <div>
                    <h3>{game.name}</h3>
                    <Rating rating={game.rating} />
                    
                    <h4>Released on {game.date}</h4>
                    
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

    const [ game, setGame ] = useState({
        name : '',
        description : '',
        date : '',
        reviewCount : 0,
        rating : 0
    });

    useEffect(() => {
        fetch(DB_API+`/Game/${gameId}`)
            .then(result => result.json())
            .then(d => setGame({
                name : d.name,
                description : d.description,
                date : d.releaseDate,
                reviewCount : d.reviewCount,
                rating : d.ratingTotal / d.reviewCount
            }));
    }, []);

    return (
        <div className="gamePage">
            <GameInfo game={game} />
            <div className="verticalSeparator" />
            <Suspense fallback={<p>Loading Reviews</p>}>
                <ReviewsBox gameId={gameId} accountId={2} reviewCount={game.reviewCount} />
            </Suspense>
        </div>
    );
}

export default GamePage;