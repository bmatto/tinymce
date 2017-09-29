asynctest(
  'InputTest',

  [
    'ephox.agar.api.ApproxStructure',
    'ephox.agar.api.Assertions',
    'ephox.agar.api.GeneralSteps',
    'ephox.agar.api.Logger',
    'ephox.agar.api.Step',
    'ephox.alloy.api.component.GuiFactory',
    'ephox.alloy.api.behaviour.Focusing',
    'ephox.alloy.api.behaviour.Representing',
    'ephox.alloy.api.ui.Input',
    'ephox.alloy.test.GuiSetup',
    'ephox.sand.api.PlatformDetection'
  ],

  function (ApproxStructure, Assertions, GeneralSteps, Logger, Step, GuiFactory, Focusing, Representing, Input, GuiSetup, PlatformDetection) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    var platform = PlatformDetection.detect();

    GuiSetup.setup(function (store, doc, body) {
      return GuiFactory.build(
        Input.sketch({
          placeholder: 'placeholder-text',
          data: 'initial-value',
          uid: 'test-input-id',
          inputClasses: [ 'extra-class' ]
        })
      );

    }, function (doc, body, gui, component, store) {
      var testStructure = Step.sync(function () {
        Assertions.assertStructure(
          'Checking initial structure of input',
          ApproxStructure.build(function (s, str, arr) {
            return s.element('input', {
              attrs: {
                type: str.is('input'),
                'data-alloy-id': str.is('test-input-id'),
                placeholder: str.is('placeholder-text')
              },
              classes: [
                arr.has('extra-class')
              ],
              value: str.is('initial-value')
            });
          }),
          component.element()
        );
      });

      var sCheckInputSelection = function (label, expected) {
        return Step.sync(function () {
          Assertions.assertEq(
            label + '\nChecking selectionStart',
            expected.start,
            component.element().dom().selectionStart
          );
          Assertions.assertEq(
            label + '\nChecking selectionEnd',
            expected.end,
            component.element().dom().selectionEnd
          );
        });
      };

      var defaultCursor = platform.browser.isChrome() || platform.browser.isSafari() ? 'Initial Value'.length : 0;

      var testFocus = Logger.t(
        'Testing input.focus selects text inside',
        GeneralSteps.sequence([
          sCheckInputSelection('before focus', { start: defaultCursor, end: defaultCursor }),
          Step.sync(function () {
            Focusing.focus(component);
          }),
          sCheckInputSelection('after focus', { start: 0, end: 'initial Value'.length })

        ])
      );

      var testRepresenting = Logger.t(
        'Checking that representing is working',
        Step.sync(function () {
          var data = Representing.getValue(component);
          Assertions.assertEq('Checking getValue', 'initial-value', data);
          Representing.setValue(component, 'v');
          var newData = Representing.getValue(component);
          Assertions.assertEq('Checking getValue after setValue', 'v', newData);
          Assertions.assertStructure(
            'Checking new structure of input',
            ApproxStructure.build(function (s, str, arr) {
              return s.element('input', {
                attrs: {
                  type: str.is('input'),
                  'data-alloy-id': str.is('test-input-id'),
                  placeholder: str.is('placeholder-text')
                },
                value: str.is('v')
              });
            }),
            component.element()
          );
        })

      );

      return [
        testStructure,
        testFocus,
        testRepresenting
      ];
    }, success, failure);



  }
);