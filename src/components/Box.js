import React, { Component } from "react";

class Box extends Component {
  constructor(props) {
    super(props);
    this.state = {
      top: 50,
      left: 50,
    };
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  handleMouseMove(event) {
    this.setState({
      top: event.clientY,
      left: event.clientX,
    });
  }

  render() {
    const { top, left } = this.state;
    const boxStyle = {
      position: "absolute",
      top: `${top}px`,
      left: `${left}px`,
      width: "100px",
      height: "100px",
      backgroundColor: "blue",
    };

    return (
      <div
        className="box"
        style={boxStyle}
        onMouseMove={this.handleMouseMove}
      ></div>
    );
  }
}

export default Box;
