import React, { Component } from "react";
import "./circle.css";
class Rows extends Component {
  state = {};
  render() {
    return (
      <div
        className="row-flex"
        style={!this.props.rowLock ? { border: "1px solid #333" } : undefined}
      >
        {this.props.circleArray.map(({ circleIdx, circleColor }) => (
          <span
            key={circleIdx}
            style={{ backgroundColor: circleColor }}
            onClick={() => this.props.onCircleClick(this.props.row, circleIdx)}
            className="draw-circle"
          ></span>
        ))}

        {!this.props.rowFilledCheck && (
          <span
            onClick={() =>
              this.props.onTickClick(this.props.circleArray, this.props.row)
            }
            className="tick-style"
          >
            &#10004;
          </span>
        )}
        <div className="check-circles">
          {this.props.checkCircleArray.map(checkcircle => (
            <span
              key={checkcircle.circleIdx}
              className={checkcircle.circleClassName}
            ></span>
          ))}
        </div>
      </div>
    );
  }
}

export default Rows;
