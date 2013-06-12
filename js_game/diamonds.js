"use strict";
if(!Array.indexOf){
   Array.prototype.indexOf = function(Object){
     for(var i = 0;i<this.length;i++){
        if(this[i] == Object){
           return i;
         }
     }
     return -1;
   }
}
if(!Array.maxXY){
    Array.prototype.maxXY = function(){
        console.log(this);
        var maxXY = new Array(0,0);
        console.log(this.length);
        for(var i=0;i<this.length;i++){
            var arr = this[i];
            if(arr[0]>maxXY[0]){
                maxXY[0] = arr[0];
            }
            if(arr[1]>maxXY[1]){
                maxXY[1] = arr[1];
            }
        };
        return maxXY;
    }
}
/*
*model 层
*/
function DiamondsModel(width,height){
    this.width = width;
    this.height= height;
    this.diamonds;

    this.init = function(){
        this.arr = new Array();
        for(var i=0;i<height;i++){
            this.arr[i] = new Array();
            for(var j=0;j<width;j++){
                this.arr[i][j] = 1;
            }
        }
    }

    this.randomNeighbour = function(current_pos,not_direction){
        var x = current_pos[0];
        var y = current_pos[1];
        var array = new Array();
        var range = new Array(1,2,3,4);
        range.splice(range.indexOf(not_direction),1);
        var removed_pos;
        var random_value = this.arrayRandom(range);
        if( random_value==1 && y==0 ){
            random_value = 3;
        }
        switch(random_value){
            case 1:
                array = [x,y-1];
                removed_pos = 3;
                break;
            case 2:
                array = [x+1,y];
                removed_pos = 4;
                break;
            case 3:
                array = [x,y+1];
                removed_pos = 1;
                break;
            case 4:
                array = [x-1,y];
                removed_pos = 2;
                break;
        }
        return new Array(array,removed_pos);
    }

    this.generateElement = function(x,y){
        var element = new Array();
        element[0] = new Array(x,y);
        var not_direction = 3;
        for (var i=1;i<4;i++){
           var res = this.randomNeighbour(element[i-1],not_direction);
           element[i] = res[0];
           not_direction = res[1];
        }
        this.diamonds = element;
    }

    this.move = function(x,y){
        if(!this.diamonds){
            console.log("Error: diamonds is not ready");
        }
        var maxXY = this.diamonds.maxXY();
        if(maxXY[0] >= this.width-1){
            x=0;
        }
        if(maxXY[1] >= this.height-1){
            return false;
        }

        for(var i=0;i<this.diamonds.length;i++){
            this.diamonds[i][0] += x;
            this.diamonds[i][1] += y;
        }
        return true;
    }

    this.arrayRandom = function (arr){
        var random_index = Math.random();
        var percent = 1/arr.length;
        for(var i=0;i<arr.length; i++){
            if( random_index>=i*percent && random_index < (i+1)*percent){
                return arr[i];
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
    this.turnOnDiamond = function(pos,color){
        var color = color?color:this.turnOnColor;
        this.drawRect(pos[0],pos[1],color);
    }
    this.turnOffDiamond = function(pos){
        this.drawRect(pos[0],pos[1],this.turnOffColor);
    }
    this.turnOnDiamonds = function (array){
        for(var i=0;i<array.length;i++){
            this.turnOnDiamond(array[i]);
        }
    }
    this.turnOffDiamonds = function(array){
        for(var i=0;i<array.length;i++){
            this.turnOffDiamond(array[i]);
        }
    }
}

function DiamondsController(){
    var width = 10;
    var height = 20;
    var diamonds_model = new DiamondsModel(width,height);
    diamonds_model.init();
    diamonds_model.changed();
    diamonds_model.generateElement(5,0);
    var diamonds_view = new DiamondsView(width,height).init();
    diamonds_view.turnOnDiamonds(diamonds_model.diamonds);

    function move(x,y){
        diamonds_view.turnOffDiamonds(diamonds_model.diamonds);
        var is_move_ok = diamonds_model.move(x,y);
        diamonds_view.turnOnDiamonds(diamonds_model.diamonds);
        return is_move_ok;
    }
    function left(){
        return move(1,0);
    }
    function right(){
        return move(-1,0);
    }
    function down(){
        return move(0,1);
    }
    function keyDown(){
        var realkey = String.fromCharCode(event.keyCode);
        console.log("按键字符: " + realkey);
        var move_drc; 
        switch(realkey){
            case '%':
                right();
                break;
            case "'":
                left();
                break;
            case '(':
                down();
                break;
        }
    }
    setInterval(function(){
        if(!down()){
            diamonds_model.generateElement(5,0);
        }
    },1000);

    console.log(diamonds_model.diamonds.maxXY());
    document.onkeydown = keyDown;
}

var diarmonds_controller = new DiamondsController();

