import React, { Component } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom'
import Routes from './Routes'
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <div className='App-header'>
            <div className='container'>
              <h2 className='logo'>
               <Link to='/'>Chamsocial</Link>
              </h2>
            </div>
          </div>
          <div className='container'>
            <Routes />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
