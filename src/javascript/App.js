import React, {Component} from 'react';
import _ from 'underscore';
import {Navbar, Button, Glyphicon} from 'react-bootstrap';
import '../css/App.css';

class Tile extends Component {
  render() {
    let content = this.props.dist > 0 ? this.props.dist : null;
    if (this.props.hasMine) {
      content = <Glyphicon glyph='fire'/>;
    }
    return (
      <div className='tile-wrap'>
        <div className="tile">{content}</div>
        {this.props.isCovered && <div className="tile-cover" onClick={() => this.props.onClick()}/>}
      </div>
    )
  }
}

class Board extends Component {
  render() {
    const tiles = this.props.tileArr.map((tile, idx) =>
      <Tile key={`${tile.x}-${tile.y}`} onClick={() => this.props.onClickTile(idx)} {...tile}/>
    );
    return (
      <div className='board'>{tiles}</div>
    )
  }
}

class HUD extends Component {
  render() {
    return (
      <div className='hud'>
        <Button bsStyle="primary" bsSize="large" onClick={() => this.props.onClickNewGame()}>New Game</Button>
        <Button bsStyle="warning" bsSize="large" onClick={() => this.props.onClickValidate()}>Validate</Button>
      </div>
    )
  }
}

class App extends Component {
  constructor() {
    super();

    // Init instance properties
    this.numMines = 10;
    this.gridSize = 8;

    // Init state
    this.state = this.defaultState;
  }
  get defaultState() {
    return {
      tileArr: this.getNewTileArr(),
        isActive: true,
      isWinner: false
    }
  }

  getNewTileArr() {
    // Create tile structure
    let tileArr =
      _.range(this.gridSize * this.gridSize).map((idx) => (
        {
          x: idx % this.gridSize,
          y: Math.floor(idx / this.gridSize),
          dist: 0,
          hasMine: false,
          isCovered: true
        }
      ));

    // Randomly assign mines
    let order = _.range(tileArr.length);
    _.range(this.numMines).forEach(function () {
      const idx = Math.floor(Math.random() * order.length);
      const tileIdx = order.slice(idx, idx + 1)[0];
      tileArr[tileIdx].hasMine = true;
    });

    // Assign distances
    const _this = this;
    tileArr.forEach(function(tile) {
      function distHelper(x, y) {
        const tile = tileArr[x + y * _this.gridSize]
        if (x < 0 || x >= _this.gridSize || y < 0 || y >= _this.gridSize)
          return 0
        return tile.hasMine ? 1 : 0;
      }
      tile.dist = 0;
      tile.dist += distHelper(tile.x + -1, tile.y + -1);
      tile.dist += distHelper(tile.x + 0, tile.y + -1);
      tile.dist += distHelper(tile.x + 1, tile.y + -1);

      tile.dist += distHelper(tile.x + -1, tile.y + 0);
      tile.dist += distHelper(tile.x + 1, tile.y + 0);

      tile.dist += distHelper(tile.x + -1, tile.y + 1);
      tile.dist += distHelper(tile.x + 0, tile.y + 1);
      tile.dist += distHelper(tile.x + 1, tile.y + 1);
    });
    return tileArr;
  }
  getTileIdx(x, y) {
    return this.gridSize * y + x;
  }
  handleNewGame() {
    this.setState(this.defaultState);
  }
  handleValidate() {
    let isWinner = true;
    for (let tile of this.state.tileArr) {
      isWinner = tile.isCovered ? tile.hasMine : !tile.hasMine;
      if (!isWinner) break;
    }
    this.setState({isActive: false, isWinner});
  }
  handleTileClick(idx) {
    // Exit if game is over
    if (!this.state.isActive) return

    // Uncover clicked tile
    let tileArr = this.state.tileArr.slice();
    let tile = tileArr[idx];
    tile.isCovered = false;
    this.setState({tileArr});
    if (!tile.hasMine && tile.dist === 0)
      this.tileChainReveal(tile.x, tile.y);

  }
  // when clicking on a tile, chain reveal all non-mine siblings
  tileChainReveal(x, y) {
    // Uncover siblings
    this.tileSiblingShow(x + 1, y - 1);
    this.tileSiblingShow(x, y - 1);
    this.tileSiblingShow(x - 1, y - 1);
    this.tileSiblingShow(x + 1, y);
    this.tileSiblingShow(x - 1, y);
    this.tileSiblingShow(x + 1, y + 1);
    this.tileSiblingShow(x, y + 1);
    this.tileSiblingShow(x - 1, y + 1);
  }
  // Siblings are shown
  tileSiblingShow(x, y) {
    // Exit if out of bounds
    if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) return;

    // Exit if has mine or already uncovered
    const tile = this.state.tileArr[this.getTileIdx(x, y)];
    if (tile.hasMine || !tile.isCovered) return;

    // Uncover
    let tileArr = this.state.tileArr.slice();
    tileArr[this.getTileIdx(x, y)].isCovered = false
    this.setState({tileArr});

    // Recurse
    if (tile.dist === 0)
      this.tileChainReveal(x, y);
  }
  render() {
    let appClassMods = '';
    if (this.state.isActive) appClassMods += ' is-active';
    if (this.state.isWinner) appClassMods += ' is-winner';
    return (
      <div>
        <Navbar bsStyle='inverse'>
          <div className="container">
            <div className="navbar-header">
              <a className="navbar-brand" href="#">Minesweeper</a>
            </div>
          </div>
        </Navbar>

        <div className={"App container text-center " + appClassMods}>
          <HUD
            onClickNewGame={() => this.handleNewGame()}
            onClickValidate={() => this.handleValidate()}
          />
          <Board
            tileArr={this.state.tileArr}
            onClickTile={(idx) => this.handleTileClick(idx)}
          />
        </div>
      </div>
    );
  }
}

export default App;
