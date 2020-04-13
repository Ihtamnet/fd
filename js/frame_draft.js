"use strict";

//псевдоклас рамки лінійних розмірів креслення 
var CFrameDraft=function(prm){
    var self=this;
    
    var svg=null;
    
    var width=500;  //ширина у пікселах
    var height=300; //висота у пікселах
    
    const min_size=10;
    const max_size=5000;
    
    var scale=3; //масштаб: кількість мм в одному пікселі
    
    var containerId=""; //Id контейнера у якому зображатиметься рамка
    
    var __constructor=function(prm){                
        try{
            svg=prm.svg;
            if (prm.width > min_size && prm.width < max_size)
                width=prm.width;
            if (prm.height > min_size && prm.height < max_size )
                height=prm.height;
            scale=prm.scale;
            containerId=prm.containerId;
            
            console.log("w, h: ", width, height);
            
            AddToDraft();
        }catch (err){
            console.log(err);
        }                
    };
    
    var AddToDraft=function(){
        try{
            var container=document.getElementById(containerId); console.log(window.getComputedStyle(container).width);
            var x=parseInt((parseInt(window.getComputedStyle(container).width)-width)/2);
            var y=parseInt((parseInt(window.getComputedStyle(container).height)-height)/2);
                                    
            svg.AddRect({
                containerId: containerId,
                selfId: "frameDraft",
                x: x,
                y: y,
                width: width,
                height: height,
                stroke: "rgb(8, 8, 8)",
                stroke_width: 1,
                stroke_dasharray: "5, 5"                
            });
        }catch(err){
            console.log(err);
        }
    };
    
    __constructor(prm);    
};