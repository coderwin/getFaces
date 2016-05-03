window.onload = function(){

navigator.getUserMedia = navigator.webkitGetUserMedia||navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

var GetFaces = require("../getfaces.js");

var video = document.getElementById("video");
if (navigator.getUserMedia) {
    navigator.getUserMedia({video: true}, function successCallback(stream) {
    // Set the source of the video element with the stream from the camera
    if (video.mozSrcObject !== undefined) {
        video.mozSrcObject = stream;
    } else {
        video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
    }
    video.play();
}, function errorCallback(error) {
    console.error('Unable to get webcam stream.');
});
} else {
    console.error('Native web camera streaming (getUserMedia) not supported in this browser.');
}

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var faces;
video.addEventListener("loadeddata", function(){
	canvas.width = 300;
	canvas.height = 225;
	setInterval(function(){
		context.drawImage(video, 0, 0, canvas.width, canvas.height);
		faces = GetFaces(canvas,{
			interval:     4,
	        minNeighbors: 1,
	        grayscale:    false,
	        confidence:   null
		},function(faces){
			var n = faces.length;
			for (var i = 0; i < n; ++i) {
				context.save()
	            context.lineWidth = 1;
				context.strokeStyle = "red";
				context.strokeRect(faces[i].x-20,faces[i].y-20,faces[i].width+40,faces[i].height+40);
				context.restore()
	        }
		},function(err){
			console.log(err)
		})
	},20)
})

var getCanvas = document.getElementById("getCanvas");
getCanvas.addEventListener("click",function(){
	var offImage = document.getElementById("offImage");
	var img = canvas.toDataURL("image/png");
	offImage.src = img;
	offImage.onload = function(){
		if (!faces.length) return
		var face = faces[0];
		var offCanvas = document.getElementById("offCanvas");
		var offContext = offCanvas.getContext("2d");
		offContext.clearRect(0,0,300,225);
		offContext.drawImage(offImage, face.x-18,face.y-18,face.width+36,face.height+36,0,0,face.width+36,face.height+36)
		var image = offCanvas.toDataURL("image/png");
		document.getElementById("image").src = image;
	};

},false);

};