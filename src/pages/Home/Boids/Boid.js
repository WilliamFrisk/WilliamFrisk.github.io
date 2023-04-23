import React, { Component } from "react";
import "../styles.css";
import Vector from "../../../utils/math/Vector";

const toDegrees = (radians) => (radians * 180) / Math.PI;

class Boid extends Component {
  constructor(props) {
    super(props);
  }

  update() {}

  move() {
    const { pos, vel } = this.state;
    this.setState({
      pos: pos.add(vel),
      vel: vel,
    });
  }

  getAngleDegrees(x1, y1) {
    const x2 = this.props.vel.components[0];
    const y2 = this.props.vel.components[1];

    const dot = x1 * x2 + y1 * y2;
    const det = x1 * y2 - y1 * x2;
    const angleRadians = Math.atan2(det, dot);
    const angleDegrees = (angleRadians * 180) / Math.PI;
    return (angleDegrees + 360) % 360;
  }

  render() {
    let rotation = this.getAngleDegrees(0, -1);
    const boxStyle = {
      top: `${this.props.pos.components[1]}px`,
      left: `${this.props.pos.components[0]}px`,
      transform: `rotate(${rotation}deg)`,
    };

    return <div className="boid" style={boxStyle}></div>;
  }
}

export default Boid;
