const toDegrees = (radians) => (radians * 180) / Math.PI;
const toRadians = (degrees) => (degrees * Math.PI) / 180;

class Vector {
  constructor(...components) {
    this.components = components;
  }

  add({ components }) {
    return new Vector(
      ...components.map(
        (component, index) => this.components[index] + component
      )
    );
  }

  sub({ components }) {
    return new Vector(
      ...components.map(
        (component, index) => this.components[index] - component
      )
    );
  }

  scaleBy(number) {
    return new Vector(
      ...this.components.map((component) => component * number)
    );
  }

  length() {
    return Math.hypot(...this.components);
  }

  dotProduct({ components }) {
    return components.reduce(
      (acc, component, index) => acc + component * this.components[index]
    );
  }

  normalize() {
    return this.scaleBy(1 / this.length());
  }

  angleBetween(other) {
    return toDegrees(
      Math.acos(this.dotProduct(other) / (this.length() * other.length()))
    );
  }

  withLength(newLength) {
    return this.normalize().scaleBy(newLength);
  }

  equalTo({ components }) {
    return components.every(
      (component, index) => component === this.components[index]
    );
  }

  projectOn(other) {
    const normalized = other.normalize();
    return normalized.scaleBy(this.dotProduct(normalized));
  }

  limit(limit) {
    if (this.length() > limit) {
      return this.withLength(limit);
    } else {
      return this;
    }
  }
}

export default Vector;
