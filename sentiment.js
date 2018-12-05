var request = require('request');

var SPELL_CHECK_API_URL = 'https://api.cognitive.microsoft.com/bing/v7.0/spellcheck';
    SPELL_CHECK_API_KEY = '7a64bce67b9d40928ad3d956f0c25863';

exports.getCorrectedText = function (text) {
    return new Promise(
        function (resolve, reject) {
            if (text) {
                var requestData = {
                    url: SPELL_CHECK_API_URL,
                    headers: {
                        "Ocp-Apim-Subscription-Key": SPELL_CHECK_API_KEY
                    },
                    form: {
                        text: text
                    },
                    json: true
                }

                request.post(requestData, function (error, response, body) {
                    if (error) {
                        reject(error);
                    }
                    else if (response.statusCode != 200) {
                        reject(body);
                    }
                    else {
                        var previousOffset = 0;
                        var result = '';

                        for (var i = 0; i < body.flaggedTokens.length; i++) {
                            var element = body.flaggedTokens[i];

                            // Append the text from the previous offset to the current misspelled word offset
                            result += text.substring(previousOffset, element.offset);

                            // Append the corrected word instead of the misspelled word
                            result += element.suggestions[0].suggestion;

                            // Increment the offset by the length of the misspelled word
                            previousOffset = element.offset + element.token.length;
                        }

                        // Append the text after the last misspelled word.
                        if (previousOffset < text.length) {
                            result += text.substring(previousOffset);
                        }

                        resolve(result);
                    }

                });
            } else {
                resolve(text);
            }
        }
    )
}

'use strict';

let https = require ('https');
let accessKey = '2da990e859714a8eb2ead6284c1b2c6e';
let uri = 'westus.api.cognitive.microsoft.com';
let path = '/text/analytics/v2.0/sentiment';

let response_handler = function (response) {
    let body = '';
    response.on ('data', function (d) {
        body += d;
    });
    response.on ('end', function () {
        let body_ = JSON.parse (body);
        let body__ = JSON.stringify (body_, null, '  ');
        console.log (body__);
    });
    response.on ('error', function (e) {
        console.log ('Error: ' + e.message);
    });
};

let get_sentiments = function (documents) {
    let body = JSON.stringify (documents);

    let request_params = {
        method : 'POST',
        hostname : uri,
        path : path,
        headers : {
            'Ocp-Apim-Subscription-Key' : accessKey,
        }
    };

    let req = https.request (request_params, response_handler);
    req.write (body);
    req.end ();
}

let documents = { 'documents': [
    { 'id': '1', 'language': 'en', 'text': 'I really enjoy the new XBox One S. It has a clean look, it has 4K/HDR resolution and it is affordable.' },
    { 'id': '2', 'language': 'es', 'text': 'Este ha sido un dia terrible, llegué tarde al trabajo debido a un accidente automobilistico.' },
]};

get_sentiments (documents);