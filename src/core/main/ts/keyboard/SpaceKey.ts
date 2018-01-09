/**
 * SpaceKey.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

import InsertSpace from './InsertSpace';
import MatchKeys from './MatchKeys';
import VK from '../util/VK';

var executeKeydownOverride = function (editor, evt) {
  MatchKeys.execute([
    { keyCode: VK.SPACEBAR, action: MatchKeys.action(InsertSpace.insertAtSelection, editor) }
  ], evt).each(function (_) {
    evt.preventDefault();
  });
};

var setup = function (editor) {
  editor.on('keydown', function (evt) {
    if (evt.isDefaultPrevented() === false) {
      executeKeydownOverride(editor, evt);
    }
  });
};

export default {
  setup: setup
};