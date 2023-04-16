import React, { Component } from "react";
import Boid from "./Boid";
import "../styles.css";
import Vector from "../../../utils/math/Vector";

class Flock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flock: this.initialiseFlock(),
    };
  }

  initialiseFlock() {
    let arr = [];
    for (let i = 0; i < 50; i++) {
      let xPos = Math.floor(Math.random() * window.innerWidth);
      let yPos = Math.floor(Math.random() * window.innerHeight);

      arr.push({
        pos: new Vector(xPos, yPos),
        vel: new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1),
        acc: new Vector(0, 0),
      });
    }

    return arr;
  }

  updateFlock() {
    const newFlock = this.state.flock.map((boid) => {
      let v1 = this.cohesion(boid);

      let v2 = this.separation(boid);
      let v3 = this.alignment(boid);

      boid.acc = boid.acc.add(v1);
      boid.acc = boid.acc.add(v2);
      boid.acc = boid.acc.add(v3);
      boid.vel = boid.vel.add(boid.acc);
      this.limitVelocity(boid);

      return {
        pos: boid.pos.add(boid.vel),
        vel: boid.vel,
        acc: boid.acc,
      };
    });
    this.setState({ flock: newFlock });
  }

  cohesion(current) {
    let pc = new Vector(0, 0);
    this.state.flock.forEach((boid) => {
      if (boid !== current) {
        pc = pc.add(boid.pos);
      }
    });

    pc = pc.scaleBy(1 / (this.state.flock.length - 1));
    return pc.sub(current.pos).scaleBy(1 / 100);
  }

  separation(current) {
    let c = new Vector(0, 0);

    this.state.flock.forEach((boid) => {
      if (boid !== current) {
        if (Math.abs(boid.pos.sub(current.pos).length()) < 100) {
          c = c.sub(boid.pos.sub(current.pos));
        }
      }
    });

    return c;
  }

  alignment(current) {
    let pv = new Vector(0, 0);

    this.state.flock.forEach((boid) => {
      if (boid !== current) {
        pv = pv.add(boid.vel);
      }
    });

    pv = pv.scaleBy(1 / (this.state.flock.length - 1));

    return pv.sub(current.vel).scaleBy(1 / 8);
  }

  limitVelocity(boid) {
    let vLim = 10;

    if (Math.abs(boid.vel.length()) > vLim) {
      boid.vel = boid.vel.withLength(vLim);
    }
  }

  componentDidMount() {
    this.intervald = setInterval(() => {
      this.updateFlock();
    }, 16);
  }

  componentWillUnmount() {
    clearInterval(this.intervald);
  }

  render() {
    const boids = this.state.flock.map((boid, index) => {
      return <Boid key={index} pos={boid.pos} vel={boid.vel} />;
    });

    return <div>{boids}</div>;
  }
}

export default Flock;
