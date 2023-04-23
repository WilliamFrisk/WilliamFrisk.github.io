import React, { Component } from "react";
import Boid from "./Boid";
import "../styles.css";
import Vector from "../../../utils/math/Vector";

class Flock extends Component {
  constructor(props) {
    super(props);
    this.maxForce = 0.2;
    this.maxSpeed = 5;
    this.state = {
      flock: this.initialiseFlock(),
    };
  }

  initialiseFlock() {
    let arr = [];
    for (let i = 0; i < 250; i++) {
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
      let v2 = this.separation(boid).scaleBy(1.5);
      let v3 = this.align(boid);

      boid.acc = boid.acc.add(v1);
      boid.acc = boid.acc.add(v2);
      boid.acc = boid.acc.add(v3);
      boid.vel = boid.vel.add(boid.acc);
      boid.vel = boid.vel.limit(this.maxSpeed);

      boid.pos = this.edges(boid);

      return {
        pos: boid.pos.add(boid.vel),
        vel: boid.vel,
        acc: new Vector(0, 0),
      };
    });
    this.setState({ flock: newFlock });
  }

  edges(boid) {
    if (boid.pos.components[0] > window.innerWidth) {
      return new Vector(0, boid.pos.components[1]);
    } else if (boid.pos.components[0] < 0) {
      return new Vector(window.innerWidth, boid.pos.components[1]);
    }

    if (boid.pos.components[1] > window.innerHeight) {
      return new Vector(boid.pos.components[0], 0);
    } else if (boid.pos.components[1] < 0) {
      return new Vector(boid.pos.components[0], window.innerHeight);
    }

    return boid.pos;
  }

  cohesion(current) {
    let perceptionRadius = 50;
    let steering = new Vector(0, 0);
    let total = 0;

    this.state.flock.forEach((boid) => {
      let d = Math.hypot(
        boid.pos.components[0] - current.pos.components[0],
        boid.pos.components[1] - current.pos.components[1]
      );

      if (boid !== current && d < perceptionRadius) {
        steering = steering.add(boid.pos);
        total++;
      }
    });

    if (total > 0) {
      steering = steering.scaleBy(1 / total);
      steering = steering.sub(current.pos);
      steering = steering.withLength(this.maxSpeed);
      steering = steering.sub(current.vel);
      steering = steering.limit(this.maxForce);
    }

    return steering;
  }

  separation(current) {
    let perceptionRadius = 24;
    let steering = new Vector(0, 0);
    let total = 0;

    this.state.flock.forEach((boid) => {
      let d = Math.hypot(
        boid.pos.components[0] - current.pos.components[0],
        boid.pos.components[1] - current.pos.components[1]
      );

      if (boid !== current && d < perceptionRadius) {
        let diff = current.pos.sub(boid.pos);
        diff = diff.scaleBy(1 / (d * d));
        steering = steering.add(diff);
        total++;
      }
    });

    if (total > 0) {
      steering = steering.scaleBy(1 / total);
      steering = steering.withLength(this.maxSpeed);
      steering = steering.sub(current.vel);
      steering = steering.limit(this.maxForce);
    }

    return steering;
  }

  align(current) {
    let perceptionRadius = 25;
    let steering = new Vector(0, 0);
    let total = 0;

    this.state.flock.forEach((boid) => {
      let d = Math.hypot(
        boid.pos.components[0] - current.pos.components[0],
        boid.pos.components[1] - current.pos.components[1]
      );

      if (boid !== current && d < perceptionRadius) {
        steering = steering.add(boid.vel);
        total++;
      }
    });

    if (total > 0) {
      steering = steering.scaleBy(1 / total);
      steering = steering.withLength(this.maxSpeed);
      steering = steering.sub(current.vel);
      steering = steering.limit(this.maxForce);
    }

    return steering;
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

    return <div id="content">{boids}</div>;
  }
}

export default Flock;
