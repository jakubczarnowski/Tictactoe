import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
    <button className={"square " + (props.winning ? "winner" : "")}  onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(arg) {
    return (
    <Square
      value={this.props.squares[arg[0]]}
      onClick={()=>this.props.onClick(arg[0])}
      winning={arg[1]}
    />);
  }
  render() {
    const winning = this.props.squares.map((item, i)=>{
      if(this.props.winningSquare.includes(i)){
        return([i, true]);
      }
      return ([i, false]);
    })

    return (
      <div>
        <div className="board-row">
          {this.renderSquare(winning[0])}
          {this.renderSquare(winning[1])}
          {this.renderSquare(winning[2])}
        </div>
        <div className="board-row">
          {this.renderSquare(winning[3])}
          {this.renderSquare(winning[4])}
          {this.renderSquare(winning[5])}
        </div>
        <div className="board-row">
          {this.renderSquare(winning[6])}
          {this.renderSquare(winning[7])}
          {this.renderSquare(winning[8])}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [
        {squares:Array(9).fill(null)}
      ],
      xIsNext : true,
      stepNumber: 0,
    }
  }
  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step%2) === 0,
    })
  }
  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length-1];
    const squares = current.squares.slice();
    if (calculateWinner(squares)[0] || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O' ;
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    });
  }
  highlightSquares(line){
    
  }
  render() {
    const history = this.state.history.slice();
    const current = history[this.state.stepNumber];
    const [winner, lines] = calculateWinner(current.squares);
    let status;
    if (winner) {
      status = 'Wygrywa: ' + winner;
      this.highlightSquares(lines);

    } else {
      status = 'Następny gracz: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    const moves = history.map((step, move)=>{
      const desc = move ? 'Przejdź do ruchu #' + move : 'Przejdź na początek gry';
      return (
        <div className='lastMove' key={move}>
          <Board
          squares={step.squares}
          onClick={()=>""} // Wylaczanie opcji klikania
          winningSquare={[]}
          />
          <button onClick={()=> this.jumpTo(move)}>{desc}</button>
        </div>

      )
    })
      return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)} 
            winningSquare ={lines}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

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
      return [squares[a], lines[i]];
    }
  }
  return [null, []];
}