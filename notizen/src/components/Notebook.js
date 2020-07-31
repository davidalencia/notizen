import React, { useState, createRef, useEffect } from 'react';
import TopMenu from './TopMenu';
import LowMenu from './LowMenu';
import Sheets from './Sheets'


const Notebook = () => {  
  return (
    <div >
      <TopMenu></TopMenu>
      <LowMenu></LowMenu>
      <Sheets></Sheets>
    </div>
  );
}

export default Notebook;