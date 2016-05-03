# getFaces
face recognition -- get faces position from canvas or image or video.

##GetFaces 

### 1、type
`function`

### 2、arguments: 

```javascript
videoOrImageOrCanvas: video/image/canvas对象
option: {
    interval: 4,
    minNeighbors: 1,
    grayscale: false,
    confidence: null,
};
successCallback: 成功回调;
errorCallback: 失败回调;
```

### 3、call

```javascript
GetFaces(canvas,{//options
	interval:     4,
    minNeighbors: 1,
    grayscale:    false,
    confidence:   null
},function(faces){//成功回调
	var n = faces.length;
	for (var i = 0; i < n; ++i) {
		context.save()
        context.lineWidth = 1;
		context.strokeStyle = "red";
		context.strokeRect(faces[i].x-20,faces[i].y-20,faces[i].width+40,faces[i].height+40);
		context.restore()
    }
},function(err){//失败回调
	console.log(err)
})
```

### 3、演示地址
[演示地址](https://coderwin.github.io/getFaces/)
