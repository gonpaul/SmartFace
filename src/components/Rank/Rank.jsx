import React from "react";


const Rank = ({ name, entries }) => {
    return (
      <div>
        <div className="black f3">
          {name + ', your current entry count is'} <span className="black f1">{entries}</span>
        </div>
      </div>
    )
};
export default Rank;