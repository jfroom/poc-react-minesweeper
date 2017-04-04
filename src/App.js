import React, {Component} from 'react';
import _ from 'underscore';
import {Navbar, Button, Glyphicon} from 'react-bootstrap';
import './App.css';

// TILE
export class Tile extends Component {
  render() {
    let content = (this.props.dist || 0) > 0 ? this.props.dist : null;
    if (this.props.hasMine)
      content = <Glyphicon glyph='fire'/>;
    return (
      <div className='tile-wrap'>
        <div className="tile">{content}</div>
        {this.props.isCovered && <div className="tile-cover" onClick={() => this.props.onClick()}/>}
      </div>
    );
  }
}
Tile.propTypes = {
  isCovered: React.PropTypes.bool,
  hasMine:  React.PropTypes.bool,
  dist: React.PropTypes.number,
  onClick: React.PropTypes.func
};

// BOARD
export class Board extends Component {
  render() {
    const tiles = this.props.tiles.map((tile, idx) =>
      <Tile
        key={idx}
        onClick={() => this.props.onClickTile(idx)}
        isCovered={tile.isCovered}
        hasMine={tile.hasMine}
        dist={tile.dist}
      />
    );
    return (
      <div className='board'>{tiles}</div>
    );
  }
}
Board.propTypes = {
  tiles: React.PropTypes.arrayOf(React.PropTypes.shape({
    isCovered: React.PropTypes.bool.isRequired,
    dist: React.PropTypes.number.isRequired
  })).isRequired,
  onClickTile: React.PropTypes.func.isRequired
};

// HUD
export class HUD extends Component {
  render() {
    let validateBtn;
    if (this.props.isGameActive)
      validateBtn =
        <Button id='validate' bsStyle="warning" bsSize="large" onClick={() => this.props.onClickValidate()}>Validate</Button>;
    else if (this.props.isWinner)
      validateBtn =
        <Button id='result' bsStyle="success" bsSize="large" disabled>Winner!</Button>;
    else
      validateBtn =
        <Button id='result' bsStyle="danger" bsSize="large" disabled>Loser!</Button>;
    return (
      <div className='hud'>
        <Button id='newgame' bsStyle="primary" bsSize="large" onClick={() => this.props.onClickNewGame()}>New Game</Button>
        {validateBtn}
      </div>
    );
  }
}
HUD.propTypes = {
  isGameActive: React.PropTypes.bool.isRequired,
  isWinner: React.PropTypes.bool,
  onClickValidate: React.PropTypes.func.isRequired,
  onClickNewGame: React.PropTypes.func.isRequired
};

// HEADER
function Header() {
  return (
    <Navbar bsStyle='inverse'>
      <div className="container">
        <div className="navbar-header">
          <a className="navbar-brand" href="#">Minesweeper</a>
        </div>
        <ul className="nav navbar-nav navbar-right">
          <li>
            <a href="https://github.com/jfroom/poc-react-minesweeper"><small>Source</small></a>
          </li>
        </ul>
      </div>
    </Navbar>
  );
}

// APP
export class App extends Component {
  constructor(props) {
    super(props);

    // Init instance properties
    this.numMines = 10;
    this.gridSize = 8;

    // Init state
    this.state = this.defaultState;
  }
  get defaultState() {
    // Create base Tile structs
    let tiles =
      _.range(this.gridSize * this.gridSize).map((idx) => (
        {
          x: idx % this.gridSize,
          y: Math.floor(idx / this.gridSize),
          dist: 0,
          hasMine: false,
          isCovered: true
        }
      ));

    // Assign mine indices from props, or randomly
    let mineIndicies =
      this.props.mineIndices ?
      this.props.mineIndices :
      _.shuffle(_.range(tiles.length)).slice(0, this.numMines);
    for (let idx of mineIndicies)
      tiles[idx].hasMine = true;

    // Assign tile distances to siblings with mines
    const distHelper = (x, y) => {
      const tile = tiles[x + y * this.gridSize];
      // Constrain to valid x,y perimeter
      if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize)
        return 0;
      return tile.hasMine ? 1 : 0;
    };
    for (let tile of tiles) {
      tile.dist = 0;
      if (tile.hasMine) continue;
      tile.dist += distHelper(tile.x + -1, tile.y + -1);
      tile.dist += distHelper(tile.x + 0, tile.y + -1);
      tile.dist += distHelper(tile.x + 1, tile.y + -1);

      tile.dist += distHelper(tile.x + -1, tile.y + 0);
      tile.dist += distHelper(tile.x + 1, tile.y + 0);

      tile.dist += distHelper(tile.x + -1, tile.y + 1);
      tile.dist += distHelper(tile.x + 0, tile.y + 1);
      tile.dist += distHelper(tile.x + 1, tile.y + 1);
    }

    // Finally return default state
    return {
      tiles: tiles,
      isActive: true,
      isWinner: false
    };
  }
  // Tile event handling
  handleTileClick(idx) {
    // Exit if game is over
    if (!this.state.isActive)
      return;

    // Uncover clicked tile
    let tiles = this.state.tiles.slice();
    let tile = tiles[idx];
    tile.isCovered = false;
    this.setState({tiles});
    if (!tile.hasMine && tile.dist === 0)
      return this.tileChainReveal(tile.x, tile.y);

    // Lost game?
    for (let tile of this.state.tiles) {
      if (tile.hasMine && !tile.isCovered) {
        this.setState({isActive: false, isWinner: false});
        return;
      }
    }
  }
  // When clicking on a tile, chain reveal all non-mine siblings
  tileChainReveal(x, y) {
    this.tileSiblingShow(x + 1, y - 1);
    this.tileSiblingShow(x, y - 1);
    this.tileSiblingShow(x - 1, y - 1);
    this.tileSiblingShow(x + 1, y);
    this.tileSiblingShow(x - 1, y);
    this.tileSiblingShow(x + 1, y + 1);
    this.tileSiblingShow(x, y + 1);
    this.tileSiblingShow(x - 1, y + 1);
  }
  tileSiblingShow(x, y) {
    // Exit if out of bounds
    if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize)
      return;

    // Exit if has mine or already uncovered
    const tileIdx = x + this.gridSize * y;
    const tile = this.state.tiles[tileIdx];
    if (tile.hasMine || !tile.isCovered)
      return;

    // Uncover
    let tiles = this.state.tiles.slice();
    tiles[tileIdx].isCovered = false;
    this.setState({tiles});

    // Recurse
    if (tile.dist === 0)
      this.tileChainReveal(x, y);
  }
  // HUD event handling
  handleNewGame() {
    this.setState(this.defaultState);
  }
  handleValidate() {
    // Number of uncovered tiles (without mines) should == AllTiles - NumberOfMines
    let numUncoveredWithoutMine = 0;
    this.state.tiles.forEach(tile => {
      if (!tile.isCovered && !tile.hasMine)
        numUncoveredWithoutMine++;
    });
    const isWinner = numUncoveredWithoutMine === this.gridSize * this.gridSize - this.numMines;
    this.setState({isActive: false, isWinner: isWinner});
  }
  render() {
    let appClassMods = '';
    if (this.state.isActive) appClassMods += ' is-active';
    if (this.state.isWinner) appClassMods += ' is-winner';
    return (
      <div>
        <Header />
        <div className={"App container text-center " + appClassMods}>
          <HUD
            onClickNewGame={() => this.handleNewGame()}
            onClickValidate={() => this.handleValidate()}
            isGameActive={this.state.isActive}
            isWinner={this.state.isWinner}
          />
          <Board
            tiles={this.state.tiles}
            onClickTile={(idx) => this.handleTileClick(idx)}
          />
        </div>
      </div>
    );
  }
}
App.propTypes = {
  mineIndices: React.PropTypes.arrayOf(React.PropTypes.number)
};

export default App;
