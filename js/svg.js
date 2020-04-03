"use strict";

//вигляд - псевдоклас для динамічної побудови svg-примітивів
var CSvg=function(prm){
    var self=this;
    
    var um="px"; //одиниця вимірювання
                   
    //глобальні параметри (парамтери за замовчуванням)
    var stroke="black";         //колір лінії
    var stroke_width=1;         //товщина лінії
    var stroke_dasharray="";    //штрих-пунктир для лінії
    var fill="white";           //колір заливки
    var fill_opacity=1;         //прозорість заливки (від 1 - без прозорості до 0 - повна прозорість)
    
    //локальні параметри у зображенні поточного графічного примітива (ГП)
    var stroke_=stroke;
    var stroke_width_=stroke_width;
    var fill_=fill;
    var fill_opacity_=fill_opacity;
    var stroke_dasharray_=stroke_dasharray;
    
    var __constructor=function(prm){
        try{
            if (typeof prm.stroke !== "undefined")
                stroke=prm.stroke;
            if (typeof prm.stroke_width !== "undefined")
                stroke_width=prm.stroke_width;
            if (typeof prm.fill !== "undefined")
                fill=prm.fill;
            if (typeof prm.fill_opacity !== "undefined")
                fill_opacity=prm.fill_opacity;
            if (typeof prm.stroke_dasharray !== "undefined")
                stroke_dasharray=prm.stroke_dasharray;
            
        }catch(err){
            console.log(err);
        }
    };
    
    //встановити для локальних параметрів ГП глобальні значення
    var SetGlobalMeanForLocalPrm=function(){
        stroke_=stroke;
        stroke_width_=stroke_width;
        fill_=fill;
        fill_opacity_=fill_opacity;
        stroke_dasharray_=stroke_dasharray;
    };
    
    //призначити локальним параметрам ГП значення із зовнішнього об*єкту prm
    var SetExternalPrm=function(prm){
        if (typeof prm.stroke !== "undefined")
            stroke_=prm.stroke;
        if (typeof prm.stroke_width !== "undefined")
            stroke_width_=prm.stroke_width;
        if (typeof prm.fill !== "undefined")
            fill_=prm.fill;
        if (typeof prm.fill_opacity !== "undefined")
            fill_opacity_=prm.fill_opacity;
        if (typeof prm.stroke_dasharray !== "undefined")
            stroke_dasharray_=prm.stroke_dasharray;
    };
    
    //
    var AddElement=function(idCtr, elem){
        try{
            
            var obj=document.getElementById(idCtr);
                
            //
            obj.innerHTML=obj.innerHTML+elem;
            
            /*            
            var objEl=null;
            for(var tag in elem){
                objEl=document.createElement(tag);                
                var attrs=elem[tag];
                for(var _attr in attrs){
                    objEl.setAttribute(_attr, attrs[_attr]);
                }
            }
            obj.prepend(objEl);            
            //obj.innerHTML=obj.innerHTML;                                   
            //*/
        }catch (err){
            console.log(err);
        }
    };
    
    //
    self.AddRect=function(prm){                        
        
        var result=1;
                                                        
        try{
        
            SetExternalPrm(prm);
        
            //*
            var element="<rect id='"+prm.selfId+"' x='"+prm.x+um+"' y='"+prm.y+um+
                        "' width='"+prm.width+um+"' height='"+prm.height+um+"' "+
                        "style='stroke:"+stroke_+";stroke-width:"+stroke_width_+"; "+
                        "stroke-dasharray: "+stroke_dasharray_+";"+
                        "fill: "+fill_+"; fill-opacity: "+fill_opacity_+";'></rect>";
            //*/          
              
            /*
            var style="stroke: "+stroke_+"; stroke-width: "+stroke_width_+"; "+
                      "fill: "+fill_+"; fill-opacity: "+fill_opacity_;
            var element={
                rect: {
                    id     : prm.selfId,
                    x      : prm.x+um,
                    y      : prm.y+um,
                    width  : prm.width+um,
                    height : prm.height+um,
                    style  : style
                }
            };
            //*/
            
            AddElement(prm.containerId, element);
        } catch ( err ){
            result=0;
            console.log(err);
        }            
        
        return result;
    };
    
    __constructor(prm);
} ;