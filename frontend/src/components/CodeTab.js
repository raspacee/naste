import React, { useEffect } from 'react';
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { setTabsData, changeActiveTab, changeCurrentTabBody, changeCurrentTabTitle, addTab, removeTab } from '../store/reducers/tabsReducer';

import '../styles/Default.css';

function CodeTab() {
  const location = useLocation().pathname;
  const { id } = useParams();

  const tabs = useSelector((state) => state.tabs.tabs);
  const currentTab = useSelector((state) => state.tabs.currentTab);
  const dispatch = useDispatch();

  useEffect(() => {
    let apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/';

    if (location.includes('pastes')) {
      apiUrl += 'pastes/';
    } else if (location.includes('bundles')) {
      apiUrl += 'bundles/';
    }

    async function fetchData() {
      if (location != '/') {
        try {
          let res = await axios.get(apiUrl + id);
          dispatch(setTabsData(res.data));
        } catch(err) {
          console.log(err);
        }
      }
    }

    fetchData();
  }, [])

  const renderTabs = tabs.map(function(t, idx) {
    return (
      <div className="input-group mb-3" key={t.id}>
        <input className="form-control" data-id={t.id}
        type="text"
        onFocus={ (e) => dispatch(changeActiveTab(e.target.getAttribute('data-id'))) }
        value={t.title} onChange={ (e) => dispatch(changeCurrentTabTitle(e.target.value)) } readOnly={ location != '/'}/>
        {
          location === '/' &&
          <span className="input-group-text removeTab"><i className="fas fa-times" onClick={ (e) => dispatch(removeTab(e.target.parentElement.previousElementSibling.getAttribute('data-id'))) }></i></span>
        }
      </div>
    )
  })

  return (
    <div className="mt-2">
      <div className="d-grid gap-1 d-md-flex">
        {renderTabs}
        {
          location === '/' &&
          <button type="button" className="btn btn-primary addTab" onClick={ () => dispatch(addTab()) }><i className="fas fa-plus"></i></button>
        }
      </div>

      <textarea readOnly={ location !== '/'} className="codeTab" onChange={ (e) => dispatch(changeCurrentTabBody(e.target.value)) } value={currentTab.body}></textarea>
    </div>
  )
}

export default CodeTab;