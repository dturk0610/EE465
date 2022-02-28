// Variables for GL.
var gl;
var myShaderProgram;

// These are variables used to track the canvas dimensions.
var invh, h;
var invw, w;

// Uniform location on the gpu for the scale matrix
// Also the values per axis to scale on.
var scaleMatUniform;
var scaleMat, scaleX = 1, scaleY = 1, scaleZ = 1;

// Uniform location on the gpu for the rotation matrix
// Also the Euler angle to rotate the shape by on designated axis
// All three seperate rotation matrixs are combined to make the
// Final one pushed to the gpu.
var rotMatUniform;
var thetax = 0, thetay = 0, thetaz = 0;
var rotXMat, rotYMat, rotZMat;

// Uniform location on the gpu for the move matrix
// Also the amount to move the shape by on the X and Y axis.
var moveMatUniform;
var moveMat, transX = 0, transY = 0, transZ = 0;

// Initialize function to set stuff up.
function init() {

    // Calls the function to setup our matricies which will be pushed
    // to the gpu later.
    setupMatricies();

    // Gets webGL setup.
    var canvas=document.getElementById("gl-canvas");
    gl=WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert( "WebGL is not available" ); }

    // Get and calculate the useful canvas variables.
    h = parseFloat(canvas.height); invh = 1.0/h;
    w = parseFloat(canvas.width); invw = 1.0/w;

    // Setup GL.
    setupGL();

    // Setup our shape and pass information into the gpu.
    setupShape();
    
    // Render the scene.
    render();

}

//#region SET UPS

// Sets all matricies to the identity matrix (at least theoreticall 
// they all get set to this as all values will equate to the identity).
function setupMatricies(){

    // This initializes the rotation X matrix (should be the identity matrix).
    rotXMat = mat4( [ 1, 0, 0, 0 ],
                    [ 0, Math.cos(thetax), Math.sin(thetax), 0 ],
                    [ 0, -Math.sin(thetax), Math.cos(thetax), 0 ],
                    [ 0, 0, 0, 1 ]);

    // This initializes the rotation Y matrix (should be the identity matrix).
    rotYMat = mat4( [  Math.cos(thetay), 0, Math.sin(thetay), 0 ],
                    [ 0, 1, 0, 0 ],
                    [ -Math.sin(thetay), 0, Math.cos(thetay), 0 ],
                    [ 0, 0, 0, 1 ]);

    // This initializes the rotation Z matrix (should be the identity matrix).
    rotZMat = mat4( [  Math.cos(thetaz), Math.sin(thetaz), 0, 0 ],
                    [ -Math.sin(thetaz), Math.cos(thetaz), 0, 0 ],
                    [ 0, 0, 1, 0 ],
                    [ 0, 0, 0, 1 ]);

    // This initializes the move matrix (should be the identity matrix).
    moveMat = mat4( [1, 0, 0, transX],
                    [0, 1, 0, transY],
                    [0, 0, 1, 0],
                    [0, 0, 0, 1] );

    // This initializes the scale matrix (should be the identity matrix).
    scaleMat = mat4( [ scaleX, 0, 0, 0 ],
                     [ 0, scaleY, 0, 0 ],
                     [ 0, 0, scaleZ, 0 ],
                     [ 0, 0, 0, 1] );

}

// Gets webGL setup.
function setupGL(){

    // Sets up the viewport and bacground color
    gl.viewport( 0, 0, w, h );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    
    // Setup our shader program
    myShaderProgram = initShaders( gl,"vertex-shader", "fragment-shader" );
    gl.useProgram( myShaderProgram );
    
    // will include depth test to render faces correctly!
    gl.enable( gl.DEPTH_TEST );

}

// Sets up a parallel-piped prism.
function setupShape() {
    
    // Vertices of shape.
    var vertices = [vec4(  .0,  .2,  -.2,  1), // p0
                    vec4( -.2, -.2,  -.2,  1), // p1
                    vec4(  .2, -.2,  -.2,  1), // p2
                    vec4(  .4,  .2,  -.2,  1), // p3
                    vec4(  .4,  .2,  .2,  1), // p4
                    vec4(  .0,  .2,  .2,  1), // p5
                    vec4( -.2, -.2,  .2,  1), // p6
                    vec4(  .2, -.2,  .2,  1)];  // p7

    // Colors at Vertices of shape.
    var vertexColors = [vec4( 0.0, 0.0, 1.0, 1.0), // p0
                        vec4( 0.0, 1.0, 0.0, 1.0), // p1
                        vec4( 1.0, 0.0, 0.0, 1.0), // p2
                        vec4( 1.0, 1.0, 0.0, 1.0), // p3
                        vec4( 1.0, 0.0, 1.0, 1.0), // p4
                        vec4( 0.0, 1.0, 1.0, 1.0), // p5
                        vec4( 1.0, 1.0, 1.0, 1.0), // p6
                        vec4( 0.3, 0.3, 0.3, 1.0)]; // p7

    // Every face on the cube is divided into two triangles,
    // each triangle is described by three indices into
    // the array "vertices".
    var indexList = [0, 1, 3,
                     1, 2, 3,
                     6, 5, 7,
                     4, 7, 5,
                     0, 6, 1,
                     5, 6, 0,
                     2, 4, 3,
                     2, 7, 4,
                     0, 4, 5,
                     0, 3, 4,
                     2, 1, 6,
                     2, 6, 7];
    
    // Code here to handle putting above lists into buffers.
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
    
    var myPosition = gl.getAttribLocation( myShaderProgram, "myPosition" );
    gl.vertexAttribPointer( myPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myPosition );
    
    // Sends the color of each vertex to the gpu.
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, colorBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW );
    
    var myColor = gl.getAttribLocation( myShaderProgram, "myColor" );
    gl.vertexAttribPointer( myColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myColor );
    
    // will populate to create buffer for indices.
    var iBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBuffer );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indexList), gl.STATIC_DRAW );

    // Gets the full rotation matrix setup to be pushed to the GPU.
    var rotMat = mult(rotZMat, rotYMat);
    rotMat = mult(rotMat, rotXMat);
    
    // Gets the uniform location on the GPU of the scaleMatrix, rotationMatrix and the
    // movementMatrix.
    scaleMatUniform = gl.getUniformLocation( myShaderProgram, "scaleMat");
    rotMatUniform = gl.getUniformLocation( myShaderProgram, "rotMat");
    moveMatUniform = gl.getUniformLocation( myShaderProgram, "moveMat");

    // Send sthe current state of each matrix to the gpu (all should be identity matrix).
    gl.uniformMatrix4fv( scaleMatUniform, false, flatten(scaleMat) );
    gl.uniformMatrix4fv( rotMatUniform, false, flatten(rotMat) );
    gl.uniformMatrix4fv( moveMatUniform, false, flatten(moveMat) );
}

//#endregion

// Renders the current scene.
function render() {
    // Clears the color and depth buffer bits.
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    
    // will populate to render the cube.
    gl.drawElements( gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0 );
}

// This is called for every correct input. This will calculate the new translation
// matrix and then send them all to the GPU. They are calculated in the order that
// they are applied in. Scale, Rotate, translate.
function translateShape(){

    // Makes the scale matrix
    scaleMat = mat4( [ scaleX, 0, 0, 0 ],
                    [ 0, scaleY, 0, 0 ],
                    [ 0, 0, scaleZ, 0 ],
                    [ 0, 0, 0, 1] );

    // Calculates the rotation matrix off the x-axis
    rotXMat = mat4( [ 1, 0, 0, 0 ],
                    [ 0, Math.cos(thetax), Math.sin(thetax), 0 ],
                    [ 0, -Math.sin(thetax), Math.cos(thetax), 0 ],
                    [ 0, 0, 0, 1 ]);

    // Calculates the rotation matrix off the y-axis
    rotYMat = mat4( [  Math.cos(thetay), 0, Math.sin(thetay), 0 ],
                    [ 0, 1, 0, 0 ],
                    [ -Math.sin(thetay), 0, Math.cos(thetay), 0 ],
                    [ 0, 0, 0, 1 ]);

    // Calculates the rotation matrix off the z-axis
    rotZMat = mat4( [  Math.cos(thetaz), Math.sin(thetaz), 0, 0 ],
                    [ -Math.sin(thetaz), Math.cos(thetaz), 0, 0 ],
                    [ 0, 0, 1, 0 ],
                    [ 0, 0, 0, 1 ]);
    
    // Calclates the full rotation matrix. This is typically done in the ZYX order.
    // Well, actually, typically Euler angles aren't used, instead quaternions are
    // to avoid situations like gimble lock, but when using Euler angles, this order
    // is typcially taken.
    var rotMat = mult(rotZMat, rotYMat);
    rotMat = mult(rotMat, rotXMat);

    // Calculated the movement matrix
    moveMat = mat4( [1, 0, 0, transX],
                    [0, 1, 0, transY],
                    [0, 0, 1, transZ],
                    [0, 0, 0, 1] );

    // Sends the matrix created above to the GPU and then draws the shape.
    gl.uniformMatrix4fv( scaleMatUniform, false, flatten(scaleMat) );
    gl.uniformMatrix4fv( rotMatUniform, false, flatten(rotMat) );
    gl.uniformMatrix4fv( moveMatUniform, false, flatten(moveMat) );

    render();
}

// this section handles the input for the scene.
// 1, 2 or 3 will rotate off the X, Y and Z axis, respectively.
// The arrow keys will translate the shape up down, left or right.
// f and b will translate the object forward or backward in the scene:
// as a note, this effect will be hard to see since we don't have a
// perspective camera, but instead are using an orthographic camera
// where the Z direction has the same type of scale no matter how close
// an object is to the camera.
// Y, U grow or shrink in the original x direction
// H, J grow or shrink in the original Y direction
// N, M grow or shrink in the original Z direction
function handleInput(event){
    var offset = .05;
    var key = event.key;
    switch(key){
        case "1": thetax += offset; translateShape(); break; // 1 - Rotate off x axis
        case "2": thetay += offset; translateShape(); break; // 2 - Rotate off y axis
        case "3": thetaz += offset; translateShape(); break; // 3 - Rotate off z axis
        case "ArrowRight": transX += offset; translateShape(); break; // right - translate to the right
        case "ArrowLeft": transX -= offset; translateShape(); break; // left - translate to the left
        case "ArrowUp": transY += offset; translateShape(); break; // up - translate up
        case "ArrowDown": transY -= offset; translateShape(); break; // down - translate down
        case "f": transZ += offset; translateShape(); break; // forward - translate in a positive z sense (into screen)
        case "b": transZ -= offset; translateShape(); break; // backward - translate in a negative z sense (out of screen)
        case "y": scaleX += offset; translateShape(); break; // Grow in X direction
        case "u": scaleX -= offset; translateShape(); break; // Shrink in X direction
        case "h": scaleY += offset; translateShape(); break; // Grow in Y direction
        case "j": scaleY -= offset; translateShape(); break; // Shrink in Y direction
        case "n": scaleZ += offset; translateShape(); break; // Grow in Z direction
        case "m": scaleZ -= offset; translateShape(); break; // Shrink in Z direction
        default: break;
    }
}