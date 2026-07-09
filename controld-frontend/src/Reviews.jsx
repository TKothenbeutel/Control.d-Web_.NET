import { useEffect, useMemo, useState } from "react";
import { Rating, RatingInput } from "./Rating";
import "./reviews.css";

const DB_API = process.env.REACT_APP_API_URL;

function Review({review, deleteHandler = null, likeHandler = null}){

    const like = (e) => {
        var successfulUpdate
        if(e.target.checked){
            successfulUpdate = likeHandler(review.reviewId, true);
        }else{
            successfulUpdate = likeHandler(review.reviewId, false);
        }

        if(!successfulUpdate){
            e.target.checked = !e.target.checked;
        }
    }

    return (
        <>
            <h4>{review.accountUsername}</h4>
            {deleteHandler === null ? <div></div> : 
            <button onClick={() => deleteHandler(review.reviewId)}>X</button>}
            <h3 className="reviewTitle">{review.title}</h3>
            <Rating rating={review.rating}/>
            <p className="reviewBody">{review.body}</p>
            <h6 className="reviewDate">{review.reviewDate}</h6>
            {likeHandler === null ? <div></div> :
                <div style={{justifySelf:"right"}}>
                    <input type="checkbox" className="likeButton" onClick={like} checked={review.liked}/>
                    <span>{review.likes > 0 ? "+"+review.likes : review.likes}</span>
                </div>
            }
        </>
)};

function OwnReview({ gameId, accountId, writeMode, setWriteMode, setOwnReviewCount }){
    const [ reviews, setReviews ] = useState([]);

    useEffect(() => {
        fetch(DB_API+`/Review?ForGame=${gameId}+&ByAccount=${accountId}`)
            .then(result => result.json())
            .then(data => {
                setReviews(data);
                setOwnReviewCount(data.length);
                if(data.length !== 0 && writeMode !== null){
                    setWriteMode(null);
                }
            });
    }, [gameId, accountId, writeMode]);

    const deleteReview = (id) => {
        fetch(DB_API+`/Review/${id}`,{method:"DELETE"})
            .then(results => {
                if(results.status === 204){
                    setOwnReviewCount(reviews.length-1);
                    setReviews(reviews.filter(r => r.reviewId !== id));
                    window.location.reload(false); //Ensure changes could be seen for game stats, for example
                }
            });
    };

    return reviews.length === 0 ? null : (
        <>
            {reviews.map((review) =>
                <div key={review.reviewId} className="reviewBox">
                    <Review review={review} deleteHandler={deleteReview} />
                </div>
            )} 
        </>
                
    );
        
}

function WriteReview({ gameId, accountId, setWriteMode}){
    const [ reviewInputs, setReview ] = useState({starRating: 0});

    const updateReview = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setReview(values => ({...values, [name] : value}));
    }

    const postReview = () => {
        fetch(DB_API+"/Review" ,{
            method: "POST",
            headers: {
              "Content-Type": "application/json"  
            },
            body: JSON.stringify({
                "gameId": gameId,
                "accountId": accountId,
                "reviewDate": new Date().toLocaleDateString('en-CA'), //'en-CA' formats as yyyy-mm-dd, thankfully
                "rating": reviewInputs.starRating,
                "title": reviewInputs.title,
                "body": reviewInputs.body
            })
        }).then(result => window.location.reload(false));//reload so everything updates
        setWriteMode(false);
    }

    return (
        <div className="reviewContainer">
            <h1>Write a Review</h1>
            <form onSubmit={postReview} autoComplete="off">
                <input type="text"
                    className="titleInput"
                    name="title"
                    value={reviewInputs.title}
                    onChange={updateReview}
                    placeholder="Title"
                    required
                />
                <RatingInput
                    name="starRating"
                    value={reviewInputs.starRating}
                    onClick={updateReview}
                />
                <textarea
                    className="bodyInput"
                    name="body"
                    value={reviewInputs.body}
                    onChange={updateReview}
                    placeholder="Body"
                    rows={5}
                    required
                />
                <input type="submit" value="Submit Review"/>
                <button onClick={() => setWriteMode(false)}>Cancel</button>
            </form>
        </div>
    );
}

function ReviewsBox({ gameId, accountId, reviewCount }){
    const [ reviews, setReviews ] = useState([]);
    const [ pageNumber, setPageNumber] = useState(1);
    const [ writeMode, setWriteMode ] = useState(false);
    const [ ownReviewCount, setOwnReviewCount ] = useState(0);

    const PAGESIZE = 10;

    //Grab reviews from selected page
    useEffect(() => {
        fetch(DB_API+`/Review?ForGame=${gameId}+&ExcludeAccount=${accountId}+&Page=${pageNumber}+&PageSize=${PAGESIZE-ownReviewCount}`)
            .then(response => response.json())
            .then(data => setReviews(data));
    }, [pageNumber, ownReviewCount, gameId, accountId]);

    //Mark liked reviews
    useEffect(() => {
        if(reviews.length === 0 || reviews[0].hasOwnProperty("liked")){
            return;
        }
        fetch(DB_API+`/Review/Likes/${accountId}`)
            .then(response => response.json())
            .then(data => {
                setReviews(reviews.map(review => ({
                    ...review,
                    liked: data.findIndex(e => e.reviewId === review.reviewId) !== -1
                })   
                ));
            });
    }, [reviews, accountId]);

    //Populate page number list (used to map buttons)
    const pageButtons = useMemo(() => {
        const pages = [];
        const pageCount = Math.ceil(reviewCount / PAGESIZE);
        for(let i = 1; i <= pageCount; i++){
            pages.push(i);
        }
        return pages;
    }, [reviewCount]);

    //Update like count
    const likeHandler = (id, liked) => {
        var review = reviews.find(r => r.reviewId === id);
        const index = reviews.indexOf(review);
        if(liked){
            return fetch(DB_API+`/Review/Likes/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"  
                },
                body: JSON.stringify({reviewId: id, accountId: accountId})
            }).then(result => {
                if(result.status === 201){
                    review = {...review, likes: review.likes+1, liked:true};
                    setReviews(reviews.slice(0,index).concat(review).concat(reviews.slice(index+1)));
                    return true;
                }
                return false;
            });
        }else{
            return fetch(DB_API+`/Review/Likes/${accountId}/${id}`, {
                method: "DELETE"
            }).then(result => {
                if(result.status === 204){
                    review = {...review, likes: review.likes-1, liked:false};
                    setReviews(reviews.slice(0,index).concat(review).concat(reviews.slice(index+1)));
                    return true;
                }
                return false;
            });
        }
    };

    return ( writeMode ? <WriteReview gameId={gameId} accountId={accountId} setWriteMode={setWriteMode}/> :
        <div className="reviewContainer">
            <div>
                <h1>Reviews ({reviewCount})</h1>
                {/*NOTE: button will never be disabled, as to allow accounts have multiple reviews per game (only for dev, real accounts should only be able to review once per game) */}
                <button onClick={() => setWriteMode(true)} disabled={writeMode===0/*null*/}>Write Review</button>
            </div>
            <OwnReview gameId={gameId} accountId={accountId} writeMode={writeMode} setWriteMode={setWriteMode} setOwnReviewCount={setOwnReviewCount} />
            {reviews.map((review) =>
                <div key={review.reviewId} className="reviewBox">
                    <Review review={review} likeHandler={likeHandler} />
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

export default ReviewsBox;