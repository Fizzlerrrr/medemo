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
            $.ajax(
                {
                url: uriBase + "?" + $.param(params),
                beforeSend: function (xhrObj) {
                    // Request headers
                    xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
                    xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "c2d3e4eb31ca4b34ac962995f883c13b");
                }, 
                type: "POST",
                data: makeblob(document.getElementById("c").src),
                processData: false,
                
                success: function (data, status) {
                console.log(JSON.stringify(data[0].faceAttributes.emotion.neutral));
                    chart_emo(data);
                 $("#responseTextArea").val(JSON.stringify(data, null, 2));
            },
                error: function (xhr, status, err) {
                debugger;
            }
                }
            )
        }

chart_emo = function (data) {

var anger = JSON.stringify(data[0].faceAttributes.emotion.anger);
var contempt = JSON.stringify(data[0].faceAttributes.emotion.contempt);
var disgust = JSON.stringify(data[0].faceAttributes.emotion.disgust);
var fear = JSON.stringify(data[0].faceAttributes.emotion.fear);
var happiness = JSON.stringify(data[0].faceAttributes.emotion.happiness);
var neutral = JSON.stringify(data[0].faceAttributes.emotion.neutral);
var sadness = JSON.stringify(data[0].faceAttributes.emotion.sadness);
var surprise = JSON.stringify(data[0].faceAttributes.emotion.surprise);

var emo1 = parseFloat(anger);
var emo2 = parseFloat(contempt);
var emo3 = parseFloat(disgust);
var emo4 = parseFloat(fear);
var emo5 = parseFloat(happiness);
var emo6 = parseFloat(neutral);
var emo7 = parseFloat(sadness);
var emo8 = parseFloat(surprise);


    if ($('#websiteViewsChart').length != 0) {
 
        var dataWebsiteViewsChart = {
          labels: ['😡', '🤔', '🤢', '😱', '😃', '😐', '😥', '😲'],
          series: [
            [emo1, emo2, emo3, emo4, emo5, emo6, emo7, emo8]
  
          ]
        };
        var optionsWebsiteViewsChart = {
          axisX: {
            showGrid: false
          },
          low: 0,
          high: 1,
          chartPadding: {
            top: 0,
            right: 5,
            bottom: 0,
            left: 0
          }
        };
        var responsiveOptions = [
          ['screen and (max-width: 640px)', {
            seriesBarDistance: 5,
            axisX: {
              labelInterpolationFnc: function(value) {
                return value[0];
              }
            }
          }]
        ];
        var websiteViewsChart = Chartist.Bar('#websiteViewsChart', dataWebsiteViewsChart, optionsWebsiteViewsChart, responsiveOptions);
  
        // //start animation for the Emails Subscription Chart
        // md.startAnimationForBarChart(websiteViewsChart);
      }

}


