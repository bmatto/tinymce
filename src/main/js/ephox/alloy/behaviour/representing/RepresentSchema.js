define(
  'ephox.alloy.behaviour.representing.RepresentSchema',

  [
    'ephox.boulder.api.FieldSchema',
    'ephox.peanut.Fun',
    'ephox.scullion.Cell'
  ],

  function (FieldSchema, Fun, Cell) {
    return [
      FieldSchema.defaulted('onSet', Fun.identity),
      FieldSchema.strict('initialValue'),
      FieldSchema.optionObjOf('interactive', [
        FieldSchema.strict('event'),
        FieldSchema.strict('process')
      ]),
      FieldSchema.state('state', function () { return Cell(); })
    ];
  }
);