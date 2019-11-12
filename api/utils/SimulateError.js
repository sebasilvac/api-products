export default class SimulateError {

  /**
   * Simulamos una taza de error del 10%
   */
  simulate() {
    let simulate = this.getRandomArbitrary(1, 10);

    if (simulate == 1) {
      return true;
    }

    return false;
  }

  /**
   * Obtenemos un número entero con min y max
   */
  getRandomArbitrary(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }
}
