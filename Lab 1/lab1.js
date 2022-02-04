//First and Last Name 
//Dakota Turk

//Code for Lab1

var c = .5;
var d = .2;
var cenx = 0;
var ceny = 0;

var divs = 1000;

var gl;

var arrClick = [];

function init(){

    document.getElementById("sliderC").oninput = function(event) {
        c = parseInt(event.target.value)/100;
        document.getElementById('labelC').innerHTML = c.toString();
        render();
    };

    document.getElementById("sliderD").oninput = function(event) {
        d = parseInt(event.target.value)/100;
        document.getElementById('labelD').innerHTML = d.toString(); 
        render();
    };

    document.getElementById("cenXSlider").oninput = function(event) {
        cenx = parseInt(event.target.value)/100;
        document.getElementById('cenXLabel').innerHTML = cenx.toString();
        render();
    };

    document.getElementById("cenYSlider").oninput = function(event) {
        ceny = parseInt(event.target.value)/100;
        document.getElementById('cenYLabel').innerHTML = ceny.toString(); 
        render();
    };

    document.getElementById("divSlider").oninput = function(event) {
        divs = parseInt(event.target.value);
        document.getElementById('divsLabel').innerHTML = divs.toString(); 
        render();
    };


    var canvas=document.getElementById("gl-canvas");
    gl=WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert( "WebGL is not available" ); }
    
    render();

    canvas.addEventListener("mousedown", function(e)
    {
        getMousePosition(canvas, e);
    });

}

function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = rect.height - (event.clientY - rect.top);
    x = 2*x/canvas.width - 1;
    y = 2*y/canvas.height - 1;
    
    
    arrClick.push(vec2(x, y));
    if (arrClick.length >= 3){
        render();
    }
}

function render(){

    // Set up the viewport
    gl.viewport( 0, 0, 512, 512 );   // x, y, width, height
    
    // Set up the background color
    gl.clearColor( 0.0, 0.0, 1.0, 1.0 );
    
    // Force the WebGL context to clear the color buffer
    gl.clear( gl.COLOR_BUFFER_BIT );


    var arrPointsOfCirc = [];

    var step = 2*Math.PI/divs;
    var count = 0;
    for (var theta = 0; theta<2*Math.PI; theta+=step){
        var point = vec2(c*Math.cos(theta) + cenx, d*Math.sin(theta) + ceny);
        //console.log(point);
        arrPointsOfCirc.push(point);
        count++;
    }
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(arrPointsOfCirc), gl.STATIC_DRAW);
    var myShaderProgram = initShaders( gl, "vertex-shader", "fragment-shader-2" );
    gl.useProgram( myShaderProgram );
    var myPosition = gl.getAttribLocation( myShaderProgram, "myPosition" );
    gl.vertexAttribPointer( myPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myPosition );

    gl.drawArrays( gl.TRIANGLE_FAN, 0, count);
    arrPointsOfCirc = [];


    var arrPointsSqr = [vec2(.1, .3), vec2(.3, .3), vec2(.3, .1), vec2(.1, .1)]
    gl.bufferData( gl.ARRAY_BUFFER, flatten(arrPointsSqr), gl.STATIC_DRAW);
    myShaderProgram = initShaders( gl, "vertex-shader", "fragment-shader-1" );
    gl.useProgram( myShaderProgram );
    myPosition = gl.getAttribLocation( myShaderProgram, "myPosition" );
    gl.vertexAttribPointer( myPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myPosition );

    gl.drawArrays( gl.TRIANGLE_FAN, 0, arrPointsSqr.length);
    arrPointsSqr = [];


    var arrPointRand = [];
    arrPointRand.push(vec2(-.1, .3));
    arrPointRand.push(vec2(-.3, .3));
    arrPointRand.push(vec2(-.27, -.39));
    arrPointRand.push(vec2(-.1, -.1));
    arrPointRand.push(vec2(0, .1));
    arrPointRand.push(vec2(0, .27));
    arrPointRand.push(vec2(.5, .57));
    arrPointRand.push(vec2(-.43, .5));
    
    gl.bufferData( gl.ARRAY_BUFFER, flatten(arrPointRand), gl.STATIC_DRAW);
    myShaderProgram = initShaders( gl, "vertex-shader", "fragment-shader-3" );
    gl.useProgram( myShaderProgram );
    myPosition = gl.getAttribLocation( myShaderProgram, "myPosition" );
    gl.vertexAttribPointer( myPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myPosition );

    gl.drawArrays( gl.LINE_LOOP, 0, arrPointRand.length);
    arrPointRand = [];
    
    if (arrClick.length >= 3){
        gl.bufferData( gl.ARRAY_BUFFER, flatten(arrClick), gl.STATIC_DRAW);
        myShaderProgram = initShaders( gl, "vertex-shader", "fragment-shader-4" );
        gl.useProgram( myShaderProgram );
        myPosition = gl.getAttribLocation( myShaderProgram, "myPosition" );
        gl.vertexAttribPointer( myPosition, 2, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( myPosition );
        gl.drawArrays( gl.TRIANGLE_FAN, 0, arrClick.length);

        gl.bufferData( gl.ARRAY_BUFFER, flatten(arrClick), gl.STATIC_DRAW);
        myShaderProgram = initShaders( gl, "vertex-shader", "fragment-shader-2" );
        gl.useProgram( myShaderProgram );
        myPosition = gl.getAttribLocation( myShaderProgram, "myPosition" );
        gl.vertexAttribPointer( myPosition, 2, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( myPosition );
        gl.drawArrays( gl.LINE_LOOP, 0, arrClick.length);
    }

    var arrOfStarPoint = [];
    var step = 2*Math.PI/10;
    var count = 0;
    var starCenX = -.5;
    var starCenY = -.5;
    var starWidth = .3;
    var startAngle = 90*Math.PI/180;

    for (var theta = startAngle; theta<(2*Math.PI + startAngle); theta+=step){
        if (count % 2 == 0){
            var point = vec2(starWidth*Math.cos(theta) + starCenX, starWidth*Math.sin(theta) + starCenY);
            //console.log(point);
            arrOfStarPoint.push(point);
        }else{
            var point = vec2(starWidth*.4*Math.cos(theta) + starCenX, starWidth*.4*Math.sin(theta) + starCenY);
            //console.log(point);
            arrOfStarPoint.push(point);
        }
        count++;
    }

    for (var i = 1; i < arrOfStarPoint.length; i++){
        var temp = arrOfStarPoint[i - 1];
        arrOfStarPoint[i - 1] = arrOfStarPoint[i];
        arrOfStarPoint[i] = temp;
    }

    gl.bufferData( gl.ARRAY_BUFFER, flatten(arrOfStarPoint), gl.STATIC_DRAW);
    myShaderProgram = initShaders( gl, "vertex-shader", "fragment-shader-4" );
    gl.useProgram( myShaderProgram );
    myPosition = gl.getAttribLocation( myShaderProgram, "myPosition" );
    gl.vertexAttribPointer( myPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myPosition );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, arrOfStarPoint.length);


    var arrPointsOfPacMan = [];
    var pacManWidth = .2;
    var pacManCenter = vec2(.5, -.2);

    var step = 2*Math.PI/50;
    var count = 0;
    var angle = 30*Math.PI/180
    arrPointsOfPacMan.push(pacManCenter);
    for (var theta = angle; theta<(2*Math.PI - angle); theta+=step){
        var point = vec2(pacManWidth*Math.cos(theta) + pacManCenter[0], pacManWidth*Math.sin(theta) + pacManCenter[1]);
        //console.log(point);
        arrPointsOfPacMan.push(point);
        count++;
    }
    
    gl.bufferData( gl.ARRAY_BUFFER, flatten(arrPointsOfPacMan), gl.STATIC_DRAW);
    var myShaderProgram = initShaders( gl, "vertex-shader", "fragment-shader-5" );
    gl.useProgram( myShaderProgram );
    var myPosition = gl.getAttribLocation( myShaderProgram, "myPosition" );
    gl.vertexAttribPointer( myPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myPosition );

    gl.drawArrays( gl.TRIANGLE_FAN, 0, count);


}   