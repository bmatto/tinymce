/**
 * Conversions.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

import { Blob } from '@ephox/sand';
import { FileReader } from '@ephox/sand';
import { Uint8Array } from '@ephox/sand';
import { Window } from '@ephox/sand';
import { XMLHttpRequest } from '@ephox/sand';
import Promise from '../util/Promise';

/**
 * Converts blob/uris back and forth.
 *
 * @private
 * @class tinymce.file.Conversions
 */

var blobUriToBlob = function (url) {
  return new Promise(function (resolve, reject) {

    var rejectWithError = function () {
      reject("Cannot convert " + url + " to Blob. Resource might not exist or is inaccessible.");
    };

    try {
      var xhr = new XMLHttpRequest();

      xhr.open('GET', url, true);
      xhr.responseType = 'blob';

      xhr.onload = function () {
        if (this.status == 200) {
          resolve(this.response);
        } else {
          // IE11 makes it into onload but responds with status 500
          rejectWithError();
        }
      };

      // Chrome fires an error event instead of the exception
      // Also there seems to be no way to intercept the message that is logged to the console
      xhr.onerror = rejectWithError;

      xhr.send();
    } catch (ex) {
      rejectWithError();
    }
  });
};

var parseDataUri = function (uri) {
  var type, matches;

  uri = decodeURIComponent(uri).split(',');

  matches = /data:([^;]+)/.exec(uri[0]);
  if (matches) {
    type = matches[1];
  }

  return {
    type: type,
    data: uri[1]
  };
};

var dataUriToBlob = function (uri) {
  return new Promise(function (resolve) {
    var str, arr, i;

    uri = parseDataUri(uri);

    // Might throw error if data isn't proper base64
    try {
      str = Window.atob(uri.data);
    } catch (e) {
      resolve(new Blob([]));
      return;
    }

    arr = new Uint8Array(str.length);

    for (i = 0; i < arr.length; i++) {
      arr[i] = str.charCodeAt(i);
    }

    resolve(new Blob([arr], { type: uri.type }));
  });
};

var uriToBlob = function (url) {
  if (url.indexOf('blob:') === 0) {
    return blobUriToBlob(url);
  }

  if (url.indexOf('data:') === 0) {
    return dataUriToBlob(url);
  }

  return null;
};

var blobToDataUri = function (blob) {
  return new Promise(function (resolve) {
    var reader = new FileReader();

    reader.onloadend = function () {
      resolve(reader.result);
    };

    reader.readAsDataURL(blob);
  });
};

export default {
  uriToBlob: uriToBlob,
  blobToDataUri: blobToDataUri,
  parseDataUri: parseDataUri
};