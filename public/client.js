document.addEventListener("DOMContentLoaded", function() {
    var mouse = {
        click: false,
        move: false,
        pos: {x:0, y:0},
        prevPos: false
    };

    // Get canvas element and create context
    var canvas = document.getElementById("drawing");
    var context = canvas.getContext("2d");
    context.strokeStyle = "#FF0000";
    context.lineWidth = 4;
    var width = window.innerWidth;
    var height = window.innerHeight;
    var socket = io.connect();

    // Set canvas to full browser width/height
    canvas.width = width;
    canvas.height = height;

    // Register mouse event handlers
    canvas.onmousedown = function(e){ mouse.click = true; };
    canvas.onmouseup = function(e){ mouse.click = false; };

    canvas.onmousemove = function(e) {
        // Normalize mouse position to range 0.0-1.0
        mouse.pos.x = e.clientX / width;
        mouse.pos.y = e.clientY / height;
        mouse.move = true;
    };

    // Draw line received from server
    socket.on('draw_line', function(data) {
        var line = data.line;
        context.beginPath();
        context.moveTo(line[0].x * width, line[0].y * height);
        context.lineTo(line[1].x * width, line[1].y * height);
        context.stroke();
    });

    // Main loop, runs every 25ms
    function mainLoop() {
        // Check if user is drawing
        if (mouse.click && mouse.move && mouse.prevPos) {
            // Send line to server
            socket.emit('draw_line', { line: [mouse.pos, mouse.prevPos] });
            mouse.move = false;
        }

        mouse.prevPos = {x: mouse.pos.x, y: mouse.pos.y};
        setTimeout(mainLoop, 25);
    }

    mainLoop();
});