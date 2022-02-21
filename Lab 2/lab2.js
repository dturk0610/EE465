var gl, shaderProgram;

var theta;
var keepRunning = 1;
var invh, h;
var invw, w;

var divsForShape = 5;
var radOfShape = 100; // THIS IS IN CANVAS COORDS


var dir = vec2(1, 0); // current movement direction of shape
var dirOffset = vec2(0, 0);
var moveAmount = .003;

function init() {
    theta = 0.0;
    // Set up the canvas
    var canvas=document.getElementById("gl-canvas");
    gl=WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert( "WebGL is not available" ); }
    
    h = parseFloat(canvas.height); invh = 1.0/h;
    w = parseFloat(canvas.width); invw = 1.0/w;

    // Set up the viewport
    gl.viewport( 0, 0, w, h );   // x, y, width, height
    
    
    // Set up the background color
    gl.clearColor( 1.0, 0.0, 0.0, 1.0 );
    
    
    shaderProgram = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( shaderProgram );
    
    
    setupShape();
    
    render();
}

function setupShape() {
    
    var divsForShape = 5;
    var stepAmount = 2 * Math.PI / divsForShape;
    var points = [];
    for (var t = 0; t < 2 * Math.PI; t += stepAmount) {
        var px = radOfShape * Math.cos( t ) + h*.5;
        var py = radOfShape * Math.sin( t ) + w*.5;
        var point = convertCanvasPosToView(px, py);
        points.push( vec2(point[0], point[1] ));
    }

    // Create a buffer on the graphics card,
    // and send array to the buffer for use
    // in the shaders
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    
    // Create a pointer that iterates over the
    // array of points in the shader code
    var myPositionAttribute = gl.getAttribLocation( shaderProgram, "myPosition" );
    gl.vertexAttribPointer( myPositionAttribute, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myPositionAttribute );    
}

function render() {
    // Force the WebGL context to clear the color buffer
    var rotMatUniform = gl.getUniformLocation( shaderProgram, "rotMat");

    // by building the matrix like this, we actually preserve the essense of
    // building them natrually.
    var rotMatArr = mat3([Math.cos(theta), Math.sin(theta), dirOffset[0]],
                         [-Math.sin(theta), Math.cos(theta), dirOffset[1]],
                         [    0,               0,                1]);
    
    gl.uniformMatrix3fv( rotMatUniform, false, flatten(rotMatArr) );
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, divsForShape );

    dirOffset[0] += moveAmount * dir[0];
    dirOffset[1] += moveAmount * dir[1];
    theta += .01 * keepRunning;

    window.requestAnimationFrame(render);
}

function startRot(){ keepRunning = 1; }

function stopRot(){ keepRunning = 0; }

function increaseSpeed(){ moveAmount +=.003; }

function decreaseSpeed(){ if (moveAmount - .003 >= 0) moveAmount -=.003; }

function moveSquare(event){
    var canvas = document.getElementById("gl-canvas");
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = h - (event.clientY - rect.top);
    var clipx = 2.0*x*invw - 1;
    var clipy = 2.0*y*invh - 1;

    dirOffset = vec2(clipx, clipy);
}

function moveSquareKeys(event){
    var theKeyCode = event.keyCode;

    switch (theKeyCode){    
        case 65: dir = vec2(-1, 0); break;
        case 68: dir = vec2(1, 0); break;
        case 83: dir = vec2(0, -1); break;
        case 87: dir = vec2(0, 1); break;
        default: break;
    }
}

function convertCanvasPosToView( x, y ){ return vec2( (x*invw*2.0) - 1, (y*invh*2.0) - 1 ); }