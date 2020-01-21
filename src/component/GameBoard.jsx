import React, { Component } from "react";
import Rows from "./rows";
import "./circle.css";

let hello = "HELLO".split("");
function findAllindices(prediction, circle) {
  let matchPredictionindices = [];
  var p = prediction.indexOf(circle.circleColor);
  while (p != -1) {
    matchPredictionindices.push(p);
    p = prediction.indexOf(circle.circleColor, p + 1);
  }
  return matchPredictionindices;
}
const buttonsColorScheme = [
  "#DAA520",
  "#DC143C",
  "#00FF7F",
  "#00FFFF",
  "#4169E1",
  "#800080"
];

const prediction = [
  buttonsColorScheme[Math.floor(Math.random() * Math.floor(5))],
  buttonsColorScheme[Math.floor(Math.random() * Math.floor(5))],
  buttonsColorScheme[Math.floor(Math.random() * Math.floor(5))],
  buttonsColorScheme[Math.floor(Math.random() * Math.floor(5))]
];
const initState = {
  colorSelected: "#DAA520",
  showRules: false,
  rowsFinished: false,
  gameFinished: false,
  rows: Array.from({ length: 10 }).map((r, rIdx) => ({
    rowIdx: rIdx,
    rowLock: Boolean(rIdx),
    rowFilled: true,
    checkCircles: Array.from({ length: 4 }).map((c, cIdx) => ({
      circleIdx: cIdx,
      circleClassName: "draw-circle draw-check-circle"
    })),
    circles: Array.from({ length: 4 }).map((c, cIdx) => ({
      circleIdx: cIdx,
      circleColor: "lightgray"
    }))
  })),
  buttonsColor: Array.from({ length: 6 }).map((r, bIdx) => ({
    buttonIdx: bIdx,
    buttonColor: buttonsColorScheme[bIdx],
    buttonClassName:
      buttonsColorScheme[bIdx] == "#DAA520"
        ? "draw-circle draw-circle-button draw-circle-button__select"
        : "draw-circle draw-circle-button"
  })),
  previousRowIndex: 0
};
class GameBoard extends Component {
  state = {
    ...initState
  };

  playAgain = () => {
    window.location.reload();
    //this.setState({ ...initState });
  };
  showGameStatus = rows => {
    let check = true;
    rows.checkCircles.forEach(circle => {
      if (
        circle.circleClassName !=
        "draw-circle draw-check-circle draw-check-circle--black"
      ) {
        check = false;
      }
    });
    console.log(check);
    this.setState({ gameFinished: check });
    return check;
  };
  showrules = () => {
    const showRules = !this.state.showRules;
    this.setState({ showRules });
  };
  handleTickClick = (circleArray, rIdx) => {
    let matchPredictionindices = [];
    let previousRowIndex = this.state.previousRowIndex;
    const rows = [...this.state.rows];
    let predictionarray = [...prediction];

    circleArray.forEach((circle, cIdx) => {
      const pIdx = prediction.indexOf(circle.circleColor);
      matchPredictionindices = findAllindices(prediction, circle);
      const predictionarray_pidx = predictionarray.indexOf(circle.circleColor);

      if (pIdx > -1 && predictionarray_pidx > -1) {
        if (
          matchPredictionindices.indexOf(cIdx) != -1 &&
          circle.circleColor == prediction[cIdx]
        ) {
          rows[rIdx].checkCircles[cIdx].circleClassName =
            "draw-circle draw-check-circle draw-check-circle--black";
          predictionarray.splice(predictionarray_pidx, 1);
        } else {
          predictionarray.splice(predictionarray_pidx, 1);
        }
      } else {
        rows[rIdx].checkCircles[cIdx].circleClassName =
          "draw-circle draw-check-circle draw-check-circle--brown";
      }
    });

    if (!this.showGameStatus(rows[rIdx])) {
      rows[rIdx].rowLock = true;
      if (rIdx < 9 && rIdx >= previousRowIndex) {
        rows[rIdx + 1].rowLock = false;
        previousRowIndex += 1;
        console.log("In if", this.state.previousRowIndex);
      }
    }
    const rowsFinished = rIdx >= 9 ? true : false;
    this.setState({ rows, previousRowIndex, rowsFinished });
    console.log("outside if", this.state.previousRowIndex);
  };
  handleCircleClick = (rIdx, cIdx) => {
    const rows = [...this.state.rows];
    if (!rows[rIdx].rowLock) {
      rows[rIdx].circles[cIdx].circleColor = this.state.colorSelected;
      let check = false;
      rows[rIdx].circles.forEach(circle => {
        if (circle.circleColor == "lightgray") {
          check = true;
        }
      });
      if (check == true) {
        rows[rIdx].rowFilled = true;
      } else {
        rows[rIdx].rowFilled = false;
      }
      this.setState({ rows });
    }
  };

  handleColorSelected = button => {
    const colorSelected = button.buttonColor;
    const buttonsColor = [...this.state.buttonsColor];
    const index = buttonsColor.indexOf(button);
    buttonsColor[index] = { ...button };
    buttonsColor.forEach(button => {
      button.buttonClassName = "draw-circle draw-circle-button";
    });
    buttonsColor[index].buttonClassName =
      "draw-circle draw-circle-button draw-circle-button__select";
    this.setState({ buttonsColor });
    this.setState({ colorSelected });
  };

  render() {
    return (
      <div>
        <div className="heading">
          {buttonsColorScheme.map((color, cIdx) => {
            return <h1 style={{ backgroundColor: color }}>{hello[cIdx]}</h1>;
          })}
          <h1>MIND</h1>
        </div>

        {this.state.showRules ? (
          <div className="show-rules">
            <h2 onClick={this.showrules}>Show rules</h2>
          </div>
        ) : (
          <div className="show-rules">
            <h2 onClick={this.showrules}>Hide rules</h2>
            <p>
              Try to guess the pattern, in both order and color, within ten
              turns. After submitting a row, a small black peg is placed for
              each code peg from the guess which is correct in both color and
              position. A white peg indicates the existence of a correct color
              code peg placed in the wrong position.Click for more{" "}
              <a href="https://en.wikipedia.org/wiki/Mastermind_(board_game)">
                wikepedia
              </a>
            </p>
          </div>
        )}

        <div className="main-container">
          <div>
            {this.state.rows.map(row => (
              <Rows
                style={{ backgroundColor: "black" }}
                onCircleClick={this.handleCircleClick}
                onTickClick={this.handleTickClick}
                key={row.rowIdx}
                row={row.rowIdx}
                rowLock={row.rowLock}
                rowFilledCheck={row.rowFilled}
                circleArray={row.circles}
                checkCircleArray={row.checkCircles}
              ></Rows>
            ))}
          </div>
          <div className="main-container__buttons">
            {this.state.buttonsColor.map(button => (
              <div
                key={button.buttonIdx}
                style={{ backgroundColor: button.buttonColor }}
                className={button.buttonClassName}
                onClick={() => this.handleColorSelected(button)}
              ></div>
            ))}
          </div>
        </div>
        {this.state.gameFinished ? (
          <span className="popup">
            <p className="popup-text">congratulations!</p>
            <div className="button-center">
              <button onClick={this.playAgain}>Play Again</button>
            </div>
          </span>
        ) : this.state.rowsFinished ? (
          <span style={{ backgroundColor: "red" }} className="popup">
            <p className="popup-text">Game finished!</p>
            <div className="button-center">
              <button onClick={this.playAgain}>Play Again</button>
            </div>
          </span>
        ) : (
          undefined
        )}
      </div>
    );
  }
}

export default GameBoard;
