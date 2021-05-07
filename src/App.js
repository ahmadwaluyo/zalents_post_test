import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Layout from './views/home';
import Login from './views/loginRegist';
import './App.css';
import 'antd/dist/antd.css';

const isLogin = JSON.parse(localStorage.getItem("isLogin"));

function App() {
  return (
      <Router>
          <Switch>
              <Route 
                path="/"
                exact
              >
                  {!isLogin ? <Login /> : <Layout />}
              </Route>
          </Switch>
      </Router>
  );
}

export default App;
