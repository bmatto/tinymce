import { LegacyUnit } from '@ephox/mcagar';
import { Pipeline } from '@ephox/agar';
import DomParser from 'tinymce/core/html/DomParser';
import Serializer from 'tinymce/core/html/Serializer';
import Schema from 'tinymce/core/html/Schema';
import { UnitTest } from '@ephox/bedrock';

UnitTest.asynctest('browser.tinymce.core.html.SerializerTest', function() {
  var success = arguments[arguments.length - 2];
  var failure = arguments[arguments.length - 1];
  var suite = LegacyUnit.createSuite();

  suite.test('Basic serialization', function () {
    var serializer = Serializer();

    LegacyUnit.equal(serializer.serialize(DomParser().parse('text<text&')), 'text&lt;text&amp;');
    LegacyUnit.equal(
      serializer.serialize(DomParser().parse('<B>text</B><IMG src="1.gif">')),
      '<strong>text</strong><img src="1.gif" />'
    );
    LegacyUnit.equal(serializer.serialize(DomParser().parse('<!-- comment -->')), '<!-- comment -->');
    LegacyUnit.equal(serializer.serialize(DomParser().parse('<![CDATA[cdata]]>')), '<![CDATA[cdata]]>');
    LegacyUnit.equal(serializer.serialize(DomParser().parse('<?xml attr="value" ?>')), '<?xml attr="value" ?>');
    LegacyUnit.equal(serializer.serialize(DomParser().parse('<!DOCTYPE html>')), '<!DOCTYPE html>');
  });

  suite.test('Sorting of attributes', function () {
    var serializer = Serializer();

    LegacyUnit.equal(
      serializer.serialize(DomParser().parse('<b class="class" id="id">x</b>')),
      '<strong id="id" class="class">x</strong>'
    );
  });

  suite.test('Serialize with validate: true, when parsing with validate:false bug', function () {
    var schema = Schema({ valid_elements: 'b' });
    var serializer = Serializer({}, schema);

    LegacyUnit.equal(
      serializer.serialize(DomParser({ validate: false }, schema).parse('<b a="1" b="2">a</b><i a="1" b="2">b</i>')),
      '<b a="1" b="2">a</b><i a="1" b="2">b</i>'
    );
  });

  Pipeline.async({}, suite.toSteps({}), function () {
    success();
  }, failure);
});

