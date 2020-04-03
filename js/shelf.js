"use strict";

//модель полиці - псевдоклас полиць для шафи (бувають горизонтальні, бувають вертикальні)
var CShelf=function(prm){
    var self=this;
            
    var type  = "addHShelf"; //горизонтальна полиця (addVShelf - вертикальна)
    var start = { //початкова точка
        x: 0,
        y: 0
    };
    var width  = 300; //ширина (для вертикальних полиць - висота) в px
    var depth  = 400;  //"глибина" (ширина) в px
    var thick  = 18; //товщина в px
    
    var max_width=1000;
    var max_depth=1000;
    var max_thick=50;
    var min_width=30;
    var min_depth=30;
    var min_thick=2;
               
    var __constructor=function(prm){
        try{
            if (prm.type==="addHShelf" || prm.type==="addVShelf")
                type=prm.type;
            if (prm.width >=min_width && prm.width<=max_width)
                width=prm.width;
            if (prm.depth >=min_depth && prm.depth<=max_depth)
                depth=prm.depth;
            if (prm.thick >=min_thick && prm.thick<=max_thick)
                thick=prm.thick;  

            start=prm.start;
        }catch(err){
            console.log(err);
        }                
    };
    
    self.GetShelf=function(){
        return {
            "type"  : type, 
            "start" : start,
            "width" : width,
            "depth" : depth,
            "thick" : thick
        };
    };
    
    //
    self.AddToDraft=function(prm){ 
        
        console.log(prm);
        
        var w=width;
        var h=thick;
        if (type === "addVShelf"){
            w=thick;
            h=width;
        }
        
        try{
            var svg=prm.svg;                                    
            svg.AddRect({
                containerId: prm.containerId,
                selfId: prm.selfId,

                x: start.x,
                y: start.y,
                width: w,
                height: h,
                
                stroke_dasharray: ""
            });
        }catch(err){
            console.log(err);
        }
    };
    
    __constructor(prm);
};