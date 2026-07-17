import { useEffect, useState } from "react";
import { OwnReview } from "./Reviews";
import { favoriteGameToggle } from "./Games";
import { Rating } from "./Rating";
import defaultProfile from "./default-profile.png";
import heart from "./heart.svg"
import heartFill from "./heartFill.svg"
import './account.css';

const DB_API = process.env.REACT_APP_API_URL;

const Follower = (props) => (
  <div className="listItem followContainer" >
    <img src={defaultProfile} alt="Profile Picture" className="profilePicture smallPFP"/>
    <a href={"/"+props.accountId}><h5 className="nm">{props.username}</h5></a>
    {props.mutual ? null :
      <button onClick={props.handleButton}>{props.follower ? "Follow Back" : "Unfollow"}</button>
    }
  </div>
);

function FavoriteGames({ accountId, favoriteGames}){
  const [ unFavorite, setUnfavorite ] = useState([]);

  const handleFavoriting = (game) => {
    const favorited = !unFavorite.includes(game.gameId)
    favoriteGameToggle(favorited, accountId, game).then(favorited => {
      if(favorited){
        setUnfavorite(unFavorite.filter(g => g !== game.gameId));
      }else{
        setUnfavorite([...unFavorite, game.gameId]);
      }
    });
  };

  return (
    <div className="listContainer">
      {favoriteGames.map((game) =>
        <div key={game.gameId} className="listItem gameBox">
          <div id="name">
            <h3 className="nm">{game.name}</h3>
            <h5 className="nm">{game.publisher.name}</h5>
          </div>
          <Rating rating={game.reviewCount === 0 ? 0 : Math.round((game.ratingTotal/game.reviewCount) * 10)/10} />
          <img src={unFavorite.includes(game.gameId) ? heart : heartFill} className="clickableIcon" draggable="false" alt="favorited checkbox" onClick={() => handleFavoriting(game)} />
        </div>
      )}
    </div>
  );
}

function ListModule(){

}


function AccountPage(props){
  const accountId = props.accountId;
  const [ accInfo, setAccInfo ] = useState({
    accountId : 0,
    email : "",
    username : "",
    favoriteGames : [],
    followers : [],
    following : []
  });
  const [ reviewCount, setReviewCount ] = useState(0);

  useEffect(() => {
    fetch(DB_API+`/Account/${accountId}`)
      .then(result => result.json())
      .then(data => {
        console.log(data);
        setAccInfo(data);
      });
  }, [accountId]);

  //Follower/Following
  const handleButton = (otherAcc, isFollower) => {
    if(isFollower){
      fetch(DB_API+`/Account/${props.accountId}/Follow/${otherAcc.accountId}`,{
        method: "PUT"
      }).then(results => {
        if(results.status === 204){
          setAccInfo({...accInfo,
            following: [otherAcc].concat(accInfo.following)
          });
        }
      });
    }else{
      fetch(DB_API+`/Account/${props.accountId}/Follow/${otherAcc.accountId}`,{
        method: "DELETE"
      }).then(results => {
        if(results.status === 204){
          setAccInfo({...accInfo,
            following: accInfo.following.filter(acc => acc.accountId !== otherAcc.accountId)
          });
        }
      });
    }
  };

  return (
    <div className="twoPage">
      {/* Profile, recent activity, followers / following */}
      <div className="accountInfo">
        <img src={defaultProfile} alt="Profile Picture" className="profilePicture"/>
        <h1>{accInfo.username}</h1>

        <h3>Recent Activity</h3>
        <div>
          WIP
        </div>

        <div className="twoColumn">
          <div>
            <h3>Followers ({accInfo.followers.length})</h3>
            <div className="listContainer">
              {accInfo.followers.length === 0 ? "No followers 💔🥀": 
                accInfo.followers.map(acc => (
                  <Follower key={acc.accountId} accountId={acc.accountId} username={acc.username}
                    follower={true} mutual={accInfo.following.filter(a => a.accountId === acc.accountId).length !== 0} handleButton={() => handleButton(acc, true)}/>
                ))
              }
            </div>
          </div>
          <div>
            <h3>Following ({accInfo.following.length})</h3>
            <div className="listContainer">
              {accInfo.following.length === 0 ? "Following no one...": 
                  accInfo.following.map(acc => (
                    <Follower key={acc.accountId} accountId={acc.accountId} username={acc.username}
                      follower={false} mutual={false} handleButton={() => handleButton(acc, false)}/>
                  ))
                }
            </div>
          </div>
        </div>
      </div>
      <div className="verticalSeparator" />
      {/* Reviews, favorite games / lists */}
      <div>
        <div className="twoColumn">
          <div className="container">
            <h3>Favorites ({accInfo.favoriteGames.length})</h3>
            <FavoriteGames accountId={accountId} favoriteGames={accInfo.favoriteGames} />
          </div>
          <div className="container"><h3>Lists</h3>WIP</div>
        </div>

        <div className="container">
          <h3>Reviews ({reviewCount})</h3>
          <OwnReview accountId={accountId} setOwnReviewCount={setReviewCount} />
        </div>
      </div>
    </div>
  );
}

export default AccountPage;