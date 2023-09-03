// Your provided code snippet and any other necessary functions

var canvas;
var gl;

var pointsArray = [];
var index = 0;

var numTimesToSubdivide = 0;

// Shader source code
var vertexShaderSource = `
attribute vec4 vPosition;

void main() {
    gl_Position = vPosition;
}
`;

var fragmentShaderSource = `
precision mediump float;

void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;

function main() {
    canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext("webgl");

    if (!gl) {
        alert("WebGL isn't available");
    }

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, vertexShaderSource, fragmentShaderSource);
    gl.useProgram(program);

    // Set up the user interface
    document.getElementById("subdivision-level").oninput = function (event) {
        numTimesToSubdivide = parseInt(event.target.value);
        updateSphere();
    };

    updateSphere();
}

function updateSphere() {
    pointsArray = [];
    index = 0;

    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatten(pointsArray)), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, pointsArray.length);
}
