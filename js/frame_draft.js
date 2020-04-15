"use strict";

//псевдоклас рамки лінійних розмірів креслення 
var CFrameDraft=function(prm){
    var self=this;
    var parent=prm.parent; //!!!
    
    var svg=null;
    
    var width=5;  //ширина у метрах
    var height=3; //висота у метрах
    
    var width_pxl=0; //ширина у пікселах
    var height_pxl=0; //висота у пікселах
    
    const min_size=10;
    const max_size=5000;
    
    var scale=150; //масштаб: кількість пікселів в одному метрі
    
    var containerId=""; //Id контейнера у якому зображатиметься рамка
    
    var __constructor=function(prm){                
        try{
            svg=prm.svg;
            if (prm.width > min_size && prm.width < max_size)
                width=prm.width;
            if (prm.height > min_size && prm.height < max_size )
                height=prm.height;
            width_pxl=parent.MtToPixels(width);
            height_pxl=parent.MtToPixels(height);
            scale=prm.scale;
            containerId=prm.containerId;
            
            //
            console.log("w, h: ", width, height);
            console.log(prm);
            
            AddToDraft();
        }catch (err){
            console.log(err);
        }                
    };
    
    var AddToDraft=function(){
        try{            
            
            var container=document.getElementById(containerId); console.log(window.getComputedStyle(container).width);
            var x=parseInt((parseInt(window.getComputedStyle(container).width)-width_pxl)/2);
            var y=parseInt((parseInt(window.getComputedStyle(container).height)-height_pxl)/2);
            
            //мітка масштабу креслення
            var lo=50;
            var cs=parseInt(scale/lo);       
            svg.AddLabelScale({
                containerId: containerId,
                x: x+width_pxl-scale,
                y: 20,
                lengthOrt: lo,
                cScale: cs
            });
                 
            //прямокутник лінійних розмірів креслення
            svg.AddRect({
                containerId: containerId,
                selfId: "frameDraft",
                x: x,
                y: y,
                width: width_pxl,
                height: height_pxl,
                stroke: "rgb(8, 8, 8)",
                stroke_width: 1,
                stroke_dasharray: "5, 5"                
            });
            
            //стрілка лінійного розміру довжини
            svg.AddArrow({
                containerId: containerId,
                id: "dfArrowBottom",
                double: true,
                A: {
                    x: x,
                    y: y+height_pxl
                },
                B: {
                    x: x+width_pxl,
                    y: y+height_pxl
                },
                pendant: 30,
                label: width,
                alignLabel: "center"
            });
                        
            //стрілка лінійного розміру висоти
            svg.AddArrow({
                containerId: containerId,
                id: "dfArrowLeft",
                double: true,
                A: {
                    x: x,
                    y: y
                },
                B: {
                    x: x,
                    y: y+height_pxl
                },
                pendant: 30,
                label: height,
                alignLabel: "center"
            });
            
        }catch(err){
            console.log(err);
        }
    };
    
    __constructor(prm);    
};