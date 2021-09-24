import { useEffect } from 'react';
import BaseLayout from './layouts/BaseLayout';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import View from './components/View';
import About from './components/About';
import Default from './components/Default';

import { useDispatch } from 'react-redux';
import { initializeCurrentTab } from './store/reducers/tabsReducer';

import './styles/App.css';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeCurrentTab());
  }, []);

  return (
    <div className="App">
      <Router>
      <BaseLayout>
        <Switch>
          <Route path="/view/*/:id">
            <View/>
          </Route>
          <Route path="/about">
            <About/>
          </Route>
          <Route path="/">
            <Default/>
          </Route>
        </Switch>
      </BaseLayout>
      </Router>
    </div>
  );
}

export default App;
