define(
  'ephox.alloy.api.ui.SplitDropdown',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.api.behaviour.Composing',
    'ephox.alloy.api.behaviour.Coupling',
    'ephox.alloy.api.behaviour.Focusing',
    'ephox.alloy.api.behaviour.Highlighting',
    'ephox.alloy.api.behaviour.Keying',
    'ephox.alloy.api.behaviour.Toggling',
    'ephox.alloy.api.component.SketchBehaviours',
    'ephox.alloy.api.events.AlloyTriggers',
    'ephox.alloy.api.ui.Sketcher',
    'ephox.alloy.dropdown.DropdownUtils',
    'ephox.alloy.parts.AlloyParts',
    'ephox.alloy.ui.common.ButtonBase',
    'ephox.alloy.ui.schema.SplitDropdownSchema',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Merger',
    'ephox.katamari.api.Option'
  ],

  function (
    Behaviour, Composing, Coupling, Focusing, Highlighting, Keying, Toggling, SketchBehaviours, AlloyTriggers, Sketcher, DropdownUtils, AlloyParts, ButtonBase,
    SplitDropdownSchema, Fun, Merger, Option
  ) {
    var factory = function (detail, components, spec, externals) {

      var switchToMenu = function (sandbox) {
        Composing.getCurrent(sandbox).each(function (current) {
          Highlighting.highlightFirst(current);
          Keying.focusIn(current);
        });
      };

      var action = function (component) {
        var anchor = { anchor: 'hotspot', hotspot: component };
        var onOpenSync = switchToMenu;
        DropdownUtils.togglePopup(detail, anchor, component, externals, onOpenSync).get(Fun.noop);
      };

      var executeOnButton = function (comp) {
        var button = AlloyParts.getPartOrDie(comp, detail, 'button');
        AlloyTriggers.emitExecute(button);
        return Option.some(true);
      };

      var buttonEvents = ButtonBase.events(Option.some(action));

      return Merger.deepMerge(
        {
          uid: detail.uid(),
          dom: detail.dom(),
          components: components,
          eventOrder: {
            // Order, the button state is toggled first, so assumed !selected means close.
            'alloy.execute': [ 'toggling', 'alloy.base.behaviour' ]
          },

          events: buttonEvents,

          behaviours: Merger.deepMerge(
            Behaviour.derive([
              Coupling.config({
                others: {
                  sandbox: function (hotspot) {
                    var arrow = AlloyParts.getPartOrDie(hotspot, detail, 'arrow');
                    var extras = {
                      onOpen: function () {
                        Toggling.on(arrow);
                      },
                      onClose: function () {
                        Toggling.off(arrow);
                      }
                    };

                    return DropdownUtils.makeSandbox(detail, {
                      anchor: 'hotspot',
                      hotspot: hotspot
                    }, hotspot, extras);
                  }
                }
              }),
              Keying.config({
                mode: 'special',
                onSpace: executeOnButton,
                onEnter: executeOnButton,
                onDown: function (comp) {
                  action(comp);
                  return Option.some(true);
                }
              }),
              Focusing.config({ })
            ]),
            SketchBehaviours.get(detail.splitDropdownBehaviours())
          )
        },
        {
          dom: {
            attributes: {
              role: 'presentation'
            }
          }
        }
      );
    };

    return Sketcher.composite({
      name: 'SplitDropdown',
      configFields: SplitDropdownSchema.schema(),
      partFields: SplitDropdownSchema.parts(),
      factory: factory
    });
  }
);