import React from 'react';
import './LowMenu.css'

const LowMenu = () => {
  return (
    <div>
      <a id="pen" href="/#">
        <img src="./images/pen-24px.svg" alt="pen"/>
      </a>
      <a id="eraser" href="/#">
        <img src="./images/eraser.svg" alt="eraser"/>
      </a>
      <a id="mic" href="/#">
        <img src="./images/mic-24px.svg" alt="mic"/>
      </a>
      <a id="photo" href="/#">
        <img src="./images/add_photo_alternate-24px.svg" alt="add_img"/>
      </a>
      <a id="crop" href="/#">
        <img src="./images/crop-24px.svg" alt="crop"/>
      </a>
      <a id="text" href="/#">
        <img src="./images/text_fields-24px.svg" alt="text"/>
      </a>
      <a id="www" href="/#">
        <img src="./images/web_asset-24px.svg" alt="embeded web"/>
      </a>
    </div>
  );
}

export default LowMenu;