import React from "react";
import Tilt from 'react-parallax-tilt';
import faceScan from './facescan.png';
import './Logo.css';

const Logo = () => {
    return (
      <div className="ma4 mt0 flex justify-center">
        <Tilt className='tilt br2 shadow-2' style={{height: '150px', width: '150px', tiltMaxAngleX: 40}}>
          <div className="pa3">
            <img style={{paddingTop: '5px'}} alt="logo" src={faceScan}></img>
          </div>
        </Tilt>
      </div>
    )
};
export default Logo;