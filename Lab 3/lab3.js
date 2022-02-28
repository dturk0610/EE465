var gl;
var myShaderProgram;

var scaleMatUniform;
var scaleMat, scaleX = 1, scaleY = 1, scaleZ = 1;

var rotMatUniform;
var thetax = 0, thetay = 0, thetaz = 0;
var rotXMat, rotYMat, rotZMat;

var moveMatUniform;
var moveMat, transX = 0, transY = 0;


function init() {

    rotXMat = mat4( [ 1, 0, 0, 0 ],
                    [ 0, Math.cos(thetax), Math.sin(thetax), 0 ],
                    [ 0, -Math.sin(thetax), Math.cos(thetax), 0 ],
                    [ 0, 0, 0, 1 ]);

    rotYMat = mat4( [  Math.cos(thetay), 0, Math.sin(thetay), 0 ],
                    [ 0, 1, 0, 0 ],
                    [ -Math.sin(thetay), 0, Math.cos(thetay), 0 ],
                    [ 0, 0, 0, 1 ]);

    rotZMat = mat4( [  Math.cos(thetaz), Math.sin(thetaz), 0, 0 ],
                    [ -Math.sin(thetaz), Math.cos(thetaz), 0, 0 ],
                    [ 0, 0, 1, 0 ],
                    [ 0, 0, 0, 1 ]);

    moveMat = mat4( [1, 0, 0, transX],
                    [0, 1, 0, transY],
                    [0, 0, 1, 0],
                    [0, 0, 0, 1] );

    scaleMat = mat4( [ scaleX, 0, 0, 0 ],
                    [ 0, scaleY, 0, 0 ],
                    [ 0, 0, scaleZ, 0 ],
                    [ 0, 0, 0, 1] );
    
    

    var canvas=document.getElementById("gl-canvas");
    gl=WebGLUtils.setupWebGL(canvas);
    
    if (!gl) { alert( "WebGL is not available" ); }
    
    gl.viewport( 0, 0, 512, 512 );
    
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    
    
    myShaderProgram = initShaders( gl,"vertex-shader", "fragment-shader" );
    gl.useProgram( myShaderProgram );
    
    // will include depth test to render faces correctly!
    gl.enable( gl.DEPTH_TEST );
    
    setupCube();
    
    render();

}

function setupCube() {
    
    // Vertices of Cube
    var vertices = [vec4(  .0,  .2,  -.2,  1), // p0
                    vec4( -.2, -.2,  -.2,  1), // p1
                    vec4(  .2, -.2,  -.2,  1), // p2
                    vec4(  .4,  .2,  -.2,  1), // p3
                    vec4(  .4,  .2,  .2,  1), // p4
                    vec4(  .0,  .2,  .2,  1), // p5
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

    // var transMatUnifor = gl.getUniformLocation( myShaderProgram, "transMat");
    // var transMat = mat4( [ 1, 0, 0, 0 ],
    //                      [ 0, 1, 0, 0 ],
    //                      [ 0, 0, 1, 0 ],
    //                      [ 0, 0, 0, 1 ] );

    // // Sends the matrix created above to the GPU and then draws the shape.
    // gl.uniformMatrix4fv( transMatUnifor, false, flatten(transMat) );

    var rotMat = mult(rotXMat, rotYMat);
    rotMat = mult(rotMat, rotZMat);
    
    scaleMatUniform = gl.getUniformLocation( myShaderProgram, "scaleMat");
    rotMatUniform = gl.getUniformLocation( myShaderProgram, "rotMat");
    moveMatUniform = gl.getUniformLocation( myShaderProgram, "moveMat");

    gl.uniformMatrix4fv( scaleMatUniform, false, flatten(scaleMat) );
    gl.uniformMatrix4fv( rotMatUniform, false, flatten(rotMat) );
    gl.uniformMatrix4fv( moveMatUniform, false, flatten(moveMat) );
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    
    // will populate to render the cube
    gl.drawElements( gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0 );
}

function translateShape(){

    rotXMat = mat4( [ 1, 0, 0, 0 ],
        [ 0, Math.cos(thetax), Math.sin(thetax), 0 ],
        [ 0, -Math.sin(thetax), Math.cos(thetax), 0 ],
        [ 0, 0, 0, 1 ]);

    rotYMat = mat4( [  Math.cos(thetay), 0, Math.sin(thetay), 0 ],
                    [ 0, 1, 0, 0 ],
                    [ -Math.sin(thetay), 0, Math.cos(thetay), 0 ],
                    [ 0, 0, 0, 1 ]);

    rotZMat = mat4( [  Math.cos(thetaz), Math.sin(thetaz), 0, 0 ],
                    [ -Math.sin(thetaz), Math.cos(thetaz), 0, 0 ],
                    [ 0, 0, 1, 0 ],
                    [ 0, 0, 0, 1 ]);

    moveMat = mat4( [1, 0, 0, transX],
                    [0, 1, 0, transY],
                    [0, 0, 1, 0],
                    [0, 0, 0, 1] );

    scaleMat = mat4( [ scaleX, 0, 0, 0 ],
                    [ 0, scaleY, 0, 0 ],
                    [ 0, 0, scaleZ, 0 ],
                    [ 0, 0, 0, 1] );
    
    var rotMat = mult(rotXMat, rotYMat);
    rotMat = mult(rotMat, rotZMat);


    
    // Sends the matrix created above to the GPU and then draws the shape.
    gl.uniformMatrix4fv( scaleMatUniform, false, flatten(scaleMat) );
    gl.uniformMatrix4fv( rotMatUniform, false, flatten(rotMat) );
    gl.uniformMatrix4fv( moveMatUniform, false, flatten(moveMat) );

    render();
}

function changeDirection(event){
    var offset = .05;
    var key = event.key;
    switch(key){
        case "1": thetax += offset; translateShape(); break; // 1
        case "2": thetay += offset; translateShape(); break; // 2
        case "3": thetaz += offset; translateShape(); break; // 3
        case "ArrowUp": transY += offset; translateShape(); break; // up
        case "ArrowDown": transY -= offset; translateShape(); break; // down
        case "ArrowLeft": transX -= offset; translateShape(); break; // left
        case "ArrowRight": transX += offset; translateShape(); break; // right
        case "y": scaleX += offset; translateShape(); break;
        case "u": scaleX -= offset; translateShape(); break;
        case "h": scaleY += offset; translateShape(); break;
        case "j": scaleY -= offset; translateShape(); break;
        case "n": scaleZ += offset; translateShape(); break;
        case "m": scaleZ -= offset; translateShape(); break;
        default: break;
    }
    console.log(key);
}