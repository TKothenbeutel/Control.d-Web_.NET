import { useState } from "react";
import SvgStar from "./star.svg";
import SvgStarFilled from "./starFill.svg";

const checkedStar = {
    fill: "#B89230"
};

const ratingStyle = {
    "display": "flex",
    "alignItems": "center"
};

const starStyle = {
    "marginRight": "1px"
};

const Star = (props) => <img src={props.rating>=props.threshold ? SvgStarFilled : SvgStar} style={starStyle} {...props}/>

export const Rating = ({rating}) => (
    <div className="starRating" style={ratingStyle}>
        <Star rating={rating} threshold={0.5} />
        <Star rating={rating} threshold={1.5} />
        <Star rating={rating} threshold={2.5} />
        <Star rating={rating} threshold={3.5} />
        <Star rating={rating} threshold={4.5} />
        <span>{rating}/5</span>
    </div>
);

export function RatingInput({ name, value, onClick }){
    const [ rating, setRating ] = useState(value);

    const handleChange = (val) => {
        setRating(val);
        onClick({target:{name:name, value:val}});
    }

    return (
        <div className="starRating" name={name} value={value}>
            <Star rating={rating} threshold={0.5} onClick={() => handleChange(1)} />
            <Star rating={rating} threshold={1.5} onClick={() => handleChange(2)} />
            <Star rating={rating} threshold={2.5} onClick={() => handleChange(3)} />
            <Star rating={rating} threshold={3.5} onClick={() => handleChange(4)} />
            <Star rating={rating} threshold={4.5} onClick={() => handleChange(5)} />    
        </div>
    );
}