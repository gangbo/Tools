"use strict";
/*
*model 层
*/
function DiamondsModel(width,height){
    this.width = width;
    this.height= height;

    this.init = function(){
        this.arr = new Array();
        for(var i=0;i<height;i++){
            this.arr[i] = new Array();
            for(var j=0;j<width;j++){
                this.arr[i][j] = 1;
            }
        }
    }

    this.changed = function(){
    }

}
/*
* view
*/
function DiamondsView(width,height){
    this.width = width;
    this.height = height;
    this.diamondSize = 20;
    this.gapWidth = 2;
    this.lineWidth = 8;
    this.turnOnColor = '#339933';
    this.turnOffColor = '#C0C0C0';
    this.ctx;
    this.init = function(){
        var canvas = document.getElementById('myCanvas');
        canvas.width = (this.diamondSize+this.gapWidth)*this.width+this.gapWidth;
        canvas.height = (this.diamondSize+this.gapWidth)*this.height+this.gapWidth;
        this.ctx=canvas.getContext('2d');
        this.setWithWidthHeight(canvas);
        return this;
    }

    this.setWithWidthHeight= function(canvas){
        var ctx = this.ctx;
        ctx.fillStyle='#8FBC8F';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.lineWidth = this.lineWidth;
        for(var i=0;i<this.width;i++){
            for(var j=0;j<this.height;j++){
                this.drawRect(i,j,this.turnOffColor);
            }
        }
    }
    this.drawRect = function(x,y,color){
        var ctx = this.ctx;
        ctx.lineJoin = "round";
        ctx.strokeStyle = color;
        var point_x = (this.gapWidth+this.diamondSize)*x+this.gapWidth;
        var point_y = (this.gapWidth+this.diamondSize)*y+this.gapWidth;
        ctx.strokeRect(point_x+ctx.lineWidth/2,
                point_y+ctx.lineWidth/2,
                this.diamondSize-ctx.lineWidth,
                this.diamondSize-ctx.lineWidth);
    }
    this.turnOnDiamond = function(x,y,color){
        var color = color?color:this.turnOnColor;
        this.drawRect(x,y,color);
    }
    this.turnOffDiamond = function(x,y){
        this.drawRect(x,y,this.turnOffColor);
    }
}

function DiamondsController(){
    var width = 10;
    var height = 20;
    var diamonds_model = new DiamondsModel(width,height);
    diamonds_model.init();
    diamonds_model.changed();
    var diamonds_view = new DiamondsView(width,height).init();
    diamonds_view.turnOnDiamond(2,3);
//    diamonds_view.turnOffDiamond(2,3);
    function keyDown(){
        var realkey = String.fromCharCode(event.keyCode);
        console.log("按键字符: " + realkey);
    }
    document.onkeydown = keyDown;
}

var diarmonds_controller = new DiamondsController();

