import React, { Component } from 'react';
import {BrowserRouter, Route, Link, Switch, Redirect} from 'react-router-dom';
import './App.css';
import Home from './components/Home';

/* App component */
class App extends Component {
    render() {
        return (
            <Home />
        );
  }
}

export default App;
