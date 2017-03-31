
import React, { Component } from 'react';
import { Navbar, Button } from 'react-bootstrap';
import '../css/App.css';

class App extends Component {
  render() {
    return (
      <div>
        <Navbar bsStyle='inverse'>
          <div className="container-fluid">
            <div className="navbar-header">
              <a className="navbar-brand" href="#">Minesweeper</a>
            </div>
          </div>
        </Navbar>
        <div className="App container-fluid">
          <HUD/>
        </div>
      </div>
    );
  }
}

class HUD extends Component {
  render() {
    return (
      <section role='hud'>
        <Button bsStyle="primary" bsSize="large">New Game</Button>
        <Button bsStyle="warning" bsSize="large">Validate</Button>
      </section>
    )
  }
}
export default App;
