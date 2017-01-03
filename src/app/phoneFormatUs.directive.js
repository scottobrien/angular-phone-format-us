(function () {
  angular.module('app')
    .directive('phoneFormatUs', ['$log', '$timeout', function ($log, $timeout) {
      return {
        restrict: 'AE',
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
          var numExp = /^\d+$/;
          var delKeys = null;
          var stringValue = null;

          function getResult() {
            var numberLength = ctrl.$modelValue.replace(/[^0-9]/gi, "").length;
            var lengthResult = (numberLength >= 10);
            return lengthResult;
          }

          function formatPhoneNumber(num) {
            var s2 = String(num).replace(/\D/g, '');
            var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
            return (typeof m === angular.isUndefined || m === null) ? null : '(' + m[1] + ') ' + m[2] + '-' + m[3];
          }

          elem[0].onblur = function () {
            if (ctrl.$modelValue) {
              ctrl.$setValidity('minLength', getResult());
              scope.$apply();
            }
          };

          elem[0].onkeydown = function ($event) {
            delKeys = false;
            if ($event.key === "Backspace" || $event.which === 8) {
              delKeys = true;
            }
          };

          scope.$watch(attrs.ngModel, function (newValue, oldValue) {
            if (angular.isUndefined(newValue)) {
              return;
            }
            if (delKeys) {
              stringValue = newValue;
              stringValue = stringValue.replace(/[- )(]/g, '');
              $timeout(function () {
                ctrl.$setViewValue(stringValue);
                ctrl.$render();
              });
            }
            if (!numExp.test(newValue) && !delKeys && !formatPhoneNumber(newValue)) {
              if (oldValue === '') {
                ctrl.$setViewValue();
              }
              $timeout(function () {
                ctrl.$setViewValue(oldValue);
                ctrl.$render();
              });
              delKeys = false;
            }
            if (formatPhoneNumber(newValue)) {
              $timeout(function () {
                ctrl.$setViewValue(formatPhoneNumber(newValue));
                ctrl.$render();
              });
            }
          });
        }
      };
    }]);
})();
