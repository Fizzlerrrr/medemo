// * Emotioncam - A near real time emotion detecter using webcam.
// * @author Rongjia Liu
// * @version v0.1

		function take_snapshot() {
			Webcam.snap( function(data_uri) {
                document.querySelector("#c").src = data_uri;
			} );
		}
        
        function auto_snap() {
			snap_emo()
			setInterval( snap_emo, 1000 );
		}

        function snap_emo()
    {
        take_snapshot()
        emo();
    }
        
        makeblob = function (dataURL) {
            var BASE64_MARKER = ';base64,';
            if (dataURL.indexOf(BASE64_MARKER) == -1) {
                var parts = dataURL.split(',');
                var contentType = parts[0].split(':')[1];
                var raw = decodeURIComponent(parts[1]);
                return new Blob([raw], { type: contentType });
            }
            var parts = dataURL.split(BASE64_MARKER);
            var contentType = parts[0].split(':')[1];
            var raw = window.atob(parts[1]);
            var rawLength = raw.length;
            var uInt8Array = new Uint8Array(rawLength);

            for (var i = 0; i < rawLength; ++i) {
                uInt8Array[i] = raw.charCodeAt(i);
            }
            return new Blob([uInt8Array], { type: contentType });
        },getURLParameter = (name) => {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
  },
        emo = function () {
        var uriBase = "https://westus.api.cognitive.microsoft.com/face/v1.0/detect";

        var params = {
            "returnFaceId": "true",
            "returnFaceLandmarks": "false",
            "returnFaceAttributes": "emotion"
        };
            $.ajax({
                url: uriBase + "?" + $.param(params),
                beforeSend: function (xhrObj) {
                    // Request headers
                    xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
                    xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "4624d91a654f46aaafd66a2bdc2f0bfa");
                }, 
                type: "POST",
                data: makeblob(document.getElementById("c").src),
                processData: false
            })
            .success(function (data, status) {
            
                console.log(JSON.stringify(data[0].faceAttributes.emotion.neutral));
                
                 $("#responseTextArea").val(JSON.stringify(data, null, 2));
            })
            .error(function (xhr, status, err) {
                debugger;
            });
        }