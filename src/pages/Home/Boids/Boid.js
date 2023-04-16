import React, { Component } from "react";
import "../styles.css";
import Vector from "../../../utils/math/Vector";

class Boid extends Component {
  constructor(props) {
    super(props);
  }

  move() {
    const { pos, vel } = this.state;
    this.setState({
      pos: pos.add(vel),
      vel: vel,
    });
  }

  render() {
    const boxStyle = {
      top: `${this.props.pos.components[1]}px`,
      left: `${this.props.pos.components[0]}px`,
    };

    return <div className="dot" style={boxStyle}></div>;
  }
}

export default Boid;
