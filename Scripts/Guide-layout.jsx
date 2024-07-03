// Global Variables
var doc = app.activeDocument;

var selectedLayer = doc.layers;
var guidesArray;
var marginArray;




var activedArtboard = doc.artboards[doc.artboards.getActiveArtboardIndex()];

var artboard_x = activedArtboard.artboardRect[0];
var artboardWidth = activedArtboard.artboardRect[2];
var artboard_y = activedArtboard.artboardRect[1];
var artboardHeight = activedArtboard.artboardRect[3];

var units = ['px','pt', 'in', 'mm', 'cm'];
var convertUnits = 1;

var titlename;
var configText;
var rows;
var quantity;
var gutter;
var columns;
var marginsStext;
var top;
var bottom;
var left;
var right;
var buttonCreate;
var marginSingle;
var locktext;
var helpLock;
var guidesName;
var preview;


var hasGutter;
var line;
var line2;
var point1;
var point2;

var isUndo = false;



if (BridgeTalk.appName == "illustrator") {

//check language


if ($.locale == "pt_BR") {
	titlename = "Layout de Guias - por Gleydson Isecke";
	configText = "Configurações";
	rows = "Linhas";
	quantity = "Quantidade";
	gutter = "Medianiz";
	columns = "Colunas";
	marginsStext = "Margens";
	top = "Superior";
	bottom = "Inferior";
	left = "Esquerda";
	right = "Direita";
	buttonCreate = "Criar Guias";
	marginSingle = "Margem ";
	locktext = "Manter proporções";
	helpLock = "Mude os valores na margem superior";
	guidesName = "Guias";
	preview = "Visualizar";
} else {
	titlename = "Guide Layout - by Gleydson Isecke";
	configText = "Guide Layout settings";
	rows = "Rows";
	quantity = "Quantity";
	gutter = "Gutter";
	columns = "Columns";
	marginsStext = "Margins";
	top = "Top";
	bottom = "Bottom";
	left = "Left";
	right = "Right";
	buttonCreate = "Create Guides";
	marginSingle = "Margin ";
	locktext = "Lock Margins";
	helpLock = "Change values on Margin Top";
	guidesName = "Guides";
	preview = "Preview";
}
	

//Layout
var win = new Window("dialog", titlename);
win.orientation = "column";

var panel = win.add("Panel", undefined, configText);

//Group Grid Layout
var group = panel.add("group");
group.orientation = "row";

//Rows Group Layout
var rowsGroup = group.add("group");
rowsGroup.margins = [0, 0, 80,0]
rowsGroup.orientation = "column";
rowsGroup.add("statictext", [0, 0, 80, 25], rows);
rowsGroup.add("statictext", [0, 0, 80, 25], quantity);
var quantityTextRow = rowsGroup.add("edittext", [0, 0, 80, 25], '0');
rowsGroup.add("statictext", [0, 0, 80, 25], gutter);
var gutterTextRow = rowsGroup.add("edittext", [0, 0, 80, 25], '0');


//Columns Group Layout
var columnsGroup = group.add("group");
columnsGroup.orientation = "column";
columnsGroup.add("statictext", [0, 0, 80, 25], columns);
columnsGroup.add("statictext", [0, 0, 80, 25], quantity);
var quantityTextColumns = columnsGroup.add("edittext", [0, 0, 80, 25], '0');
columnsGroup.add("statictext", [0, 0, 80, 25], gutter);
var gutterTextColumns = columnsGroup.add("edittext", [0, 0, 80, 25], '0');
group.margins = [0,0,0,20];


//Margin
var marginGroup = panel.add("Group");
marginGroup.orientation = "column";
marginGroup.add("statictext", undefined, marginsStext);

var inputMarginGroup = marginGroup.add("Group");
inputMarginGroup.orientation = "row";

var topGroup = inputMarginGroup.add('group');
topGroup.orientation = "column";
topGroup.add("statictext", [0, 0, 80, 25], top);
var topText = topGroup.add("edittext", [0, 0, 80, 25], '0');

var bottomGroup = inputMarginGroup.add('group');
bottomGroup.orientation = "column";
bottomGroup.add("statictext", [0, 0, 80, 25], bottom);
var bottomText = bottomGroup.add("edittext", [0, 0, 80, 25], '0');


var leftGroup = inputMarginGroup.add('group');
leftGroup.orientation = "column";
leftGroup.add("statictext", [0, 0, 80, 25], left);
var leftText = leftGroup.add("edittext", [0, 0, 80, 25], '0');

var rightGroup = inputMarginGroup.add('group');
rightGroup.orientation = "column";
rightGroup.add("statictext", [0, 0, 80, 25], right);
var rightText = rightGroup.add("edittext", [0, 0, 80, 25], '0');

var droplist = inputMarginGroup.add("dropdownlist", undefined, units);
droplist.alignment = "bottom";



var checkLock = marginGroup.add("checkbox", [0, 0, 150, 25], locktext);
checkLock.alignment = "left";

var buttonGroup = win.add("group");
buttonGroup.orientation = "row";

// Buttons
var checkPreview = buttonGroup.add("checkbox", [0, 0, 80, 25], preview);
var createButton = buttonGroup.add('button', undefined, buttonCreate);
var cancelButton = buttonGroup.add('button', undefined, "Cancel");

//listeners
	// Grid
quantityTextRow.addEventListener("keyup", function (event) {pressedKey(event, this, 1, false);});
gutterTextRow.addEventListener("keyup", function (event) {pressedKey(event, this, 1, true);});
quantityTextColumns.addEventListener("keyup", function (event) {pressedKey(event, this, 1, false);});
gutterTextColumns.addEventListener("keyup", function (event) {pressedKey(event, this, 1, true);});

	//Margins
topText.addEventListener("keyup", function (event) {pressedKey(event, this, 1, true);});
bottomText.addEventListener("keyup", function (event) {pressedKey(event, this, 1, true);});
leftText.addEventListener("keyup", function (event) {pressedKey(event, this, 1, true);});
rightText.addEventListener("keyup", function (event) {pressedKey(event, this, 1, true);});


	//buttons
checkLock.onClick = lockedMargins;
checkPreview.onClick = previewGuides;
cancelButton.onClick = function() {
			undoAndRedraw();
			win.close();
}


droplist.onChange = function() {
	switch (droplist.selection.text) {
		case 'px':
			convertUnits = 1;
			break;
		case 'pt':
			convertUnits = 1;
			break;
		case 'in':
			convertUnits = 72;
			break;
		case 'mm':
			convertUnits = 2.834645;
			break;
		case 'cm':
			convertUnits = 28.346;
			break;
	
	}

	previewGuides();
}

createButton.onClick = function() {
	checkPreviewValue();
};

win.addEventListener("keydown", function(event) {
	switch (event.keyName) {
		case "Enter":
			checkPreviewValue();		
			break;
	}
	
});

createButton.active = true;

//help tip
topText.helpTip = marginSingle + top;
bottomText.helpTip = marginSingle + bottom;
leftText.helpTip = marginSingle + left;
rightText.helpTip = marginSingle + right;
	

//functions

function undoAndRedraw() {
	app.undo();
	app.redraw()

};

function checkPreviewValue() {
	if (checkPreview.value) {
		win.close();
	} else {
		setGuidesValue();
		win.close();
	}
}

function setGuidesValue() {
	guidesArray = [
		Number(parseInt(quantityTextRow.text)), 
		Number(parseFloat(gutterTextRow.text)*convertUnits), 
		Number(parseInt(quantityTextColumns.text)), 
		Number(parseFloat(gutterTextColumns.text)*convertUnits)
	];
	marginArray = [
		Number(parseFloat(topText.text)*convertUnits),
		Number(parseFloat(bottomText.text)*convertUnits),
		Number(parseFloat(leftText.text)*convertUnits),
		Number(parseFloat(rightText.text)*convertUnits)
	];
	createGuidesAndMargins(guidesArray, marginArray);
	
}



function pressedKey(key, object, minValue, isFloat) {

	var step;

	if (key.shiftKey) {
		step = 10;
	} else if (key.ctrlKey && isFloat) {
		step = 0.1;
	} else {
		step = 1;
	};

	switch (key.keyName) {
		case "Up":
			object.text = String(Number(parseFloat(object.text))+step);
			break;
		case "Down":
			object.text = String(Number(parseFloat(object.text))-step);
	
		
	};

	if((object.text === 'NaN') || (object.text < 0)) {
		object.text = minValue;
	}
	previewGuides();
	lockedMargins();

}

function lockedMargins() {
	if (checkLock.value) {
		rightText.text = leftText.text = bottomText.text = topText.text;
		rightText.helpTip = leftText.helpTip = bottomText.helpTip = helpLock;
		previewGuides();
	}
}

function previewGuides() {
	if (checkPreview.value) {
		if (isUndo) {
			app.undo();
		} else {
			isUndo = true;
		}
		setGuidesValue();
		app.redraw();
	} else if (isUndo) {
		undoAndRedraw();
		isUndo = false;

	}

}

function createGuidesAndMargins(guidesValue, marginsValue) {
	
	layerGuidesCreate();

	if (guidesValue[0] > 0 && guidesValue[2] > 0) {
		insertRow(guidesValue[0], guidesValue[1], marginsValue[0], marginsValue[1]);
		insertColumns(guidesValue[2], guidesValue[3], marginsValue[2], marginsValue[3]);
	} else if (guidesValue[0] > 0) {
		insertRow(guidesValue[0], guidesValue[1], marginsValue[0], marginsValue[1]);
	} else if (guidesValue[2] > 0) {
		insertColumns(guidesValue[2], guidesValue[3], marginsValue[2], marginsValue[3]);
	}

	
	if (marginsValue[0] > 0 || marginsValue[1] > 0 || marginsValue[2] > 0 || marginsValue[3] > 0) {
		//top
		line = doc.pathItems.add();
		point1 = line.pathPoints.add();
		point1.anchor = [artboard_x+marginsValue[2], artboard_y-marginsValue[0]];
		point1.leftDirection = point1.anchor;
		point1.rightDirection = point1.anchor;
		point1.pointType.CORNER;

		point2 = line.pathPoints.add();
		point2.anchor = [artboardWidth-marginsValue[3], artboard_y-marginsValue[0]];
		point2.leftDirection = point2.anchor
		point2.rightDirection = point2.anchor;
		point2.pointType.CORNER;

		line.guides = true;

		//Bottom
		line = doc.pathItems.add();
		point1 = line.pathPoints.add();
		point1.anchor = [artboard_x+marginsValue[2], artboardHeight+marginsValue[1]];
		point1.leftDirection = point1.anchor;
		point1.rightDirection = point1.anchor;
		point1.pointType.CORNER;

		point2 = line.pathPoints.add();
		point2.anchor = [artboardWidth-marginsValue[3], artboardHeight+marginsValue[1]];
		point2.leftDirection = point2.anchor
		point2.rightDirection = point2.anchor;
		point2.pointType.CORNER;

		line.guides = true;

		//left
		line = doc.pathItems.add();
		point1 = line.pathPoints.add();
		point1.anchor = [artboard_x+marginsValue[2], artboard_y-marginsValue[0]];
		point1.leftDirection = point1.anchor;
		point1.rightDirection = point1.anchor;
		point1.pointType.CORNER;

		point2 = line.pathPoints.add();
		point2.anchor = [artboard_x+marginsValue[2], artboardHeight+marginsValue[1]];
		point2.leftDirection = point2.anchor
		point2.rightDirection = point2.anchor;
		point2.pointType.CORNER;

		line.guides = true;

		//Right
		line = doc.pathItems.add();
		point1 = line.pathPoints.add();
		point1.anchor = [artboardWidth-marginsValue[3], artboard_y-marginsValue[0]];
		point1.leftDirection = point1.anchor;
		point1.rightDirection = point1.anchor;
		point1.pointType.CORNER;

		point2 = line.pathPoints.add();
		point2.anchor = [artboardWidth-marginsValue[3], artboardHeight+marginsValue[1]];
		point2.leftDirection = point2.anchor
		point2.rightDirection = point2.anchor;
		point2.pointType.CORNER;

		line.guides = true;
	}
	

	selectedLayer.getByName(guidesName).zOrder(ZOrderMethod.SENDTOBACK);
	
}

function layerGuidesCreate() {

	var layerslength = selectedLayer.length;
	var layerArray = [];

	for (var l = 0; l < layerslength; l++) {
		layerArray.push(selectedLayer[l].name);
	}
	
	layerArray = layerArray.toSource();

	if (layerArray.indexOf(guidesName) > -1) {
		selectedLayer.getByName(guidesName).zOrder(ZOrderMethod.BRINGTOFRONT);
	} else {
		var newLayer = selectedLayer.add();
		newLayer.name = guidesName;
	}


}

function insertRow(quantity, gutter, top, bottom) {
	hasGutter = false;
	var c = 0;
	var v;
	var u = quantity * gutter;
	var y;
	
	var h = (artboardHeight+bottom) - (artboard_y-top);

	if (gutter > 0) {
		hasGutter = true;
		h = h + u;
	}
		
	for (var g = 1; g <= quantity; g++) {
		v = (h / (quantity + 1))*g;
		if (hasGutter) {
			y =  v-(gutter*c);
			line = doc.pathItems.add();
			point1 = line.pathPoints.add();
			point1.anchor = [artboard_x, y-top+artboard_y];
			point1.leftDirection = point1.anchor;
			point1.rightDirection = point1.anchor;
			point1.pointType.CORNER; 

			point2 = line.pathPoints.add();
			point2.anchor = [artboardWidth, y-top+artboard_y];
			point2.leftDirection = point2.anchor;
			point2.rightDirection = point2.anchor;
			point2.pointType.CORNER; 
			line.guides = true;

			line2 = doc.pathItems.add();
			point1 = line2.pathPoints.add();
			point1.anchor = [artboard_x, y-top-gutter+artboard_y];
			point1.leftDirection = point1.anchor;
			point1.rightDirection = point1.anchor;
			point1.pointType.CORNER; 

			point2 = line2.pathPoints.add();
			point2.anchor = [artboardWidth, y-top-gutter+artboard_y];
			point2.leftDirection = point2.anchor;
			point2.rightDirection = point2.anchor;
			point2.pointType.CORNER; 

			line2.guides = true;

			c++;

		} else {
			line = doc.pathItems.add();
			point1 = line.pathPoints.add();
			point1.anchor = [artboard_x, v-top+artboard_y];
			point1.leftDirection = point1.anchor;
			point1.rightDirection = point1.anchor;
			point1.pointType.CORNER; 

			point2 = line.pathPoints.add();
			point2.anchor = [artboardWidth, v-top+artboard_y];
			point2.leftDirection = point1.anchor;
			point2.rightDirection = point1.anchor;
			point2.pointType.CORNER; 

			line.guides = true;
		}
	}
}

function insertColumns(quantity, gutter, left, right) {
	hasGutter = false;
	var o = quantity * gutter;
	var w = (artboardWidth-right) - (artboard_x+left);
	var b;
	var a = 0;
	var z;

	if (gutter > 0) {
		hasGutter = true;
		w = w - o;
	}

	for (var f = 1; f <= quantity; f++) {
		b = (w / (quantity+1))*f;
		if (hasGutter) {
			z = b+(gutter*a);
			line = doc.pathItems.add();
			point1 = line.pathPoints.add();
			point1.anchor = [z+left+artboard_x, artboard_y];
			point1.leftDirection = point1.anchor;
			point1.rightDirection = point1.anchor;
			point1.pointType.CORNER; 

			point2 = line.pathPoints.add();
			point2.anchor = [z+left+artboard_x, artboardHeight];
			point2.leftDirection = point2.anchor;
			point2.rightDirection = point2.anchor;
			point2.pointType.CORNER; 
			line.guides = true;

			line2 = doc.pathItems.add();
			point1 = line2.pathPoints.add();
			point1.anchor = [z+left+artboard_x+gutter, artboard_y];
			point1.leftDirection = point1.anchor;
			point1.rightDirection = point1.anchor;
			point1.pointType.CORNER; 

			point2 = line2.pathPoints.add();
			point2.anchor = [z+left+artboard_x+gutter, artboardHeight];
			point2.leftDirection = point2.anchor;
			point2.rightDirection = point2.anchor;
			point2.pointType.CORNER; 

			line2.guides = true;

			a++;

		} else {
			line = doc.pathItems.add();
			point1 = line.pathPoints.add();
			point1.anchor = [b+left+artboard_x, artboard_y];
			point1.leftDirection = point1.anchor;
			point1.rightDirection = point1.anchor;
			point1.pointType.CORNER; 

			point2 = line.pathPoints.add();
			point2.anchor = [b+left+artboard_x, artboardHeight];
			point2.leftDirection = point1.anchor;
			point2.rightDirection = point1.anchor;
			point2.pointType.CORNER; 

			line.guides = true;
		}
	}

	
}

win.show();

}