class Store {
  static getItem(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
  }

  static setItem(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }
}
