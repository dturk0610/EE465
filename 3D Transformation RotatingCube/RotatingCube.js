var gl;
var myShaderProgram;
var thetax = 0, thetay = 0;
var rotXMat, rotYMat;

function init() {

    rotXMat = mat4( [1, 0, 0, 0],
                    [0, 1, 0, 0],
                    [0, 0, 1, 0],
                    [0, 0, 0, 1]);

    rotYMat = mat4( [1, 0, 0, 0],
                    [0, 1, 0, 0],
                    [0, 0, 1, 0],
                    [0, 0, 0, 1]);
    

    var canvas=document.getElementById("gl-canvas");
    gl=WebGLUtils.setupWebGL(canvas);
    
    if (!gl) { alert( "WebGL is not available" ); }
    
    gl.viewport( 0, 0, 512, 512 );
    
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    
    
    myShaderProgram =
        initShaders( gl,"vertex-shader", "fragment-shader" );
    gl.useProgram( myShaderProgram );
    
    // will include depth test to render faces correctly!
    gl.enable( gl.DEPTH_TEST );
    
    setupCube();
    
    render();

}

function setupCube() {
    
    // Vertices of Cube
    var vertices = [vec4( -.2,  .2,  -.2,  1), // p0
                    vec4( -.2, -.2,  -.2,  1), // p1
                    vec4(  .2, -.2,  -.2,  1), // p2
                    vec4(  .2,  .2,  -.2,  1), // p3
                    vec4(  .2,  .2,  .2,  1), // p4
                    vec4( -.2,  .2,  .2,  1), // p5
                    vec4( -.2, -.2,  .2,  1), // p6
                    vec4(  .2, -.2,  .2,  1)];  // p7

    // Colors at Vertices of Cube
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
    // the array "vertices"
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
    
    // Code here to handle putting above lists into buffers
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
    
    var myPosition = gl.getAttribLocation( myShaderProgram, "myPosition" );
    gl.vertexAttribPointer( myPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myPosition );
    
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, colorBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW );
    
    var myColor = gl.getAttribLocation( myShaderProgram, "myColor" );
    gl.vertexAttribPointer( myColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myColor );
    
    // will populate to create buffer for indices
    var iBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBuffer );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indexList), gl.STATIC_DRAW );

    var transMatUnifor = gl.getUniformLocation( myShaderProgram, "transMat");
    var transMat = mat4( [ 1, 0, 0, 0 ],
                            [ 0, 1, 0, 0 ],
                            [ 0, 0, 1, 0 ],
                            [ 0, 0, 0, 1 ] );

    // Sends the matrix created above to the GPU and then draws the shape.
    gl.uniformMatrix4fv( transMatUnifor, false, flatten(transMat) );
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    
    // will populate to render the cube
    gl.drawElements( gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0 );
}

function rotateAroundX() {
    // will implement this to rotate the cube around the X-axis
    thetax += .05;
    
    // Gets ths uniform position in GL of the translation matrix
    var transMatUnifor = gl.getUniformLocation( myShaderProgram, "transMat");

    // Builds the matrix using the mat3 function provided in the MV library.
    // This version allows for intuitive contruction of the matricies as seen
    // here.
    rotXMat = mat4( [ 1, 0, 0, 0 ],
                    [ 0, Math.cos(thetax), Math.sin(thetax), 0 ],
                    [ 0, -Math.sin(thetax), Math.cos(thetax), 0 ],
                    [ 0, 0, 0, 1 ]);
    
    var transMat = mult(rotXMat, rotYMat);
    
    // Sends the matrix created above to the GPU and then draws the shape.
    gl.uniformMatrix4fv( transMatUnifor, false, flatten(transMat) );
    render();
}

function rotateAroundY() {
    // will implement this to rotate the cube around the X-axis
    thetay += .05;
    
    // Gets ths uniform position in GL of the translation matrix
    var transMatUnifor = gl.getUniformLocation( myShaderProgram, "transMat");

    // Builds the matrix using the mat3 function provided in the MV library.
    // This version allows for intuitive contruction of the matricies as seen
    // here.
    rotYMat = mat4( [  Math.cos(thetay), 0, Math.sin(thetay), 0 ],
                    [ 0, 1, 0, 0 ],
                    [ -Math.sin(thetay), 0, Math.cos(thetay), 0 ],
                    [ 0, 0, 0, 1 ]);
    
    var transMat = mult(rotXMat, rotYMat);
    
    // Sends the matrix created above to the GPU and then draws the shape.
    gl.uniformMatrix4fv( transMatUnifor, false, flatten(transMat) );
    render();
}

