import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

// class Square extends React.Component {
//   render() {
//     return (
//       <button className="square" onClick={() => this.props.onClick({value: 'X'})}>
//         {this.props.value}
//       </button>
//     );
//   }
// }

function Square(props) {
  if (props.highlight) {
    return (
      <button className="square" onClick={() => props.onClick()} style={{color: "red"}}> 
        {props.value}
      </button>
    );
  }else {
    return (
      <button className="square" onClick={() => props.onClick()}>
        {props.value}
      </button>
    );
  }
}

class Board extends React.Component {

  renderSquare(i) {
    return (<Square
            key={i}
            value={this.props.squares[i]}
            highlight={this.props.winnerLine.includes(i)}
            onClick={() => this.props.onClick(i)}
          />
      );
  }

  render() {
    var rows = [];
    for(let i=0; i<3; i++) {
      var row = [];
      for(let j=3*i; j<3*i+3; j++) {
        row.push(this.renderSquare(j));
      }
      rows.push(<div className="board=row" key={i}>{row}</div>)
    }
    
    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        stepX: 0,
        stepY: 0,
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares).winner;
    const line = calculateWinner(current.squares).line;
    const moves = history.map((step, move) => {
      const desc = move ?
        'Move #(' +  step.stepX + ',' + step.stepY + ')':
        'Game start';
      const jumpTextDesc = (move === this.state.stepNumber)?
      <a href="#" className="highlight" onClick={() => this.jumpTo(move)}>{desc}</a>:
      <a href="#" className="" onClick={() => this.jumpTo(move)}>{desc}</a>;
      return (
        <li key={move}>
          {jumpTextDesc}
        </li>
      );
    });
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
        <Board
            squares={current.squares}
            winnerLine={line}
            onClick={(i) => this.handleClick(i)}
        />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        stepX: Math.floor(i/3) + 1,
        stepY: i%3 + 1,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    });
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner:squares[a], line:[a, b, c]};
    }
  }
  return {winner:null, line:[]};
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);



registerServiceWorker();