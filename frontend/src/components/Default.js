import React from 'react';
import CodeTab from './CodeTab';

import { useDispatch } from 'react-redux'
import { initializeTabs } from '../store/reducers/tabsReducer';

import '../styles/Default.css';

function Default() {
  const dispatch = useDispatch();
  dispatch(initializeTabs());

  return(
    <CodeTab/>
  )
}

export default Default;
