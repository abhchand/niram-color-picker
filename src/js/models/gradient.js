/*
 * Models an ordered list of `Color` objects, from
 * darkest to lightest shade
 */
class Gradient {
  constructor(values = null) {
    this._gradient = values || [];

    this.add = this.add.bind(this);
    this.addNull = this.addNull.bind(this);
    this.baseColor = this.baseColor.bind(this);
    this.forEach = this.forEach.bind(this);
    this.indexOf = this.indexOf.bind(this);
    this.map = this.map.bind(this);
    this.merge = this.merge.bind(this);
    this.set = this.set.bind(this);
    this.toJSON = this.toJSON.bind(this);
    this.valueAt = this.valueAt.bind(this);
  }

  add(color) {
    this._gradient.push(color.isValid() ? color : null);
  }

  addNull() {
    this._gradient.push(null);
  }

  baseColor() {
    /*
     * Return the center (base) color
     * Assumption is that the Gradient length is an odd number
     */
    const ordinal = (this._gradient.length - 1) / 2;

    return this._gradient[ordinal];
  }

  forEach(callback) {
    this._gradient.forEach(callback);
  }

  indexOf(idx) {
    return this._gradient.indexOf(idx);
  }

  map(callback) {
    return this._gradient.map(callback);
  }

  merge(otherGradient) {
    const values = [];

    for (let i = 0; i < this._gradient.length; i++) {
      values.push(otherGradient.valueAt(i) || this.valueAt(i));
    }

    return new Gradient(values);
  }

  set(idx, value) {
    this._gradient[idx] = value;
  }

  toJSON() {
    return this._gradient;
  }

  valueAt(idx) {
    return this._gradient[idx];
  }
}

export default Gradient;
