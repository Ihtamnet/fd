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
            if (typeof prm === "object"){
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
            }
        }catch(err){
            console.log(err);
        }
    };
    
    //ФУНКЦІЇ ІНІЦІАЛІЗАЦІЇ ПАРАМЕТРІВ
    
    //встановити для локальних параметрів ГП глобальні значення
    var SetGlobalMeanForLocalPrm=function(){
        stroke_=stroke;
        stroke_width_=stroke_width;
        fill_=fill;
        fill_opacity_=fill_opacity;
        stroke_dasharray_=stroke_dasharray;
    };
    
    //встановити локальні параметри для поточного ГП
    var SetLocalPrm=function(){
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
    
    //ДОПОМІЖНІ ФУНКЦІЇ
    
    //додавання графічного примітиву elem у кінець контейнера з вказаним id
    //elem - html-розмітка примітиву
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
    
    //добуток матриць
    var ProdMatrix=function(m1, m2, asArray){
        var result="";
        
        try{            
            var a=m1[0]*m2[0]+m1[2]*m2[1];
            var b=m1[1]*m2[0]+m1[3]*m2[1];
            var c=m1[0]*m2[2]+m1[2]*m2[3];
            var d=m1[1]*m2[2]+m1[3]*m2[3];
            var e=m1[0]*m2[4]+m1[2]*m2[5]+m1[4];
            var f=m1[1]*m2[4]+m1[3]*m2[5]+m1[5];
            
            if (asArray)
                result=new Array(a, b, c, d, e, f);
            else
                result="matrix("+a+" "+b+" "+c+" "+d+" "+e+" "+f+")";
        } catch (err){
            console.log(err);
        }
        
        return result;
    };
    
    //ФУНКЦІЇ ГЕНЕРУВАННЯ HTML-РОЗМІТКИ ГРАФІЧНИХ ПРИМІТИВІІ
    
    //прямокутник
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
    
    //стрілка
    //стрілка
    self.AddArrow=function(prm){
        try{            
            
            var A={x: 30, y: 200};
            var B={x: 200, y: 30};
            var h=20;
            var w=15;
            var id="idArrow_"+Math.random(1000);
            
            SetLocalPrm();
                        
            if (typeof prm !== "undefined"){
                
                SetExternalPrm(prm);   
                
                if (typeof prm.id !== "undefined")
                    id=" id='"+prm.id+"' ";
                                                                                                
                if (typeof prm.A !== "undefined")
                    A=prm.A;
                if (typeof prm.B !== "undefined")
                    B=prm.B;
                if (typeof prm.h !== "undefined")
                    h=prm.h;
                if (typeof prm.w !== "undefined")
                    w=prm.w;
                
                //!!!!!!!!!!!
                if (typeof prm.pendant !== "undefined"){                   
                    var v=new CVector2D({A: A, B: B});                                                          
                    A=v.GetPsetOnNormal(parseInt(prm.pendant), "A", "L");
                    B=v.GetPsetOnNormal(parseInt(prm.pendant), "B", "L");                                                                                
                }
                
                //
            }                        
            
            var w2=w/2;
            var C={x: 0, y: 0};
            var D={x: -w2, y: h};
            var E={x: w2, y: h};
            var F={x: 0, y: 0.75*h};
                     
            var alf=0;
            var xAB=B.x-A.x;
            var yAB=B.y-A.y;
            if (Math.abs(xAB)<0.001){
                if (yAB>0)
                    alf=Math.PI;                
            }else{
                alf=-Math.atan(xAB/yAB);
                if (yAB>=0)
                    alf+=Math.PI;
            }
                                                                                                
            //var m0=new Array(1, 0, 0, 1, 0, 0);
            var m1=new Array(Math.cos(alf), Math.sin(alf), -Math.sin(alf), Math.cos(alf), 0, 0);
            var m2=new Array(1, 0, 0, 1, B.x, B.y);
            var transform=ProdMatrix(m2, m1);                        
                                    
            var element="<g "+id+" style='stroke:"+stroke_+";stroke-width:"+stroke_width_+";' >";
            element+="<line x1='"+A.x+"' y1='"+A.y+"' x2='"+B.x+"' y2='"+B.y+"'></line>";                        
            element+="<path d='M"+E.x+" "+E.y+" L"+C.x+" "+C.y+" L"+D.x+" "+D.y;
            element+=" Q"+F.x+" "+F.y+" "+E.x+" "+E.y+" z' fill='"+fill_+"' stroke='"+stroke_+"' ";
            element+="transform='"+transform+"' ></path>";            
            if (typeof prm.double !== "undefined" && prm.double===true){
                var alfD=alf+Math.PI;
                var m1=new Array(Math.cos(alfD), Math.sin(alfD), -Math.sin(alfD), Math.cos(alfD), 0, 0);
                var m2=new Array(1, 0, 0, 1, A.x, A.y);
                var transformD=ProdMatrix(m2, m1);
                                
                element+="<path d='M"+E.x+" "+E.y+" L"+C.x+" "+C.y+" L"+D.x+" "+D.y;
                element+=" Q"+F.x+" "+F.y+" "+E.x+" "+E.y+" z' fill='"+fill_+"' stroke='"+stroke_+"' ";
                element+="transform='"+transformD+"' ></path>";                
            }
            
            //є підвіси або напис
            if (typeof prm.pendant !== "undefined" || typeof prm.label !== "undefined"){
                var alfL=alf-Math.PI/2;
                m1=new Array(Math.cos(alfL), Math.sin(alfL), -Math.sin(alfL), Math.cos(alfL), 0, 0);
                m2=new Array(1, 0, 0, 1, A.x, A.y);
                transform=ProdMatrix(m2, m1);
            
                //підвіси стрілки
                if (typeof prm.pendant !== "undefined"){
                    var hp=-prm.pendant;
                    m2=new Array(1, 0, 0, 1, B.x, B.y);
                    transformD=ProdMatrix(m2, m1);
                    element+="<line x1=0 y1=3 x2=0 y2="+hp+" transform='"+transform+"'></line>";
                    element+="<line x1=0 y1=3 x2=0 y2="+hp+" transform='"+transformD+"'></line>";
                }
            
                //напис над стрілкою
                if (typeof prm.label !== "undefined"){                
                    var labelStyle="";
                    var labelClass="";
                    var labelDX=10;
                    var labelDY=-5;
                    if (typeof prm.labelDX !== "undefined")
                        labelDX=prm.labelDX;
                    if (typeof prm.labelDY !== "undefined")
                        labelDY=prm.labelDY;
                    
                    if (typeof prm.alignLabel !== "undefined"){                        
                        var seg=new CSegment2D({
                            v1: A,
                            v2: B
                        });
                        switch (prm.alignLabel){
                            case "center":{
                                labelDX=seg.GetLength()/2-15;
                                break;
                            }
                            case "right":{
                                labelDX=seg.GetLength()-55;
                                break;
                            }
                        }
                    }
                                    
                    if (typeof prm.labelStyle !== "undefined")
                        labelStyle="style='"+prm.labelStyle+"'";
                    if (typeof prm.labelClass !== "undefined")
                        labelClass="class='"+prm.labelClass+"'";
                    element+="<text "+labelStyle+" "+labelClass+" x="+labelDX+" y="+labelDY;
                    element+=" transform='"+transform+"'>"+prm.label+"</text>";
                }
            }
            element+="</g>";
            
            AddElement(prm.containerId, element);
            
        } catch (err){
            console.log(err);
        }
        
        return element;
    };        
    
    
    
    __constructor(prm);
} ;