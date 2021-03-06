var Suite = require ('framework/testsuite');

if (phantom.args.length < 2) {
	console.log ('usage: slimerjs slimerjstest.js <rootUrl> <resultFolderPath>');
	phantom.exit ();
}

var rootUrl = phantom.args[0];
var resultFolder = phantom.args[1];

var suite = new Suite.Suite (rootUrl, resultFolder);

suite.AddTest ('Viewer', function (test, onReady) {
	test.Open ('/test/viewertest/viewertest.html', function () {
		var i;
		for (i = 0; i < 42; i++) {
			test.GenerateImage ('Step', i + 1);
			test.Click (100, 22);
		}
		onReady ();
	});
});

suite.AddTest ('CSG', function (test, onReady) {
	test.Open ('/test/viewertest/csgtest.html', function () {
		var i;
		for (i = 0; i < 30; i++) {
			test.GenerateImage ('Step', i + 1);
			test.Click (100, 22);
		}
		onReady ();
	});
});

suite.AddTest ('Texture', function (test, onReady) {
	test.Open ('/test/viewertest/texturetest.html', function () {
		var i;
		for (i = 0; i < 12; i++) {
			test.GenerateImage ('Step', i + 1);
			test.Click (100, 22);
		}
		onReady ();
	});
});

suite.AddTest ('SVGToModel', function (test, onReady) {
	test.Open ('/test/viewertest/svgtomodeltest.html', function () {
		var i;
		for (i = 0; i < 12; i++) {
			test.GenerateImage ('Step', i + 1);
			test.Click (100, 22);
		}
		onReady ();
	});
});

suite.AddTest ('ViewerTypes', function (test, onReady) {
	test.Open ('/test/viewertest/viewertypes.html', function () {
		var y = 22;
		var xs = [30, 94, 154, 218, 288, 368, 444, 522, 574, 622];
		var i;
		for (i = 0; i < xs.length; i++) {
			test.Click (xs[i], y);
			test.GenerateImage ('Step', i + 1);
			test.DragDrop (400, 400, 450, 450);
			test.GenerateImage ('Navigation', i + 1);
			test.Click (692, y);
			test.GenerateImage ('FitInWindow', i + 1);
		}
		onReady ();
	});
});

suite.AddTest ('Import', function (test, onReady) {
	test.Open ('/test/viewertest/importtest.html', function () {
		var y = 22;
		var xs = [30, 90, 160, 240, 328, 400, 492, 596, 690, 792];
		var i;
		for (i = 0; i < xs.length; i++) {
			test.Click (xs[i], y);
			test.GenerateImage ('Object', i + 1);
		}
		onReady ();
	});
});

suite.AddTest ('Demo', function (test, onReady) {
	test.Open ('/documentation/demo/demonstration.html', function () {
		var buttonsX = 246;
		var settingsCoord = 16;
		var subdivisionCoord = 106;
		var shapesX = 34;
		var i;

		// click on all shapes
		var shapeCoords = [114, 132, 152, 174, 192, 212, 232, 254, 272, 318, 338, 358, 376, 398, 416, 462, 482, 528];
		for (i = 0; i < shapeCoords.length; i++) {
			test.Click (shapesX, shapeCoords[i]);
			test.GenerateImage ('Shape', i + 1);
		}
		
		// switch to cube
		test.Click (shapesX, 152);
		test.Click (buttonsX, settingsCoord);
		test.GenerateImage ('CubeSettings');
		test.WriteToForm (470, 350, '1.0');
		test.WriteToForm (470, 384, '2.0');
		test.WriteToForm (470, 420, '3.0');
		test.Click (614, 460);
		test.GenerateImage ('ResizedCube');
		for (i = 0; i < 3; i++) {
			test.Click (buttonsX, subdivisionCoord);
			test.GenerateImage ('SubdividedCube', i + 1);
		}
		
		// switch to prism
		test.Click (shapesX, 318);	
		test.Click (buttonsX, 66);
		test.GenerateImage ('PrismInfo');
		test.Click (552, 434); // ok

		test.Move (buttonsX, 144);
		test.GenerateImage ('PrismExportButtons');
		test.Click (274, 144);
		test.GenerateImage ('PrismExportStl');
		test.Click (900, 20);
		
		test.Move (buttonsX, 186);
		test.GenerateImage ('PrismColorbuttons');
		test.Click (322, 186);
		test.GenerateImage ('PrismChangedToRed');

		test.Click (buttonsX, settingsCoord);
		test.GenerateImage ('PrismSettings', 1);
		
		var polygonCoords = [
			[310, 478],
			[278, 310],
			[433, 308],
			[458, 467],
			[369, 385]
		];
		
		for (i = 0; i < polygonCoords.length; i++) {
			test.MoveAndClick (polygonCoords[i][0], polygonCoords[i][1]);
		}
		test.MoveAndClick (polygonCoords[0][0], polygonCoords[0][1]);
		test.GenerateImage ('PrismSettings', 2);
		test.Click (782, 574); // ok
		test.GenerateImage ('ModifiedPrism');
		
		// switch to prism shell
		test.Click (shapesX, 338);
		test.Click (buttonsX, settingsCoord);
		test.GenerateImage ('PrismShellSettings', 1);
		
		for (i = 0; i < polygonCoords.length; i++) {
			test.MoveAndClick (polygonCoords[i][0], polygonCoords[i][1]);
		}
		test.MoveAndClick (polygonCoords[0][0], polygonCoords[0][1]);
		test.GenerateImage ('PrismShellSettings', 2);
		test.Click (782, 574); // ok
		test.GenerateImage ('ModifiedPrismShell');

		// switch to line sell
		test.Click (shapesX, 358);
		test.Click (buttonsX, settingsCoord);
		test.GenerateImage ('LineShellSettings', 1);
		
		for (i = 0; i < polygonCoords.length; i++) {
			test.MoveAndClick (polygonCoords[i][0], polygonCoords[i][1]);
		}
		test.MoveAndClick (polygonCoords[polygonCoords.length - 1][0], polygonCoords[polygonCoords.length - 1][1]);
		test.GenerateImage ('LineShellSettings', 2);
		test.Click (782, 574); // ok
		test.GenerateImage ('ModifiedLineShell');
		
		onReady ();
	});
});

suite.AddTest ('Clock', function (test, onReady) {
	test.Open ('/documentation/examples/clock.html#fixtime', function () {
		test.GenerateImage ('FixTime');
		onReady ();
	});
});

suite.AddTest ('Lego', function (test, onReady) {
	test.Open ('/documentation/examples/legobuilder.html', function () {
		var colorsY = 26;
		var colorsX = [28, 52, 76, 100, 124, 150, 170, 196, 220, 242, 268, 292];
		
		test.GenerateImage ('Empty');
		
		// place sime bricks
		test.Click (78, 148);
		test.GenerateImage ('AddBrick', 1);
		test.DragDrop (240, 148, 240, 288);
		test.GenerateImage ('AddBrick', 2);
		test.DragDrop (58, 268, 140, 348);
		test.GenerateImage ('AddBrick', 3);
		
		// change color, and place brick
		var i;
		for (i = 0; i < colorsX.length; i++) {
			test.Click (colorsX[i], colorsY);
			test.Click ((i + 1) * 20, 388);
			test.GenerateImage ('AddColoredBrick', i + 1);
		}
		
		// add top brick
		test.Click (colorsX[4], colorsY);
		test.DragDrop (178, 188, 300, 188);
		test.GenerateImage ('AddTopBrick', 1);
		
		// add small bricks
		test.Click (colorsX[0], colorsY);
		test.Click (74, 74);
		test.DragDrop (200, 148, 200, 288);
		test.GenerateImage ('AddTopBrick', 2);
		test.DragDrop (118, 228, 260, 228);
		test.GenerateImage ('AddTopBrick', 3);

		// add large brick again
		test.Click (colorsX[6], colorsY);
		test.Click (74, 74);
		test.DragDrop (60, 328, 100, 328);
		test.GenerateImage ('AddTopBrick', 4);

		// add large brick again
		test.Click (30, 76);
		test.GenerateImage ('Undo', 1);
		test.Click (30, 76);
		test.GenerateImage ('Undo', 2);
		test.Click (30, 76);
		test.GenerateImage ('Undo', 3);
		
		// navigation
		test.DragDrop (600, 500, 600, 400);
		test.GenerateImage ('Navigation', 1);
		test.DragDrop (600, 500, 600, 600);
		test.GenerateImage ('Navigation', 2);
		test.DragDrop (600, 500, 700, 500);
		test.GenerateImage ('Navigation', 3);
		
		// clear
		test.Click (290, 76);
		test.GenerateImage ('Cleared');

		onReady ();
	});
});


suite.AddTest ('Robot', function (test, onReady) {
	test.Open ('/documentation/examples/robot/robot.html', function () {
		test.GenerateImage ('OnLoad');
		onReady ();
	});
});

suite.AddTest ('Bezier', function (test, onReady) {
	test.Open ('/documentation/examples/bezier.html', function () {
		test.GenerateImage ('OnLoad');
		
		test.Click (172, 132, 300);
		test.GenerateImage ('HideControlPoints');
		
		test.Click (126, 132, 300);
		test.GenerateImage ('ShowControlPoints');

		test.Click (142, 160, 300);
		test.GenerateImage ('Degree2');

		test.Click (174, 160, 300);
		test.GenerateImage ('Degree3');

		test.DragDrop (668, 418, 668, 318, 300);
		test.GenerateImage ('MoveControlPoint', 1);
		test.DragDrop (542, 378, 542, 638, 300);
		test.GenerateImage ('MoveControlPoint', 2);

		test.Click (78, 318, 300);
		test.GenerateImage ('ViewAsSvg');
		onReady ();
	});
});

suite.AddTest ('Deform', function (test, onReady) {
	test.Open ('/documentation/examples/deform.html', function () {
		test.GenerateImage ('OnLoad');

		test.DragDrop (668, 418, 668, 318);
		test.GenerateImage ('MoveVertex', 1);
		
		test.WriteToForm (80, 146, '50');
		test.Click (80, 300); // click outside to lose focus
		test.DragDrop (542, 378, 542, 538);
		test.GenerateImage ('MoveVertex', 2);

		onReady ();
	});
});

suite.AddTest ('SVGTo3DExample', function (test, onReady) {
	test.Open ('/documentation/examples/svgto3d.html', function () {
		test.GenerateImage ('OnLoad');

		var y1 = 300;
		var y2 = 530;
		var xs = [188, 400, 624, 844];
		var i;
		for (i = 0; i < xs.length; i++) {
			test.Click (xs[i], y1);
			test.GenerateImage ('Model', i + 1);
			test.Click (900, 20);
		}
		for (i = 0; i < xs.length; i++) {
			test.Click (xs[i], y2);
			test.GenerateImage ('Model', i + 4 + 1);
			test.Click (900, 20);
		}

		onReady ();
	});
});

suite.AddTest ('Solids', function (test, onReady) {
	test.Open ('/documentation/examples/solids.html', function () {
		var shapeX = 56;

		// platonic
		var i;
		var ys = [126, 142, 156, 172, 188];
		for (i = 0; i < ys.length; i++) {
			test.Click (shapeX, ys[i]);
			test.GenerateImage ('Platonic', i + 1);
		}
		
		test.Click (42, 310);
		test.Click (80, 600); // click outside to lose focus
		test.GenerateImage ('NoFaces');
		test.Click (42, 310);
		
		test.Click (42, 330);
		test.Click (80, 600); // click outside to lose focus
		test.GenerateImage ('NoColors');
		test.Click (42, 330);

		// archimedean
		test.Click (shapeX, 218);
		ys = [148, 162, 178, 192, 206, 222, 236, 252, 266, 282, 296, 312, 325];
		for (i = 0; i < ys.length; i++) {
			test.Click (shapeX, ys[i]);
			test.GenerateImage ('Archimedean', i + 1);
		}
	
		// stellations
		test.Click (shapeX, 358);
		ys = [166, 182, 196];
		for (i = 0; i < ys.length; i++) {
			test.Click (shapeX, ys[i]);
			test.GenerateImage ('Stellation', i + 1);
		}
		
		onReady ();
	});
});

suite.AddTest ('CSGExample', function (test, onReady) {
	test.Open ('/documentation/examples/csg.html', function () {
		test.GenerateImage ('OnLoad');
		var shapesY1 = 92;
		var shapesY2 = 262;
		var shapesX = [36, 84, 134];
		
		var i;
		for (i = 0; i < shapesX.length; i++) {
			test.Click (shapesX[i], shapesY1);
			test.GenerateImage ('Shape', i + 1);
		}
		test.Click (shapesX[0], shapesY1);
		
		for (i = 0; i < shapesX.length; i++) {
			test.Click (shapesX[i], shapesY2);
			test.GenerateImage ('Shape', i + 1 + 3);
		}
		test.Click (shapesX[1], shapesY2);

		// modify size
		test.WriteToForm (104, 132, '0.5');
		test.Click (272, shapesY1);
		test.GenerateImage ('Params', 1);
		
		test.WriteToForm (120, 405, '0.0');
		test.Click (272, shapesY2);
		test.GenerateImage ('Params', 2);

		// modify method
		test.Click (88, 496);
		test.GenerateImage ('Method', 1);

		test.Click (212, 496);
		test.GenerateImage ('Method', 2);
		
		onReady ();
	});
});

suite.AddTest ('TicTacToe', function (test, onReady) {
	test.Open ('/documentation/examples/tictactoe.html#norandom', function () {
		test.GenerateImage ('OnLoad');

		test.Click (617, 352);
		test.GenerateImage ('Step', 1);
		
		test.Click (476, 322);
		test.GenerateImage ('Step', 2);

		test.Click (534, 388);
		test.GenerateImage ('Step', 3);

		test.Click (300, 574);
		test.GenerateImage ('Step', 4);

		test.Click (412, 308);
		test.GenerateImage ('Step', 5);

		onReady ();
	});
});

suite.AddTest ('Tutorial_Minimal', function (test, onReady) {
	test.Open ('/documentation/tutorial/minimal.html', function () {
		test.GenerateImage ('OnLoad');
		onReady ();
	});
});

suite.AddTest ('Tutorial_SVGTo3D', function (test, onReady) {
	test.Open ('/documentation/tutorial/svgto3d.html', function () {
		test.GenerateImage ('OnLoad');
		onReady ();
	});
});

suite.AddTest ('Tutorial_TextGenerator', function (test, onReady) {
	test.Open ('/documentation/tutorial/textgenerator.html', function () {
		test.GenerateImage ('OnLoad');
		test.WriteToForm (560, 80, 'Viktor!', 1500);
		test.GenerateImage ('Modified');
		onReady ();
	});
});

suite.AddTest ('Tutorial_Examples', function (test, onReady) {
	test.Open ('/documentation/tutorial/demo.html', function () {
		var i;
		for (i = 0; i < 8; i++) {
			test.KeyDown (16777236); // right arrow
			test.GenerateImage ('Demo', i + 1);
		}
		onReady ();
	});
});

suite.Run (function () {
	slimer.exit ();
});
