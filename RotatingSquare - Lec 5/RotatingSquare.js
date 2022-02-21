var gl;
var shaderProgramSquare;
var theta;
var keepRunning = true;
var mouseCoordUniform;
var clipx = 0.0;
var clipy = 0.0;

function init() {
    theta = 0.0;
    // Set up the canvas
    var canvas=document.getElementById("gl-canvas");
    gl=WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert( "WebGL is not available" ); }
    
    // Set up the viewport
    gl.viewport( 0, 0, canvas.width, canvas.height );   // x, y, width, height
    
    
    // Set up the background color
    gl.clearColor( 1.0, 0.0, 0.0, 1.0 );
    
    
    shaderProgramSquare = initShaders( gl, "vertex-shader-square",
                                      "fragment-shader-square" );
    gl.useProgram( shaderProgramSquare );
    mouseCoordUniform = gl.getUniformLocation( shaderProgramSquare, "mouseCoords" );
    gl.uniform2f(mouseCoordUniform, 0.0, 0.0);
    
    
    setupSquare();
    
    render();
}

function setupSquare() {
    
    // Enter array set up code here
    var p0 = vec2( .2, .2 );
    var p1 = vec2( -.2, .2 );
    var p2 = vec2( -.2, -.2 );
    var p3 = vec2( .2, -.2 );
    var arrayOfPoints = [p0, p1, p2, p3];
    
    // Create a buffer on the graphics card,
    // and send array to the buffer for use
    // in the shaders
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(arrayOfPoints), gl.STATIC_DRAW );
    
    // Create a pointer that iterates over the
    // array of points in the shader code
    var myPositionAttribute = gl.getAttribLocation( shaderProgramSquare, "myPosition" );
    gl.vertexAttribPointer( myPositionAttribute, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myPositionAttribute );    
}

function render() {
    if (keepRunning){
        // Force the WebGL context to clear the color buffer
        var thetaUniform = gl.getUniformLocation( shaderProgramSquare, "theta" );
        gl.uniform1f(thetaUniform, theta);
        gl.clear( gl.COLOR_BUFFER_BIT );
        gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
        theta += .01;
    }
    window.requestAnimationFrame(render);
}

function stopOrStartAnim(){
    keepRunning = !keepRunning;
}

function moveSquare(event){
    var canvas = document.getElementById("gl-canvas");
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = rect.height - (event.clientY - rect.top);

    clipx = 2.0*x/rect.width - 1;
    clipy = 2.0*y/rect.height - 1;
    gl.uniform2f(mouseCoordUniform, clipx, clipy);
}

function moveSquareKeys(event){
    var theKeyCode = event.keyCode;
    var offset = .03;
    if (theKeyCode == 65){
        clipx -= offset;
    }
    if (theKeyCode == 68){
        clipx += offset;
    }
    if (theKeyCode == 83){
        clipy -= offset;
    }
    if (theKeyCode == 87){
        clipy += offset;
    }

    gl.uniform2f(mouseCoordUniform, clipx, clipy);
}