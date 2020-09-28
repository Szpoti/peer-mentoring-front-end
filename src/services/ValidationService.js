export default class ValidationService {
  isValidUsername(input) {
    return /^[a-zA-Z0-9_]*$/.test(String(input));
  }

  isValidLastName(input) {
    return this._isOnlyLetters(input);
  }

  isValidFirstName(input) {
    return this._isOnlyLetters(input);
  }

  isValidPassword(input) {
    return /(?=[A-Za-z0-9@!@#$%&*()\-+=^]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%&*()\-+=^]).*$/.test(
      String(input)
    );
  }

  _isOnlyLetters(input) {
    return /^[a-zA-Z]+$/.test(String(input));
  }
}
