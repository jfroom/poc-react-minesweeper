import React from 'react';
import {Tile, Board, HUD, App} from './App';
import toJson from 'enzyme-to-json';
import _ from 'underscore';

// TILE
describe ('Tile Component', () => {
  it ('empty & no cover', () => {
    const wrap = shallow(<Tile onClick={() => {}}/>);
    expect(toJson(wrap)).toMatchSnapshot();

    // Empty
    expect(wrap.find('.tile')).not.toHaveText();

    // Has no cover
    expect(wrap.find('.tile-cover')).toBeEmpty();
  });

  it ('covered with content & click event testing', () => {
    // Mock click handler
    const onClick = jest.fn();

    // Create shallow wrap & Assert snapshot
    const wrap = shallow(<Tile isCovered={true} dist={1} onClick={onClick}/>);
    expect(toJson(wrap)).toMatchSnapshot();

    // Empty
    expect(wrap.find('.tile')).toHaveText('1');

    // Has cover
    expect(wrap.find('.tile-cover')).toBePresent();

    // Simulate click
    wrap.find('.tile-cover').simulate('click');

    // Mock called once with no arguments
    expect(onClick.mock.calls.length).toBe(1);
  });

  it ('snapshot Tile, with mine', () => {
    const wrap = shallow(<Tile hasMine={true} />);
    expect(toJson(wrap)).toMatchSnapshot();

    // Mine
    expect(wrap.find('Glyphicon')).toBePresent();
  });

});

// BOARD
describe ('Board Component', () => {
  it('Board renders & handles tile clicks', () => {
    const tiles = [
      {isCovered: true, dist: 0},
      {isCovered: true, dist: 1},
      {isCovered: false, dist: 0},
      {isCovered: false, dist: 2}
    ];
    const onClickTile = jest.fn();
    const wrap = shallow(<Board tiles={tiles} onClickTile={onClickTile} />);
    expect(toJson(wrap)).toMatchSnapshot();
    expect(wrap.find('Tile').length).toBe(tiles.length);

    // Use mock to assert tile clicks
    const rTiles = wrap.find('Tile');
    expect(onClickTile.mock.calls.length).toBe(0);

    // Click first tile
    rTiles.at(0).simulate('click');
    expect(onClickTile.mock.calls.length).toBe(1);
    expect(onClickTile.mock.calls[0][0]).toBe(0);

    // Click last tile
    rTiles.at(tiles.length - 1).simulate('click');
    expect(onClickTile.mock.calls.length).toBe(2);
    expect(onClickTile.mock.calls[1][0]).toBe(tiles.length - 1);
  });
});

// HUD
describe ('HUD Component', () => {
  it('Game Active', () => {
    const onClickValidate = jest.fn();
    const onClickNewGame = jest.fn();
    const wrap = shallow(
      <HUD isGameActive={true} onClickValidate={onClickValidate} onClickNewGame={onClickNewGame}/>
    );
    expect(toJson(wrap)).toMatchSnapshot();

    wrap.find('#validate').simulate('click');
    expect(onClickValidate.mock.calls.length).toBe(1);
    expect(onClickNewGame.mock.calls.length).toBe(0);

    wrap.find('#newgame').simulate('click');
    expect(onClickValidate.mock.calls.length).toBe(1);
    expect(onClickNewGame.mock.calls.length).toBe(1);
  });
  it('Game over with winner', () => {
    const wrap = shallow(
      <HUD isGameActive={false} isWinner={true} onClickValidate={() => {}} onClickNewGame={() => {}}/>
    );
    expect(toJson(wrap)).toMatchSnapshot();
  });
  it('Game over with loser', () => {
    const wrap = shallow(
      <HUD isGameActive={false} isWinner={false} onClickValidate={() => {}} onClickNewGame={() => {}}/>
    );
    expect(toJson(wrap)).toMatchSnapshot();
  });
});

// APP
describe ('App Component', () => {
  it('Renders, loses, resets, wins', () => {
    const mineIndices =
      [0, 5, 6, 8, 20, 21, 31, 38, 45, 55];
    const tileDistances = [
      0,2,0,0,1,0,0,1,
      0,2,0,1,3,4,3,1,
      1,1,0,1,0,0,2,1,
      0,0,0,1,2,3,3,0,
      0,0,0,0,1,2,0,2,
      0,0,0,0,1,0,3,2,
      0,0,0,0,1,1,2,0,
      0,0,0,0,0,0,1,1
    ];

    // Set main App wrap & assert baseline snapshot
    const wrap = shallow(<App mineIndices={mineIndices} />);
    expect(toJson(wrap)).toMatchSnapshot();

    // Assert tile distances
    const distances = wrap.find('Board').prop('tiles').map(tile => tile.dist);
    expect(distances).toEqual(tileDistances);

    // All tiles covered
    const numTilesCovered = () =>
      _.countBy(
        wrap.find('Board').prop('tiles'),
        (tile) => tile.isCovered
      );
    const clickTile = (idx) => wrap.find('Board').prop('onClickTile')(idx);
    expect(numTilesCovered()).toEqual({"true": 64});

    // Game starts with default HUD
    expect(wrap).toHaveState('isActive', true);
    let hud = wrap.find('HUD');
    expect(hud).toHaveProp('isGameActive', true);

    // Clicking on mine loses game
    wrap.simulate('clickTile');
    clickTile(mineIndices[0]);
    hud = wrap.find('HUD');
    expect(wrap).toHaveState('isActive', false);
    expect(hud).toHaveProp('isGameActive', false);
    expect(hud).toHaveProp('isWinner', false);
    expect(wrap.find(".App")).not.toHaveClassName('is-winner');
    expect(numTilesCovered()).toEqual({true: 63, false: 1});
    expect(wrap.find('Board').props('tiles')).toMatchSnapshot();


    // Start new game
    wrap.find('HUD').prop('onClickNewGame')();
    expect(numTilesCovered()).toEqual({true: 64});

    // Uncover distance of '2'
    clickTile(1);
    expect(wrap).toHaveState('isActive', true);
    expect(numTilesCovered()).toEqual({true: 63, false: 1});

    // Chain uncover
    clickTile(2);
    expect(wrap).toHaveState('isActive', true);
    var test = {true: 23, false: 41};
    expect(numTilesCovered()).toEqual(test);

    // Uncover one at a time
    for (let idx of [7, 13, 14, 15, 22, 23, 29, 30, 37, 39, 46, 47, 63]) {
      clickTile(idx);
      test.true--;
      test.false++;
      expect(numTilesCovered()).toEqual(test);
    }

    // Winner!
    wrap.find('HUD').prop('onClickValidate')();
    expect(wrap).toHaveState('isActive', false);
    expect(wrap).toHaveState('isWinner', true);
    hud = wrap.find('HUD');
    expect(hud).toHaveProp('isGameActive', false);
    expect(hud).toHaveProp('isWinner', true);
  });
});
