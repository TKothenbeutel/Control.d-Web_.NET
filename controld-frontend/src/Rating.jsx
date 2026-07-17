import { useState } from "react";

import SvgStarLeft from "./starLeft.svg"
import SvgStarRight from "./starRight.svg"
import SvgStarFillLeft from "./starFillLeft.svg"
import SvgStarFillRight from "./starFillRight.svg"

const ratingStyle = {
  "display": "flex",
  "alignItems": "center",
};

const starStyle = {
  "margin": "8px 1px 2px 0"
};

const starHalf = {
  "margin": "0",
  "padding": "0"
};

const Star = (props) => (
  <div style={starStyle}>
    <img src={props.rating >= props.threshold - 0.5 ? SvgStarFillLeft : SvgStarLeft} className="clickableIcon" style={starHalf} draggable="false" alt="left half star"
      onClick={props.clickable ? () => props.clickable(props.threshold - 0.5) : undefined} />
    <img src={props.rating >= props.threshold ? SvgStarFillRight : SvgStarRight} className="clickableIcon" style={starHalf} draggable="false" alt="right half star"
      onClick={props.clickable ? () => props.clickable(props.threshold) : undefined} />
  </div>
);


export const Rating = ({ rating }) => (
  <div className="starRating" style={ratingStyle}>
    <Star rating={rating} threshold={1} />
    <Star rating={rating} threshold={2} />
    <Star rating={rating} threshold={3} />
    <Star rating={rating} threshold={4} />
    <Star rating={rating} threshold={5} />
    <span>{rating}/5</span>
  </div>
);

export function RatingInput({ name, value, onClick }) {
  const [rating, setRating] = useState(value);

  const handleChange = (val) => {
    setRating(val);
    onClick({ target: { name: name, value: val } });
  };

  return (
    <div className="starRating" style={ratingStyle} name={name} value={value}>
      <Star rating={rating} threshold={1} clickable={handleChange} />
      <Star rating={rating} threshold={2} clickable={handleChange} />
      <Star rating={rating} threshold={3} clickable={handleChange} />
      <Star rating={rating} threshold={4} clickable={handleChange} />
      <Star rating={rating} threshold={5} clickable={handleChange} />
    </div>
  );
}