// This is an Academic Project, and was published after finishing the lecture.
// @author Joao Elvas @ FCT/UNL
// @author Rodolfo Simoes @ FCT/UNL

var g;
var bufferId, bufferIdLines, outLines, out, ang;
var program, vertices;
var canvas , k ;
var theta = 0.0;
var a , thetaLoc;

var mouseDown, lastMouseX, lastMouseY; // Mouse movement vars

window.onload = function init() {
canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) { alert("WebGL isn't available"); }
    
    gl-canvas.addEventListener("mousedown",handleMouseDown, false );
    gl-canvas.addEventListener("mouseup",handleMouseUp, false );
    gl-canvas.addEventListener("mousemove",handleMouseMove, false );
    
    mouseDown = false;
    
    // Three vertices
    vertices = [
        vec2(-0.5,-0.5),
        vec2(0,0.5),
        vec2(0.5,-0.5)
    ];
  
    var nivel = 0 ;
    out = new Array();
    outLines = new Array();
    
    document.getElementById('nivel_val').innerHTML = nivel;
    
    
    subdivide (vertices[0],vertices[1],vertices[2],nivel,out);
    createLines (out, outLines);
   
    // Configure WebGL
    gl.viewport(0,0,canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    
    // Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    sliderLvl(nivel);
    
    render();
}


function render() {
    
     
    if(document.getElementById('botao').checked) {
        thetaLoc = gl.getUniformLocation(program,"theta");
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
        var vPosition = gl.getAttribLocation(program, "vPosition");
        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);

       gl.clear(gl.COLOR_BUFFER_BIT);
        
        
        //theta = calcAng(vec2(lastMouseX,lastMouseY),);
        gl.uniform1f(thetaLoc,theta);
        gl.drawArrays(gl.TRIANGLES, 0, out.length );
        window.requestAnimFrame(render);
        
    }
    else {
        thetaLoc = gl.getUniformLocation(program,"theta");
        //gl.clear(gl.COLOR_BUFFER_BIT);
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdLines);
        var vPosition = gl.getAttribLocation(program, "vPosition");
        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(thetaLoc,theta);
        gl.drawArrays(gl.LINES, 0, outLines.length ); 
        window.requestAnimFrame(render);
    }
}

//------------------------------
//    MOUSE EVENTS   
//------------------------------

//Handles the mouse press
function handleMouseDown() {
    mouseDown = true;
    lastMouseX = event.clientX; 
    lastMouseY = event.clientY;
}

//Handles the mouse depress
function handleMouseUp() {
    mouseDown = false;
}

//Handles the mouse movement while mouse is pressed
function handleMouseMove() {
    if(!mouseDown) {
        return
    }
    
    var newX = event.clientX;
    var newY = event.clientY;
    
    calcAng (vec2(lastMouseX,lastMouseY),vec2(newX,newY));
//    calcAng (vec2(lastMouseX - (canvas.width /2),lastMouseY - (canvas.height/2)),vec2(newX - (canvas.width /2),newY - (canvas.height /2))); 
}

//------------------------------
//    
//------------------------------

function subdivide (v1,v2,v3,n,out){
if(n==0){out.push(v1);
          out.push(v2);
          out.push(v3);
         }
    else {
        var v1v2 = mix(v1, v2, 0.5);
        var v1v3 = mix(v1, v3, 0.5);
        var v2v3 = mix(v2, v3, 0.5);
        
        subdivide (v1,v1v2,v1v3,n-1,out);
        subdivide (v1v2,v2v3,v1v3,n-1,out);
        subdivide (v1v3,v2v3,v3,n-1,out);
        subdivide (v1v2,v2,v2v3,n-1,out);   
        }
}

function createLines (out, outLines){
    var ponto1 = 0;
    var ponto2 = 1;
    var ponto3 = 2;
    var i = 0;
    while(i < out.length) {
        outLines.push(out[ponto1]);
        outLines.push(out[ponto2]);
        outLines.push(out[ponto2]);
        outLines.push(out[ponto3]);
        outLines.push(out[ponto3]);
        outLines.push(out[ponto1]);
        ponto1 += 3;
        ponto2 += 3;
        ponto3 += 3;
        i += 3;
    }
}

function sliderLvl(value) {

    
    if(bufferId != -1){
    gl.deleteBuffer(bufferId);
    gl.deleteBuffer(bufferIdLines);
    }
    
    out = [];
    outLines = [];
    
    nivel = value;
    document.getElementById('nivel_val').innerHTML = nivel;
    
    subdivide (vertices[0],vertices[1],vertices[2],value,out);
    createLines (out, outLines);
     // Configure WebGL
    gl.viewport(0,0,canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    
    // Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU
    bufferId = gl.createBuffer();
    bufferIdLines = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(out), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdLines);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(outLines), gl.STATIC_DRAW);
    
    render();
}



function calcAng (v1,v2){ 
    var x = Math.sqrt((Math.pow(v1[0],2))+ (Math.pow(v1[1],2)));
    var xnorm = vec2 (v1[0]/x,v1[1]/x);
    var y = Math.sqrt((Math.pow(v2[0],2))+ (Math.pow(v2[1],2)));
    var ynorm =vec2 (v2[0]/y,v2[1]/y);
    var proIntrn = x* y * Math.cos(xnorm[0]*ynorm[0] + xnorm[1]*ynorm[1]);
    //var proIntrn = x* y * Math.cos(Math.abs((xnorm[0]*ynorm[0] + xnorm[1]*ynorm[1])));
    var cosang = ((v1[0]*v2[0]) + (v1[1]*v2[1])) / (x*y);
    var radians =  Math.acos(cosang);
    prodctExtZ(v1,v2);
    if(k>0){
        theta = -((180 * radians)/Math.PI) ;
    }
    else 
        theta = (180 * radians)/Math.PI ;
       // ProdctExtZ (vec2(lastMouseX,lastMouseY),vec2(newX,newY));
    
    console.log(theta);
}


function rotat()
{
clearTimeout(a);
a = setTimeout(function() {
requestAnimFrame(render);
            gl.clear(gl.COLOR_BUFFER_BIT);
            theta += 0.1;
            gl.uniform1f(thetaLoc, theta);
            gl.drawArrays(gl.TRIANGLES, 0, out.length);
            }, 100);
}

function prodctExtZ (u,v){
     
     k = ((u[0]*v[1])-(v[0]*u[1]));
             
    // console.log(k);


}

