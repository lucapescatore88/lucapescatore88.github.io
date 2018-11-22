
// Generic routines

    function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }

    function isPowerOf2(value) {
        return (value & (value - 1)) == 0;
    };


//Main  WebGL setup

    var gl;
    var curShaderProgram;
    var textures = {};
    
    var mvMatrix = mat4.create();
    var mvMatrixStack = [];
    var pMatrix = mat4.create();
    
    var mouseDown = false;
    var lastMouseX = null;
    var lastMouseY = null;
    var currentlyPressedKeys = {};
    
    function loadShaders(base,type,light) {
        $.ajaxSetup({async: false});
        var name = type+"-"+light;
        
        var scriptv = document.createElement('script');
		scriptv.type = 'x-shader/x-vertex';
		scriptv.id = "shader-v-"+name;    		
		var scriptf = document.createElement('script');
		scriptf.type = 'x-shader/x-fragment';
		scriptf.id = "shader-f-"+name;    

		document.getElementsByTagName('head')[0].appendChild(scriptv);
		document.getElementsByTagName('head')[0].appendChild(scriptf);
        
        $( "#shader-v-"+name ).load( "../assets/shaders/shader-v-"+name+".html" );
        $( "#shader-f-"+name ).load( "../assets/shaders/shader-f-"+name+".html" );
        $.ajaxSetup({async: true});
    }

    function getGL(){
        return gl;
    }

    function initGL(canvas) {
        try {
            gl = canvas.getContext("experimental-webgl");
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        } catch (e) {}
        if (!gl) {
            alert("Could not initialise WebGL, sorry :-(");
        }
        
        return gl;
    }


    function getShader(gl,id) {

        
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) { str += k.textContent; }
            k = k.nextSibling;
        }
        
        var shader;
        /*
        var str2 = $.ajax({
            type: "GET",
            url: '../assets/shaders/'+id+'.html',
            dataType: 'text',
            async: false,
            success: function(){
                
                if (id.indexOf("-f-")>-1) {
                    console.log("fragment")
                   shader = gl.createShader(gl.FRAGMENT_SHADER);
                } else if (id.indexOf("-v-")>-1) {
                    shader = gl.createShader(gl.VERTEX_SHADER);
                } else {
                    return null;
                }
                
                gl.shaderSource(shader, str);
                gl.compileShader(shader);
                }
            }).responseText;
        */
        
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }
        
        gl.shaderSource(shader, str);
        gl.compileShader(shader);
        
        console.log(id + " LOADED");
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }
    
       


    function tick() {
        requestAnimFrame(tick);
        if (typeof handleKeys === "function") { handleKeys(); }
        drawScene();
        animate();
    }
    
    
    

	function createShaderProgram(type, light, lighton) {
        
        if(type===undefined)    { type = "textcol"; }
        if(light===undefined)   { light = "per_frag_light"; }
        if(lighton===undefined) { lighton = false; }
        
        var shaderProgram = null;
        
        var fragmentShader = getShader(gl, "shader-f-"+type+"-"+light);
        var vertexShader = getShader(gl, "shader-v-"+type+"-"+light);
        
        while (!shaderProgram) {
            shaderProgram = gl.createProgram();
            console.log(shaderProgram)
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);
        }
        
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders"); }
        
        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        if(lighton)
        {
            shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
            gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

            shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
        
            shaderProgram.useAmbientLighting = gl.getUniformLocation(shaderProgram, "uUseAmbientLight");        
            shaderProgram.useDirectLighting = gl.getUniformLocation(shaderProgram, "uUseDirectLight");
            shaderProgram.usePointLighting = gl.getUniformLocation(shaderProgram, "uUsePointLight");
            shaderProgram.useSpecularLighting = gl.getUniformLocation(shaderProgram, "uUseSpecLight");
            shaderProgram.useEmissiveLighting = gl.getUniformLocation(shaderProgram, "uUseEmissiveLight");
        
            shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
            shaderProgram.lightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uDirectLightingDirection");
            shaderProgram.directionalColorUniform = gl.getUniformLocation(shaderProgram, "uDirectLightingColor");
            shaderProgram.pointPositionUniform = gl.getUniformLocation(shaderProgram, "uPointLightingLocation");
            shaderProgram.pointColorUniform = gl.getUniformLocation(shaderProgram, "uPointLightingColor");
            shaderProgram.shineUniform = gl.getUniformLocation(shaderProgram, "uMaterialShine");
            
            shaderProgram.useBlending = gl.getUniformLocation(shaderProgram, "useBlending");
            shaderProgram.alphaUniform = gl.getUniformLocation(shaderProgram, "uAlpha");
            
            shaderProgram.emissivityUniform = gl.getUniformLocation(shaderProgram, "uEmissivity");
        }

        if(type == "col" || type == "textcol") {
            shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
            gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
        }
        if(type == "text" || type == "textcol") {
            shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
            gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

            shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
        }
        shaderProgram.useModeUniform = gl.getUniformLocation(shaderProgram, "uMode");
        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
        
        if(light == "image" || light == "processing") {
            shaderProgram.kernelUniform = gl.getUniformLocation(shaderProgram, "uKernel[0]");
            shaderProgram.resolutionUniform = gl.getUniformLocation(shaderProgram, "uResolution");
            shaderProgram.textureSizeUniform = gl.getUniformLocation(shaderProgram, "uTextureSize");
        }
        
        console.log("Shader program initialized");
        return shaderProgram;
    }

	
	function setMatrixUniforms() {
        gl.uniformMatrix4fv(curShaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(curShaderProgram.mvMatrixUniform, false, mvMatrix);
        
        var normalMatrix = mat3.create();
        mat4.toInverseMat3(mvMatrix, normalMatrix);
        mat3.transpose(normalMatrix);
        gl.uniformMatrix3fv(curShaderProgram.nMatrixUniform, false, normalMatrix);
    }



// Movement and position matrices

    function mvPushMatrix() {
        var copy = mat4.create();
        mat4.set(mvMatrix, copy);
        mvMatrixStack.push(copy);
    }

    function mvPopMatrix() {
        if (mvMatrixStack.length == 0) {
            throw "Invalid popMatrix!";
        }
        mvMatrix = mvMatrixStack.pop();
    }


// Loading textures

    function setupTextureFilteringAndMips(width, height) {
        if (isPowerOf2(width) && isPowerOf2(height) ) {
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
    }

    function handleLoadedTexture(texture) {
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);

        setupTextureFilteringAndMips(texture.image.width, texture.image.height);
        
        gl.bindTexture(gl.TEXTURE_2D, null);
    }


    function initTexture(nameText,nameFile) {
        var text = gl.createTexture();
        text.image = new Image();
        text.image.onload = function () {
            handleLoadedTexture(text);
            textures[nameText] = text;
            return text;
        }
        text.image.src = nameFile;
    }
    
    
    function initTextureFramebuffer() {
        rttFramebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, rttFramebuffer);
        rttFramebuffer.width = 512;
        rttFramebuffer.height = 512;
            
        rttTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, rttTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, rttFramebuffer.width, rttFramebuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        var renderbuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, rttFramebuffer.width, rttFramebuffer.height);

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, rttTexture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
        
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        
        return [rttTexture, rttFramebuffer];
    };


    
    function textToTexture(text,textCanvas,color,size,font,bkg,stroke) {
    
        if(color === undefined)  { color = 'green'; }
        if(size === undefined)   { size = '65'; }
        if(font === undefined)   { font = 'Verdana'; }
        if(bkg === undefined)    { bkg = 'blue'; }
        if(stroke === undefined) { stroke = 'black'; }
    
        var ctx = textCanvas.getContext('2d');  
    
        ctx.beginPath();
        if(bkg!="")
        {
            ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);            
            ctx.fillStyle = bkg;
            ctx.fill();
            ctx.save();
        }
        ctx.fillStyle = color;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center'; 
        
        var mysize = size;
        ctx.font = mysize+'px '+font;
        var textWidth = ctx.measureText(text).width;
        while(textWidth > ctx.canvas.width) { 
        	mysize = mysize / 2.; 
        	ctx.font = mysize+'px '+font;
        	textWidth = ctx.measureText(text).width;
        };
        
        ctx.strokeStyle = stroke;
        ctx.fillText(text, textCanvas.width/2, textCanvas.height/2);      
        ctx.strokeText(text, textCanvas.width/2, textCanvas.height/2);
        ctx.restore();  

        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
        setupTextureFilteringAndMips(ctx.canvas.width, ctx.canvas.height);
        gl.bindTexture(gl.TEXTURE_2D, null);

        return texture;
    }
    
    

///// Keybord and mouse


    var curpos = [0,0,0];
    var lastMouse = [null,null];
    var rotationMatrix = mat4.create();
    mat4.identity(rotationMatrix);

    var xRot = 0;
    var xSpeed = 0;

    var yRot = 0;
    var ySpeed = 0;

    var speed = 0;

    function handleKeyDown(event) {
        currentlyPressedKeys[event.keyCode] = true;
    }

    function handleKeyUp(event) {
        currentlyPressedKeys[event.keyCode] = false;
    }

    function handleMouseDown(event) {
        mouseDown = true;
        lastMouse = [ event.clientX, event.clientY ];
    }

    function handleMouseUp(event) {
        mouseDown = false;
    }

    function handleMouseMoveRotate(event) {
        if (!mouseDown) {
            return;
        }
        var newX = event.clientX;
        var newY = event.clientY;

        var deltaX = newX - lastMouse[0];
        var newRotationMatrix = mat4.create();
        mat4.identity(newRotationMatrix);
        mat4.rotate(newRotationMatrix, degToRad(deltaX / 10), [0, 1, 0]);

        var deltaY = newY - lastMouse[1];
        mat4.rotate(newRotationMatrix, degToRad(deltaY / 10), [1, 0, 0]);

        mat4.multiply(newRotationMatrix, rotationMatrix, rotationMatrix);

        lastMouse = [ newX, newY ];
    };

  
    function handleMouseMoveTranslate(event) {
        if (!mouseDown) {
            return;
        }
        var curx = curpos[0];
        var cury = curpos[1];
  
        var height = canvas.height;
        var newX = event.clientX;
        var newY = event.clientY;
        var factor = 5./height;
        var dx = factor * (newX - lastMouse[0]);
        var dy = factor * (newY - lastMouse[1]);

        curpos[0] += dx;
        curpos[1] -= dy;
    
        lastMouse = [ newX, newY ];
    };
    
    
    function zoomRotate () {
        if (currentlyPressedKeys[65]) {
            // A
            curpos[2] -= 0.05;
        }
        if (currentlyPressedKeys[68]) {
            //D
            curpos[2] += 0.05;
        }
        if (currentlyPressedKeys[37]) {
            // Left cursor key
            ySpeed -= 1;
        }
        if (currentlyPressedKeys[39]) {
            // Right cursor key
            ySpeed += 1;
        }
        if (currentlyPressedKeys[38]) {
            // Up cursor key
            xSpeed -= 1;
        }
        if (currentlyPressedKeys[40]) {
            // Down cursor key
            xSpeed += 1;
        }
    }
    
    
    function zoomTranslate () {
        if (currentlyPressedKeys[65]) {
            // A
            curpos[2] -= 0.05;
        }
        if (currentlyPressedKeys[68]) {
            //D
            curpos[2] += 0.05;
        }
        if (currentlyPressedKeys[37]) {
            // Left cursor key
            curpos[0] -= 0.05;
        }
        if (currentlyPressedKeys[39]) {
            // Right cursor key
            curpos[0] += 0.05;
        }
        if (currentlyPressedKeys[38]) {
            // Up cursor key
            curpos[1] += 0.05;
        }
        if (currentlyPressedKeys[40]) {
            // Down cursor key
            curpos[1] -= 0.05;
        }
    }
    
    function camera () {
        if (currentlyPressedKeys[40]) {
            // W
            speed = -0.004;
        }
        else if (currentlyPressedKeys[38]) {
            //S
            speed = 0.004;
        }
        else {
            speed = 0;
        }

        if (currentlyPressedKeys[37]) {
            // Left cursor key
            ySpeed = 0.1;
        }
        else if (currentlyPressedKeys[39]) {
            // Right cursor key
            ySpeed = -0.1; 
        }
        else {
            ySpeed = 0;
        }
        
        if (currentlyPressedKeys[83]) {
            // Up cursor key
            xSpeed = -0.1;
        }
        else if (currentlyPressedKeys[87]) {
            // Down cursor key
            xSpeed = 0.1;
        }
        else {
             xSpeed = 0;           
        }
    }  
    
    var joggingAngle = 0;

    function jog(elapsed) {
            
        if (speed != 0) {
            curpos[0] -= Math.sin(degToRad(yRot)) * speed * elapsed;
            curpos[2] -= Math.cos(degToRad(yRot)) * speed * elapsed;

            joggingAngle += elapsed * 0.6;
            curpos[1] = Math.sin(degToRad(joggingAngle)) / 20. + 0.4;
        }

        xRot += xSpeed * elapsed;
        yRot += ySpeed * elapsed;
    }


//// 2D images rendering (and processing)

    normal_kernel = [
      0, 0, 0,
      0, 1, 0,
      0, 0, 0
    ]

function renderImage(canvas,image) {

    gl = canvas.getContext("experimental-webgl");

	loadShaders("../assets/shaders/","text","processing");
    var program = createShaderProgram("text","processing");
    gl.useProgram(program);

    kernelUniform = gl.getUniformLocation(program, "uKernel[0]");
  
    // provide texture coordinates for the rectangle.
    var texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0.0,  0.0,
        1.0,  0.0,
        0.0,  1.0,
        0.0,  1.0,
        1.0,  0.0,
        1.0,  1.0  ]
    /* Vertically flipped
      1.0,  1.0,
      0.0,  1.0,
      1.0,  0.0,
      1.0,  0.0,
      0.0,  1.0,
      0.0,  0.0]*/
      ), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(program.textureCoordAttribute);
    gl.vertexAttribPointer(program.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

    // Create a texture.
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(program.samplerUniform, 0);

    var resolutionUniform = gl.getUniformLocation(program, "uResolution");
    var textureSizeUniform = gl.getUniformLocation(program, "uTextureSize");
    
    gl.uniform2f(program.resolutionUniform, canvas.width, canvas.height);
    gl.uniform2f(program.textureSizeUniform, image.width, image.height);
    
    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // Upload the image into the texture.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  
    // Create a buffer and put a single clipspace rectangle
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    var pos = setRectangle( gl, 0, 0, image.width, image.height);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(program.vertexPositionAttribute);
    gl.vertexAttribPointer(program.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);
  
    gl.uniform1fv(program.kernelUniform, normal_kernel);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function setRectangle(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
 
    return [
     x1, y1,
     x2, y1,
     x1, y2,
     x1, y2,
     x2, y1,
     x2, y2];
}

function drawWithKernel(name) {
    // set the kernel
    gl.uniform1fv(kernelUniform, kernels[name]);

    // Draw the rectangle.
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }





/*
var getDepth = function(cameraPosition, cameraRotation, objectPosition) {
	var p0 = cameraPosition[0], p1 = cameraPosition[1], p2 = cameraPosition[2],
	q0 = cameraRotation[0], q1 = cameraRotation[1], q2 = cameraRotation[2], q3 = cameraRotation[3],
	l0 = objectPosition[0], l1 = objectPosition[1], l2 = objectPosition[2];
	return 2*(q1*q3 + q0*q2)*(l0 - p0) + 2*(q2*q3 - q0*q1)*(l1 - p1) + (1 - 2*q1*q1 - 2*q2*q2)*(l2 - p2);
}

// Assumes:
// Objects have a property "id"
// There is an object "depths", and an array "alphaRenderObjects" in scope 
// That latter has been cleared prior to sorting for a new frame
var addToAlphaList = function(object, depth) {
	depths[object.id] = depth;
	// Binary search
	var less, more, itteration = 1, inserted = false, index = Math.floor(alphaRenderObjects.length/2);
	while(!inserted) {
		less = (index === 0 || depths[alphaRenderObjects[index-1].id] <= depth);
		more = (index >= alphaRenderObjects.length || depths[alphaRenderObjects[index].id] >= depth);
		if(less && more) {
			alphaRenderObjects.splice(index, 0, object);
			inserted = true;
		} else {
			itteration++;
			var step = Math.ceil(alphaRenderObjects.length/(2*itteration));
			if(!less) {
				index -= step;
			} else {
				index += step;
			}
		}
	}
};

var renderObjects = { keys: [] }; 	// A object of render objects w/ keys 
// object for quick look up and an array "keys" of the ids for quick enumeration 
// c.f. http://jsperf.com/reflection-vs-array-of-keys
var alphaRenderObjects = [];		// A sorted list
var gl;					// WebGL Context

// Ommitted: all your other rendering and set up code ;D

var render = function(camera) {	
	// Ommitted: Camera / pMatrix set up

	alphaRenderObjects.length = 0;
	
	clear();
	
	for(var i = 0, l = renderObjects.keys.length; i < l; i++) {
		var renderObject = renderObjects[renderObjects.keys[i]];
		if(renderObject.material.alpha) {
			addToAlphaList(renderObject, getDepth(
				camera.position, 
				camera.rotation, 
				renderObject.position));
		} else {
			bindAndDraw(renderObject);
		}
	}
	for(i = 0, l = alphaRenderObjects.length; i < l; i++) {
		var renderObject = alphaRenderObjects[i];
		enableBlending(
			renderObject.material.sourceBlendType, 
			renderObject.material.destinationBlendType, 
			renderObject.material.blendEquation);
		bindAndDraw(renderObject);
	}
	disableBlending();
};

var enableBlending = function(sourceBlend, destinationBlend, equation) {
	if(equation) {
		gl.blendEquation(gl[equation]);
	}
	if(sourceBlend && destinationBlend) {
		gl.blendFunc(gl[sourceBlend], gl[destinationBlend]);
	}
	gl.enable(gl.BLEND);
	gl.depthMask(false);
};

var disableBlending = function() {
	gl.disable(gl.BLEND);
	gl.depthMask(true);
};

var clear = function() {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

var getDepth = function(cameraPosition, cameraRotation, objectPosition) {
	// Ommitted: previously covered code
}

var addToAlphaList = function(object, depth) {
	// Ommitted: previously covered code	
};

var bindAndDraw = function(renderObject) {
	// Ommitted : Code which binds uniforms, textures etc as necessary and calls relevant gl draw function	
};
*/

    