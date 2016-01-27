"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Calc = (function () {
  _createClass(Calc, null, [{
    key: 'MAX_NUMBER',
    get: function get() {
      return 24;
    }
  }]);

  function Calc(options) {
    _classCallCheck(this, Calc);

    this.elem = options.elem;

    this._operand1 = '';
    this._operand2 = '';
    this._operator = null;
    this._activeOperand = '';
    this._result = '';
    this._hasError = false;

    this._resultField = document.querySelector('#result-field');

    // All available operators
    this._allOperators = {
      '+': function _(obj) {
        return obj.a + obj.b;
      },
      '-': function _(obj) {
        return obj.a - obj.b;
      },
      '*': function _(obj) {
        return obj.a * obj.b;
      },
      '/': function _(obj) {
        return obj.a / obj.b;
      },
      '1/x': function x(obj) {
        return 1 / obj.a;
      },
      'sqrt': function sqrt(obj) {
        return Math.sqrt(obj.a);
      },
      '%': function _(obj) {
        return obj.a * obj.b / 100;
      },
      'pow2': function pow2(obj) {
        return Math.pow(obj.a, 2);
      },
      'pow3': function pow3(obj) {
        return Math.pow(obj.a, 3);
      },
      'powy': function powy(obj) {
        return Math.pow(obj.a, obj.b);
      },
      '10pow': function pow(obj) {
        return Math.pow(10, obj.a);
      },
      'factorial': function factorial(obj) {
        function factorial(n) {
          return n ? n * factorial(n - 1) : 1;
        }

        return factorial(obj.a);
      }
    };

    // Buttons event listener
    this.elem.addEventListener('click', (function (e) {
      var target = e.target;

      if (target.tagName === 'A') {
        if (!this._hasError || this._hasError && target.dataset.type === 'clear') {
          this._handleButtonsClick(e);
        }

        this._showResult(this._result || 0);
      }
    }).bind(this));

    // Keyboard event listener
    document.addEventListener('keypress', (function (e) {
      if (!this._hasError) {
        this._handleKeyboardClick(e);
      }

      this._showResult(this._result || 0);
    }).bind(this));
    document.addEventListener('keydown', (function (e) {
      if (!this._hasError || this._hasError && e.keyCode === 27) {
        this._handleKeyboardSpecialClick(e);
      }

      this._showResult(this._result || 0);
    }).bind(this));

    // Show result by default
    this._showResult(0);
  }

  // Handle button's click

  _createClass(Calc, [{
    key: '_handleButtonsClick',
    value: function _handleButtonsClick(e) {
      var dataset = e.target.dataset;

      // Button's handler
      switch (dataset.type) {
        case 'operand':
          this._handleOperand(dataset.value);
          break;
        case 'operator':
          this._handleOperator(dataset.value);
          break;
        case 'point':
          this._handlePoint(dataset.value);
          break;
        case 'remove':
          this._handleRemoveButton();
          break;
        case 'sign':
          this._handleChangeSign();
          break;
        case 'result':
          this._handleResult();
          break;
        case 'clear':
          this._handleClear();
          break;
      }
    }

    // Handle keyboard's click

  }, {
    key: '_handleKeyboardClick',
    value: function _handleKeyboardClick(e) {
      var keyCode = e.keyCode,
          char = getChar(e);

      // operand
      if (keyCode >= 48 && keyCode <= 57) {
        this._handleOperand(char);
      }

      // operator
      if (keyCode === 42 || keyCode === 43 || keyCode === 45 || keyCode === 47) {
        this._handleOperator(char);
      }

      // point
      if (keyCode === 46) {
        this._handlePoint(char);
      }

      function getChar(event) {
        if (event.which == null) {
          if (event.keyCode < 32) return null;
          return String.fromCharCode(event.keyCode);
        }

        if (event.which != 0 && event.charCode != 0) {
          if (event.which < 32) return null;
          return String.fromCharCode(event.which);
        }

        return null;
      }
    }
  }, {
    key: '_handleKeyboardSpecialClick',
    value: function _handleKeyboardSpecialClick(e) {
      var keyCode = e.keyCode;

      // clear
      if (keyCode === 8) {
        this._handleRemoveButton();
      }

      // result
      if (keyCode === 13) {
        this._handleResult();
      }

      // clear
      if (keyCode === 27) {
        this._handleClear();
      }
    }

    // Handle operand

  }, {
    key: '_handleOperand',
    value: function _handleOperand(value) {
      if (this._activeOperand === '0') {
        if (value === '0') {
          return;
        } else if (value !== '.') {
          this._activeOperand = '';
        }
      }

      if (this._activeOperand.length < Calc.MAX_NUMBER) {
        this._result = this._activeOperand += value;
      }
    }

    // Handle operator

  }, {
    key: '_handleOperator',
    value: function _handleOperator(operator) {
      this._copyOperands();

      switch (operator) {
        case '1/x':
        case 'sqrt':
        case 'pow2':
        case 'pow3':
        case '10pow':
        case 'factorial':
          singleMath.apply(this);
          break;
        case '+':
        case '-':
        case '*':
        case '/':
        case 'powy':
          simpleMath.apply(this);
          break;
        case '%':
          complexMath.apply(this);
          break;
      }

      // Simple math function
      function simpleMath() {
        this._interimResult();

        if (this._operand1) {
          this._operator = operator;
        }
      }

      // Single math function
      function singleMath() {
        this._result = this._calcResult({
          firstOperator: this._operand2 || this._operand1,
          operator: operator
        });

        if (!this._operator) {
          this._operand1 = this._result;
        } else {
          this._operand2 = this._result;
        }
      }

      // Complex math function
      function complexMath() {
        if (this._operator) {
          this._result = this._calcResult({
            firstOperator: this._operand1,
            secondOperator: this._operand2 || this._operand1,
            operator: operator
          });

          this._operand2 = this._result;
        }
      }
    }

    // Handle decimal point

  }, {
    key: '_handlePoint',
    value: function _handlePoint(value) {
      var activeOperand = this._activeOperand;

      if (activeOperand.indexOf('.') === -1) {
        if (activeOperand.charAt(0) === '') {
          value = '0.';
        }
        this._handleOperand(value);
      }
    }

    // Handle backspace button

  }, {
    key: '_handleRemoveButton',
    value: function _handleRemoveButton() {
      this._result = this._activeOperand = this._activeOperand.slice(0, -1);
    }

    // Handle change sign button

  }, {
    key: '_handleChangeSign',
    value: function _handleChangeSign() {
      var activeOperand = this._activeOperand;

      if (activeOperand) {
        if (activeOperand.charAt(0) === '-') {
          this._activeOperand = activeOperand.slice(1);
        } else {
          this._activeOperand = '-' + activeOperand;
        }

        this._result = this._activeOperand;
      }
    }

    // Result button handler

  }, {
    key: '_handleResult',
    value: function _handleResult() {
      if (this._operator) {
        this._copyOperands();
      }

      this._interimResult();
    }

    // Clear button handler

  }, {
    key: '_handleClear',
    value: function _handleClear() {
      this._operand1 = '';
      this._operand2 = '';
      this._operator = null;
      this._activeOperand = '';
      this._result = '';
      this._hasError = false;
    }

    // Calculation result

  }, {
    key: '_calcResult',
    value: function _calcResult(obj) {
      var result = undefined;

      try {
        result = this._allOperators[obj.operator]({
          a: parseFloat(obj.firstOperator) || 0,
          b: parseFloat(obj.secondOperator) || 0
        });
      } catch (e) {}

      if (!isNumeric(result)) {
        this._hasError = true;
        return 'Недопустимое значение';
      }

      function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      }

      return +result.toFixed(20);
    }

    // Copy active operand

  }, {
    key: '_copyOperands',
    value: function _copyOperands() {
      if (this._activeOperand) {
        if (!this._operand1) {
          this._operand1 = this._activeOperand;
        } else {
          this._operand2 = this._activeOperand;
        }

        this._activeOperand = '';
      }
    }

    // Show result

  }, {
    key: '_showResult',
    value: function _showResult(value) {
      this._resultField.value = value;
    }
  }, {
    key: '_interimResult',
    value: function _interimResult() {
      if (this._operand1 && this._operand2 && this._operator) {
        this._result = this._calcResult({
          firstOperator: this._operand1,
          secondOperator: this._operand2,
          operator: this._operator
        });

        this._operand1 = this._result;
        this._operand2 = this._operator = '';
      }
    }
  }]);

  return Calc;
})();

var calc = new Calc({
  elem: document.querySelector('#calc')
});