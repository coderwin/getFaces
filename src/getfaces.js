var cascade = require("./cascade.js");
var ccv = require("./ccv.js");
function GetFaces(videoOrImageOrCanvas, options, successCallback, errorCallback){
	if (!document.createElement('canvas').getContext) {
		errorCallback("Your browser does not support canvas!");
		return;
	}
	if (["img","canvas","video"].indexOf(videoOrImageOrCanvas.tagName.toLowerCase())==-1) {
		errorCallback("no videoOrImageOrCanvas or element not supported");
		return;
	}

	var starttime = new Date().getTime();
	var defaultOptions = {
		interval:     4,
        minNeighbors: 1,
        grayscale:    false,
        confidence:   null,
	};
	var mixin = function(a,b){
		for(var k in b){
			if (!b.hasOwnProperty(k)) continue;
			a[k] = b[k]
		}
		return a;
	};
	var imageToCanvas = function (image) {
	  	if (image.tagName.toLowerCase() == "img") {
		    var canvas = document.createElement("canvas");
		    document.body.appendChild(image);
		    canvas.width = image.offsetWidth;
		    canvas.style.width = image.offsetWidth.toString() + "px";
		    canvas.height = image.offsetHeight;
		    canvas.style.height = image.offsetHeight.toString() + "px";
		    document.body.removeChild(image);
		    var ctx = canvas.getContext("2d");
		    ctx.drawImage(image, 0, 0);
		    return canvas;
	  	}
	  	return image;
	};
	options = mixin(defaultOptions, options);

	var canvas,tagName = videoOrImageOrCanvas.tagName;
	if (tagName.toLowerCase()=="img") {
		canvas = imageToCanvas(videoOrImageOrCanvas);
	}else if (tagName.toLowerCase()=="video"||tagName.toLowerCase()=="canvas") {

        var copy = document.createElement('canvas');
        copy.setAttribute('width',  videoOrImageOrCanvas.videoWidth  || videoOrImageOrCanvas.width);
        copy.setAttribute('height', videoOrImageOrCanvas.videoHeight || videoOrImageOrCanvas.height);
        var context = copy.getContext("2d");
        context.drawImage(videoOrImageOrCanvas, 0, 0);

        canvas = copy;
	}
	if (options.grayscale) {
        canvas = ccv.grayscale(canvas);
    }

	var faces = ccv.detect_objects(canvas, cascade, options.interval, options.minNeighbors);

	var n = faces.length,
        faceDatas = [];

    for (var i = 0; i < n; ++i) {
        if (options.confidence !== null && faces[i].confidence <= options.confidence) {
            continue;
        }

        faces[i].w = faces[i].width;
        faces[i].h = faces[i].height;
        faceDatas.push(faces[i]);
    }
    var endtime = new Date().getTime();
    faceDatas.runTime = endtime-starttime;
    successCallback.call(null, faceDatas);
    return faceDatas;
}

module.exports = GetFaces;