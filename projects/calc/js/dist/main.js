"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Calc = (function () {
  function Calc(options) {
    _classCallCheck(this, Calc);

    this.elem = options.elem;

    this._storedOperand = '';
    this._operator = null;
    this._result = '';
    this._activeOperand = '';
    this._buttonType;

    this._resultField = document.querySelector('#result-field');

    // All available operators
    this._allOperators = {
      '+': function _(a, b) {
        return a + b;
      },
      '-': function _(a, b) {
        return a - b;
      },
      '*': function _(a, b) {
        return a * b;
      },
      '/': function _(a, b) {
        return a / b;
      }
    };

    // Buttons event listener
    this.elem.addEventListener('click', (function (e) {
      if (e.target.tagName === 'BUTTON') {
        this._handleButtonsClick(e);
      }
    }).bind(this));

    // Result by default
    this._showResult(0);
  }

  // Handle button's click

  _createClass(Calc, [{
    key: '_handleButtonsClick',
    value: function _handleButtonsClick(e) {
      var dataset = e.target.dataset;

      // Find out button's type
      if (dataset.digit) {
        this._buttonType = 'digit';
      } else if (dataset.decimalPoint) {
        this._buttonType = 'point';
      } else if (dataset.operator) {
        this._buttonType = 'operator';
      } else if (dataset.back) {
        this._buttonType = 'back';
      } else if (dataset.result) {
        this._buttonType = 'result';
      }

      // Button's handler
      switch (this._buttonType) {
        case 'digit':
          this._handleOperand(dataset);
          break;
        case 'point':
          this._handlePoint();
          break;
        case 'operator':
          this._handleOperator(dataset);
          break;
        case 'back':
          this._handleBack();
          break;
        case 'result':
          this._handleResult();
          break;
        default:
          alert('Unknown button\'s type');
      }

      console.log({
        _storedOperand: this._storedOperand,
        _operator: this._operator,
        _activeOperand: this._activeOperand,
        _result: this._result
      });
    }

    // Handle operand

  }, {
    key: '_handleOperand',
    value: function _handleOperand(dataset) {
      this._activeOperand += dataset.digit;

      this._showResult(this._activeOperand);
    }

    // Handle operator

  }, {
    key: '_handleOperator',
    value: function _handleOperator(dataset) {
      // If operator takes one argument
      if (this._allOperators[dataset.operator].length === 1) {
        this._activeOperand = this._calcResult({
          firstOperator: this._activeOperand || this._storedOperand || this._result || 0,
          operator: dataset.operator
        });

        this._showResult(this._activeOperand);
      }

      // If operator takes two arguments
      if (this._allOperators[dataset.operator].length === 2) {
        if (this._storedOperand && this._activeOperand) {
          this._activeOperand = this._calcResult({
            firstOperator: this._storedOperand || 0,
            secondOperator: this._activeOperand || 0,
            operator: this._operator
          });
        }

        if (this._activeOperand || this._result) {
          this._storedOperand = this._activeOperand || this._result;
          this._activeOperand = '';
          this._result = '';
        }

        this._operator = dataset.operator;

        this._showResult(this._storedOperand);
      }
    }

    // Handle decimal point

  }, {
    key: '_handlePoint',
    value: function _handlePoint() {
      this._activeOperand += '.';
    }

    // Handle backspace button

  }, {
    key: '_handleBack',
    value: function _handleBack() {
      this._activeOperand = this._activeOperand.slice(0, -1);

      this._showResult(this._activeOperand);
    }

    // Calculation result

  }, {
    key: '_calcResult',
    value: function _calcResult(obj) {
      return this._allOperators[obj.operator](parseFloat(obj.firstOperator), parseFloat(obj.secondOperator));
    }

    // Result button handler

  }, {
    key: '_handleResult',
    value: function _handleResult() {
      if (this._storedOperand && this._activeOperand) {
        this._result = this._calcResult({
          firstOperator: this._storedOperand || 0,
          secondOperator: this._activeOperand || 0,
          operator: this._operator
        });
        this._activeOperand = '';
        this._storedOperand = '';
        this._operator = '';

        this._showResult(this._result);
      }
    }

    // Show result

  }, {
    key: '_showResult',
    value: function _showResult(value) {
      this._resultField.value = value;
    }

    // Add custom operator

  }, {
    key: 'addOperator',
    value: function addOperator(name, func) {
      this._allOperators[name] = func;
    }
  }]);

  return Calc;
})();

var calcEl = document.querySelector('#calc'),
    customButton = document.querySelector('#customButton');

var calc = new Calc({
  elem: calcEl
});

// You can add your own operators
calc.addOperator(customButton.getAttribute('data-operator'), function (a) {
  return 1 / a;
});