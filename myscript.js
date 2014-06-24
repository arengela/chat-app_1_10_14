/*****************************************
VISUAL CHAT APP 
ANGELA REN
SSUI WEB FALL 2013
******************************************/

var colors = ["#FD0E35", "orange", "yellow", "GreenYellow", "DodgerBlue", "Fuchsia"];
var socket = io.connect("http://localhost:8888");
var user_id = 0;
var my_user_id=0;
var color=[];

function send_message(message) {
	socket.emit("message", user_id, [currentlySelected,message]);
}

/*******************************************/

socket.on('user_id', function(id) {
	user_id = id;
	my_user_id=id;
	color = colors[user_id%colors.length];
	var message_input = document.getElementById("message");
	message_input.style.color = color;
});

/*******************************************/

// PARSE RECEIVED MESSAGE
socket.on("message_sent", function(user_id, message) {
	//NEW DOT
	if (message[1][0]=="dot"){
		message=message[1];
		var backgroundDiv=document.getElementById("backgroundDiv");
		paper=backgroundDiv.paper;
 		var idx=message[4];
 		
 		//IF THIS MESSAGE IS FOR THE CHAT I'M NOT CURRENTLY ON
 		if (message[7]==1){
 			if (currentlySelected!=idx){
				for(i=paper.sets[idx].lastRead+1;i<paper.sets[idx].text.length;i++){
					paper.sets[idx][3][0][i].animate({fill:"red"});
				}
			}
			else{
				for(i=paper.sets[idx].lastRead+1;i<paper.sets[idx].text.length;i++){
					paper.sets[idx][3][0][i].animate({fill:"gray"});
				}
				paper.sets[idx].lastRead=paper.sets[idx].text.length-1;
			}
				
		}
		
		//IF DOT IS BEING MOVED
		else if (message[7]==2 & user_id!=my_user_id){
			paper.sets[idx].translate(message[1], message[2]);
		}
	
		//IF NEW CHAT THREAD
		else if (message[7]==0) {
			newDot=new Dot(message[1],message[2],10,message[3],message[4],message[5],message[6],paper,[],user_id);
			//newDot[3][0][0].animate({fill:"red"});
 		}
	}
	
	//SET PIC
	else if (message[1][0]=="pic"){
		img.node.href.baseVal = message[1][1];
		img.attr("opacity",100);
	}
	
	//FREE DRAW
	else if (message[0]=="draw"){
		if(message[1][4]){
		drawLine(message[1][0], message[1][1], message[1][2], message[1][3]);
		}
	}
	
	//NEW REPLY
	else{
		if (user_id==my_user_id)
		{
			add_message(user_id, message[1]);
			appendText(message[1],user_id,currentlySelected)
		}
		else if (message[0]==currentlySelected)
		{
			add_message(user_id, message[1]);
			appendText(message[1],user_id,message[0])	
		}
		else 
		{
			appendText(message[1],user_id,message[0])	
		}	
	}
});

/*******************************************/

// NEW MESSAGE
function add_message (user_id, message) {
	var sender = document.createElement("div");
	sender.className = "sender";
	sender.textContent = "user_"+user_id;

	var content = document.createElement("div");
	content.className = "content";
	content.textContent = message;

	var container = document.createElement("div");
	container.className = "container";
	container.appendChild(sender);
	container.appendChild(content);

	//messages.insertBefore(container, messages.firstChild);
	messages.appendChild(container);
	var color = colors[user_id%colors.length];
	content.style.color = color;
}

/*******************************************/

//INITIATES ONE DOT
function Dot(ix,iy,ir,sliceColors,labelNum,text,title,paper,legendText,user_id)
{
	// grab a reference to the objects "this"
	var that = this;
	var st = paper.set();
  	st.draggable.enable();
	attrs = { 'fill': 'yellow' };


	//var r = Raphael(0, 50, 640, 480);
	var sliceNum=20;
	var slices=Array.apply(null, new Array(sliceNum)).map(Number.prototype.valueOf,1);

	var pie=paper.piechart(ix, iy, 15, slices,
	{stroke:"none",
	colors: sliceColors});
	
	
	var circle=paper.circle(ix, iy, 10).attr({'fill':'red','opacity':1});
	var label=paper.text(ix, iy, labelNum+1).attr({'fill':'black'});
	
	// Make label text unselectable
	$(label.node).css({
	"-webkit-touch-callout": "none",
	"-webkit-user-select": "none",
	"-khtml-user-select": "none",
	"-moz-user-select": "none",
	"-ms-user-select": "none",
	"user-select": "none",
	})
		
	st.push(label);
	st.push(circle);
	
	st.text=text;
	
	st.title=title;
	st.readNum=1;
	paper.sets[labelNum]=st;
	
	var titleType= paper.text(ix, iy-25, title).attr({'fill':'yellow',"font-size": 14, "font-family": "HelveticaNeue-UltraLight, Helvetica, sans-serif" });
	st.push(titleType)
	st.push(pie)
	
	
	st.user_id_num=[user_id]	;

	
	// Make label text unselectable
	$(titleType.node).css({
	"-webkit-touch-callout": "none",
	"-webkit-user-select": "none",
	"-khtml-user-select": "none",
	"-moz-user-select": "none",
	"-ms-user-select": "none",
	"user-select": "none",
	})

	
	// mouse down/up
	st.down = function(x,y,event) {
		st.animate({ opacity: 1}, 500, ">");
		st.oldX=st[1].attr('cx');
		st.oldY=st[1].attr('cy');

	}
	st.up = function () {
		st.animate({opacity: 1}, 500, ">");
		dx=st[1].attr('cx')-st.oldX;
		dy=st[1].attr('cy')-st.oldY;
		send_message(["dot",dx,dy,sliceColors,st[0].attr("text")-1,st.text,st.title,2]);
	};
	st.mousedown(st.down);
	st.mouseup(st.up);

	st.lastRead=0;
	//click handler
	st.down = function () {
			if (typeof prevSelection === 'object'){
				prevSelection[1].animate({fill:"gray"}, 500, ">");
			}
			prevSelection=st;
			circle.animate({fill:"blue"}, 500, ">");
			
			var messages=document.getElementById("messages");
			
			while ( messages.firstChild ){
				messages.removeChild( messages.firstChild );
			}
			for(i=0;i<=st.text.length-1;i++){
				add_message (st.user_id_num[i], st.text[i])
			}

			currentlySelected=st[0].attr("text")-1;
			
			//DRAW FORM DIV
			var message_input = document.getElementById("message");
			
			st.lastRead=st.text.length-1;
			for(i=0;i<=st.lastRead;i++){
				st[3][0][i].animate({fill:"gray"});
			}	
			
			console.log(st.text)
		};
	st.dblclick(st.down)

	//change cursor
	st.mouseover(function(){
		this.attr({'cursor':'move'});
	});
	st.mouseout(function(){
		this.attr({'cursor':'default'});
	});
	
	
	
	if (my_user_id==user_id){
			st.lastRead=1;
			if (typeof prevSelection === 'object'){
				prevSelection[1].animate({fill:"gray"}, 500, ">");
			}
			prevSelection=st;
			circle.animate({fill:"blue"}, 500, ">");
			
			var messages=document.getElementById("messages");
			
			while ( messages.firstChild ){
				messages.removeChild( messages.firstChild );
			}
			for(i=0;i<=st.text.length-1;i++){
				add_message (st.user_id_num[i], st.text[i])
			}

			currentlySelected=st[0].attr("text")-1;
			
			//DRAW FORM DIV
			var message_input = document.getElementById("message");
			
			st.lastRead=st.text.length-1;
			for(i=0;i<=st.lastRead;i++){
				st[3][0][i].animate({fill:"gray"});
			}	
				
			// play sound when new dot created
			sound1=document.getElementById("sound1");
			PlaySound("sound1");
			console.log(st.text)
	}
	else {
		st[3][0][0].animate({fill:"red"});
	}
	
	
	return st;
}

/*******************************************/

// RESETS DOT 
function resetDot(oneDot,idx,readNum,commentLength,readFlag,paper,legendText){
	var slices=20;
	var sliceNum=slices-commentLength;
	var slices=Array.apply(null, new Array(sliceNum)).map(Number.prototype.valueOf,1);
	
	var sliceColors=Array.apply(null, new Array(readNum)).map(String.prototype.valueOf,"red")
	var sliceColors2=Array.apply(null, new Array(sliceNum)).map(String.prototype.valueOf,"black")
	sliceColors=sliceColors.concat(sliceColors2);

	x=oneDot[1].attr('cx');
	y=oneDot[1].attr('cy');
 	send_message(["dot",x,y,sliceColors,idx,oneDot.text,oneDot.title,1]);
}

/*******************************************/

// NEW CHAT REPLY
function appendText(value,user_id_num,idx){
	var backgroundDiv=document.getElementById("backgroundDiv")
	backgroundDiv.paper.sets[idx].text.push(value);
	backgroundDiv.paper.sets[idx].user_id_num.push(user_id_num);
	var commentLength=backgroundDiv.paper.sets[idx].text.length;
	legendText=backgroundDiv.paper.sets[idx].text;
	resetDot(backgroundDiv.paper.sets[idx],idx,1,commentLength,0,backgroundDiv.paper,legendText)
}

/*******************************************/

// ADD CHAT DOT
function addCircle(e,paper){
	dot=paper.sets;
	attachedElement=this;
	var x=e.originalEvent.x-280;
	var y=e.originalEvent.y-50;
	//console.log("record down location: " + x + ", " + y);
	
	var title=prompt("Title your dot","");
	if (title!=null){
		var sliceNum=20;
		var sliceColors=Array.apply(null, new Array(1)).map(String.prototype.valueOf,"gray")

		var sliceColors2=Array.apply(null, new Array(sliceNum-1)).map(String.prototype.valueOf,"none");
		
		sliceColors=sliceColors.concat(sliceColors2);

		send_message(["dot",x,y,sliceColors,dot.length,[title],title,0]);
	}
}

/*******************************************/

//SET BUTTONS IN TOP TOOLBAR
function setToolBar(titleBarDiv,paper){
	var paper2 = Raphael(300,50,1000,50);
	
	//UPLOAD PIC BUTTON
	var x=2;
	var y=10;
	var text="Set Pic";
	but1=makeButton(x,y,text,paper2);		
	but1.click(function () {
			setMouseFunctions("pic");
			prevBut=but1;
	});
	
	
	//INSERT DOT
	var x=x+70;
	var y=10;
	var text="Edit Chats";
	but2=makeButton(x,y,text,paper2);		
	but2.click(function () {
			setMouseFunctions("dot");
			prevBut=but2;
	});
	
	//FREEHAND DRAW BUTTON
	var x=x+70;
	var y=10;
	var text="Free Draw";
	but3=makeButton(x,y,text,paper2);		
	but3.click(function () {
			setMouseFunctions("draw");
			prevBut=but3;
	});
}

/*******************************************/

//SET EVENTS OF MODE
function setMouseFunctions(mode){
	
	//SET FREE DRAW EVENTS
	if (mode=="draw"){
		$(rect[0]).unbind('click');

		$(document).on('mousedown',function(e){
			//e.preventDefault();
			drawing = true;
			prev.x = e.pageX-280;
			prev.y = e.pageY-50;
		});

		$(document).on('mouseup',function(e){
			//e.preventDefault();
			drawing = false;
			prev.x = e.pageX-280;
			prev.y = e.pageY-50;
		});
	
		$(document).on('mousemove',function(e){
		if(drawing){
				x=e.pageX-280;
				y=e.pageY-50;
				socket.emit('message',user_id,['draw',[prev.x,prev.y,x,y,drawing]]);
				drawLine(prev.x, prev.y, x, y,ctx);
				prev.x = x;
				prev.y = y;
				//clients[data.id] = data;
				//clients[data.id].updated = $.now();
			}
		});
		
		//SET TRANSPARENT RECTANGLE OVERLAY TO RECEIVE EVENTS
		protectRect = paper.rect(5,55,1010,500-60);
		protectRect.attr("opacity",0);
		protectRect.attr("fill",  'white');
		protectRect.attr("stroke", 'red');
		
		
	}
	
	//SET CHAT DOT EVENTS
	else if (mode=="dot"){	
		$(document).unbind('mousedown mouseup mousemove');
		
		if (typeof protectRect === 'object'){
			protectRect.remove();
			protectRect="";
		}
		
		$(rect[0]).on("click", function (event) {
			addCircle(event,paper)
		});
	}
	
	//LOAD PICTURE 
	else if (mode=="pic"){
		$(document).unbind('mousedown mouseup mousemove');
		$(rect[0]).unbind('click');
		
		
		var picUrl=prompt("Insert url of image to canvas","");
		if (picUrl!=null){
			uploadPic(picUrl,paper)
		}
	}
}

/*******************************************/

// SET BACKGROUND PICTURE
function uploadPic(picUrl,paper){
 	send_message(["pic",picUrl]);
}

/*******************************************/

function PlaySound(soundObj) {
	var sound = document.getElementById(soundObj);
	sound.Play();
}

/*******************************************/

//MAKE ONE BUTTON
prevBut="";
function makeButton(x,y,text,paper2){
	var rect=paper2.roundedRectangle(x,y,60,30, 10, 10, 10, 10);
	var label=paper2.text(x+28, y+15, text).attr({'fill':'black',"font-size": 11, "font-family": "HelveticaNeue-UltraLight, Helvetica, sans-serif" });
	// Make label text unselectable
	$(label.node).css({
	"-webkit-touch-callout": "none",
	"-webkit-user-select": "none",
	"-khtml-user-select": "none",
	"-moz-user-select": "none",
	"-ms-user-select": "none",
	"user-select": "none",
	})

	rect.attr("fill",  'gray');
	rect.attr("stroke", 'black');
	
	var st = paper2.set();
	st.push(rect);
	st.push(label);
	
	st.mouseover(function(){
		this.attr({'cursor':'pointer'});
	});
	st.mouseout(function(){
		this.attr({'cursor':'default'});
	});
	
	st.click(function () {
		st[0].animate({fill:"red"})
		if (typeof prevBut === 'object'){
			if (prevBut!=st){
				prevBut[0].animate({fill:"gray"});	
			}	
		}
	});
	return st;
}

/*******************************************/

//DRAW ROUNDED RECTANGLE
Raphael.fn.roundedRectangle = function (x, y, w, h, r1, r2, r3, r4){
  var array = [];
  array = array.concat(["M",x,r1+y, "Q",x,y, x+r1,y]); //A
  array = array.concat(["L",x+w-r2,y, "Q",x+w,y, x+w,y+r2]); //B
  array = array.concat(["L",x+w,y+h-r3, "Q",x+w,y+h, x+w-r3,y+h]); //C
  array = array.concat(["L",x+r4,y+h, "Q",x,y+h, x,y+h-r4, "Z"]); //D

  return this.path(array);
};

/*******************************************/

//DRAW LINE
function drawLine(fromx, fromy, tox, toy){
	stroke=ctx.path("M{0},{1}L{2},{3}", fromx, fromy, tox, toy); 
	stroke.attr ({stroke:"red",width:200});
	
}

/*******************************************/

//GLOBAL VARIABLES
var ctx=[];
var rect=[];
var paper=[];
var prev=[];
var drawing=false;
var currentlySelected=-1;
var prevSelection="";
var protectRect="";
/*******************************************/

//MAIN FUNCTION
window.onload = function() {
	
	//MAKE CHAT BOX
	var message_input = document.getElementById("message");
	message_input.addEventListener("keydown", function(event) {
		if(event.keyCode === 13) {
			var message = message_input.value;
			message_input.value = "";
			send_message(message);
		}
	});
	message_input.focus();
	
	var backgroundDiv=document.getElementById("backgroundDiv");

	//INITIATE RAPHAEL PAPER
	paper = Raphael(280,50,1380,500);
	paper.draggable.enable();
	backgroundDiv.paper=paper;
	backgroundDiv.paper.sets=[];
	
	//SET INITIAL IMAGE AND HIDE
	img = paper.image("http://www.aaccessmaps.com/images/maps/us/ca/sanfrancisco/sanfrancisco.gif", 5,55,1010,500-60);
	img.attr("opacity",0);

	//SET TRANSPARENT RECTANGLE OVERLAY TO RECEIVE EVENTS
	rect = paper.rect(5,55,1010,500-60);
	rect.attr("opacity",0);
	rect.attr("fill",  'white');
	rect.attr("stroke", 'red');
	
	//SET CHAT BOX TITLE
	var theDiv = document.getElementById("chatTitleDiv");
	var content = document.createTextNode("CHAT BOX");
	theDiv.style.fontSize = "40px";
	theDiv.appendChild(content);
	
	//SET TOOLBAR
	var titleBarDiv = document.getElementById("topBarDiv");
	setToolBar(titleBarDiv,paper);

	ctx=paper;
};


	