// Variables for GL.
var gl, shaderProgram;

// Variables used for rotation of the shape.
var theta = 0.0;
var keepRotating = 1;

// These are variables used to track the canvas dimensions.
var invh, h;
var invw, w;

// Easy to access variables for determining how many divisions
// for the shape there should be and the shape's canvas radius.
var divsForShape = 5;
var radOfShape = 100; // THIS IS IN CANVAS COORDS

// current direction of movement for shape, its offset from the
// middle of the view port, and the amount of displacement the
// shape would move next frame. As well as an easy to access
// increase and decrease speed by amount.
var dir = vec2(1, 0);
var dirOffset = vec2(0, 0);
var moveAmount = .003;
var speedChangeAmount = .003;

// Function called when the webpage is first loaded.
function init() {

    // Set up the canvas and webgl.
    var canvas=document.getElementById("gl-canvas");
    gl=WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert( "WebGL is not available" ); }
    
    // Get and calculate the useful canvas variables.
    h = parseFloat(canvas.height); invh = 1.0/h;
    w = parseFloat(canvas.width); invw = 1.0/w;

    // Calls the necessary setup functions to get GL setup
    // and its components. As well as gets all vertexes calculated
    // for the shape.
    setupGL();
    setupShape();
    
    // Requests to run render for the next frame.
    window.requestAnimationFrame(render);
}

// Basic setup GL function to assign the shader program and the
// background color and viewport size.
function setupGL(){

    // Set up the viewport and background color.
    gl.viewport( 0, 0, w, h );
    gl.clearColor( 1.0, 0.0, 0.0, 1.0 );

    // Assigns the shader program that is going to be used.
    shaderProgram = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( shaderProgram );
}

// This function calculates all points for the shape and sends those
// points to the buffer in GL.
function setupShape() {
    
    // Builds the desired equalateral shape like a cube or pentagon.
    var stepAmount = 2 * Math.PI / divsForShape;
    var points = [];
    for (var t = 0; t < 2 * Math.PI; t += stepAmount) {
        var px = radOfShape * Math.cos( t ) + h*.5;
        var py = radOfShape * Math.sin( t ) + w*.5;
        var point = convertCanvasPosToView(px, py);
        points.push( vec2(point[0], point[1] ));
    }

    // Creates the buffer and sends the shapes points to GL in said buffer.
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    
    // Create a pointer that iterates over the
    // array of points in the shader code
    var myPositionAttribute = gl.getAttribLocation( shaderProgram, "myPosition" );
    gl.vertexAttribPointer( myPositionAttribute, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myPositionAttribute );    
}

// Basic render function that will update the translation matrix of the shape
// and then sned that to GL to update the shape.
function render() {
    
    // Force the WebGL context to clear the color buffer.
    gl.clear( gl.COLOR_BUFFER_BIT );

    // Gets ths uniform position in GL of the translation matrix
    var transMatUnifor = gl.getUniformLocation( shaderProgram, "transMat");

    // Builds the matrix using the mat3 function provided in the MV library.
    // This version allows for intuitive contruction of the matricies as seen
    // here.
    var transMatArr = mat3( [  Math.cos(theta), Math.sin(theta), dirOffset[0] ],
                            [ -Math.sin(theta), Math.cos(theta), dirOffset[1] ],
                            [       0,               0,                1      ] );
    
    // Sends the matrix created above to the GPU and then draws the shape.
    gl.uniformMatrix3fv( transMatUnifor, false, flatten(transMatArr) );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, divsForShape );

    // Updates the position for next draw time, and increases the theta value
    // for rotation. One thing to note about these position values is that they
    // are in the viewport space, whereas the construction of the shape happened
    // in the canvas space. This is why these values are much smaller here
    // than compared to above when calculating the shapes points in the canvas.
    dirOffset[0] += moveAmount * dir[0];
    dirOffset[1] += moveAmount * dir[1];
    theta += .01 * keepRotating;

    // requests the next frame to run the same render function.
    window.requestAnimationFrame(render);
}

// Function called by the HTML button to start rotation.
function startRot(){ keepRotating = 1; }

// Function called by the HTML button to stop rotation.
function stopRot(){ keepRotating = 0; }

// Function called by the HTML button to increase the speed.
function increaseSpeed(){ moveAmount +=speedChangeAmount; }

// Function called by the HTML button to decrease the speed.
function decreaseSpeed(){ if (moveAmount - speedChangeAmount >= 0) moveAmount -= speedChangeAmount; }

// Functino called but the HTML canvas everytime it is clicked on.
// This will calculate the clicked on position on the canvas, convert
// that point to the viewport space so that the next time the 
// translation matrix is built, it should use the mouse's position
// for the offset value.
function moveSquare(event){
    var canvas = document.getElementById("gl-canvas");
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = h - (event.clientY - rect.top);
    dirOffset = convertCanvasPosToView( x, y );
}

// Function called everytime a key is pressed down on the webpage.
// This is used to change the direction of movement for the shape.
// The keyCode returns the ASCII value of the character clicked.
// When WASD is clicked, the direction of movement changes accordingly.
function changeDirection(event){
    var theKeyCode = event.keyCode;
    switch (theKeyCode){    
        case 87: dir = vec2(  0,  1 ); break; // W
        case 65: dir = vec2( -1,  0 ); break; // A
        case 83: dir = vec2(  0, -1 ); break; // S
        case 68: dir = vec2(  1,  0 ); break; // D
        default: break;
    }
}

// Barely used useful function for converting between a canvas space coordinate
// and a viewport space coordinate.
function convertCanvasPosToView( x, y ){ 
    return vec2( (x*invw*2.0) - 1.0, (y*invh*2.0) - 1.0 ); 
}