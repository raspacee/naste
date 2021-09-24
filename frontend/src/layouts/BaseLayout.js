import React from 'react';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

import '../styles/BaseLayout.css';

function BaseLayout({ children }) {
  return (
    <React.Fragment>
    <Header/>

    <div className="container-100">
      <div className="row m-3">
        <div className="col-2 sidebar">
          <Sidebar/>
        </div>
        <div className="col-9 w-70">
          {children}
        </div>
      </div>
    </div>

    <Footer/>
    </React.Fragment>
  );
}

export default BaseLayout;