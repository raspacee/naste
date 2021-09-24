import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

function Sidebar() {
  const location = useLocation().pathname;
  const history = useHistory();
  const disableForm = location === '/' ? false : true;

  const tabs = useSelector((state) => state.tabs.tabs);
  const [passwd, setPasswd] = useState('');
  const [expire_t, setExpire_t] = useState('0');
  const [delete_on_views, setDelete_on_views] = useState('0');
  const [syntax, setSyntax] = useState('None');

  const handleCreate = () => {
    const data = mergeDataToTabs();
    const headers = {
      'Content-Type': 'application/json'
    }
    axios.post('http://localhost:4000/api/pastes', data, headers)
    .then((res) => {
      console.log(res);
      if (res.data.Id) {
        history.push('/view/pastes/' + res.data.Id);
      }
    })
    .catch((err) => {
      console.log(err);
    })
  }

  const mergeDataToTabs = () => {
    let t;
    let tempTabs = [];

    for (let i = 0; i < tabs.length; i++) {
      t = Object.assign({}, tabs[i]);

      t.passwd = passwd;
      t.expire_t = parseInt(expire_t);
      t.delete_on_views = parseInt(delete_on_views);
      t.syntax = syntax;

      tempTabs.push(t);
    }

    return tempTabs;
  }

  return (
    <form>
      <div className="mb-3">
        <label htmlFor="passwd" className="form-label">Password</label>
        <input disabled={disableForm} type="password" className="form-control" id="passwd" value={passwd} onChange={ (e) => setPasswd(e.target.value) }/>
      </div>
      <div className="mb-3">
        <label htmlFor="expire_t" className="form-label">Expire after</label>
        <select disabled={disableForm} id="expire_t" value={expire_t} onChange={ (e) => setExpire_t(e.target.value) } className="form-select" aria-label="Default select example">
          <option value="0">Never</option>
          <option value="60">1 hour</option>
          <option value="720">12 hour</option>
          <option value="1440">1 day</option>
          <option value="10080">1 week</option>
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="delete_on_views" className="form-label">Delete after * views</label>
        <select disabled={disableForm} id="delete_on_views" value={delete_on_views} onChange={ (e) => setDelete_on_views(e.target.value) } className="form-select" aria-label="Default select example">
          <option value="0">Never</option>
          <option value="1">1 view</option>
          <option value="10">10 views</option>
          <option value="100">100 views</option>
          <option value="1000">1000 views</option>
          <option value="10000">10000 views</option>
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="syntax" className="form-label">Syntax</label>
        <select disabled={disableForm} id="syntax" value={syntax} onChange={ (e) => setSyntax(e.target.value) }className="form-select" aria-label="Default select example">
          <option value="none">None</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="go">Go</option>
          <option value="java">Java</option>
          <option value="js">JavaScript</option>
          <option value="py">Python</option>
          <option value="rb">Ruby</option>
        </select>
      </div>
      <button disabled={disableForm} type="button" className="btn btn-primary" onClick={handleCreate} >Create</button>
    </form>
  )
}

export default Sidebar;