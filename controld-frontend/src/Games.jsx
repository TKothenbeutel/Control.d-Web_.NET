import { Suspense, useEffect, useMemo, useState } from "react";
import SvgStar from "./star.svg";
import SvgStarFilled from "./starFill.svg";
import PortalImage from "./portal.jpg"
import './games.css';

const DB_API = process.env.REACT_APP_API_URL;

//Game Reviews

const checkedStar = {
    fill: "#B89230"
};

const Rating = ({rating}) => (
    <div className="starRating">
        <img src={rating>=0.5 ? SvgStarFilled : SvgStar}/>
        <img src={rating>=1.5 ? SvgStarFilled : SvgStar}/>
        <img src={rating>=2.5 ? SvgStarFilled : SvgStar}/>
        <img src={rating>=3.5 ? SvgStarFilled : SvgStar}/>
        <img src={rating>=4.5 ? SvgStarFilled : SvgStar}/>
        <span>{rating}/5</span>
    </div>
);

const Review = (props) => (
    <div className="review">
        <h3 className="reviewTitle">{props.title}</h3>
        <Rating rating={props.rating}/>
        <p className="reviewBody">{props.body}</p>
        <h6 className="reviewDate">{props.date}</h6>
    </div>
);

function ReviewsBox({ gameId, reviewCount }){
    const [ reviews, setReviews ] = useState([]);
    const [ pageNumber, setPageNumber] = useState(1);

    const PAGESIZE = 10;

    //Grab reviews from selected page
    useEffect(() => {
        fetch(DB_API+`/Review?ForGame=${gameId}+&Page=${pageNumber}`)
            .then(response => response.json())
            .then(data => setReviews(data));
    }, [pageNumber]);

    //Populate page number list (used to map buttons)
    const pageButtons = useMemo(() => {
        const pages = [];
        const pageCount = Math.ceil(reviewCount / PAGESIZE);
        for(let i = 1; i <= pageCount; i++){
            pages.push(i);
        }
        return pages;
    }, [reviewCount]);

    return (
        <div className="reviewContainer">
            <h1>Reviews</h1>
            {reviews.map((review) =>
                <div key={review.reviewId} className="reviewBox">
                    <Review title={review.title} rating={review.rating} body={review.body} date={review.reviewDate} />
                </div>
            )}
            <hr/>
            <div className="pageSelection">
                {pageButtons.map((i) => 
                    <button key={i} onClick={() => setPageNumber(i)} disabled={i === pageNumber}>{i}</button>
                )}
            </div>
        </div>
    );
}

//Game Information

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
                <ReviewsBox gameId={gameId} reviewCount={game.reviewCount} />
            </Suspense>
        </div>
    );
}

export default GamePage;