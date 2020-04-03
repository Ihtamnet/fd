"use strict";

//клас динамічного створення SVG-примітивів
var CSvg=function(prm){
    var self=this;
        
    //
    var mask="[\\w,\\s,:,;,',\",=,-]*";    
    var _tag="><\\/\\w*>";
    var maskCoords="\w*[0-9]+,?\\s*\w*[0-9]+";
    
    var mouseSensitivity=4;
    
    var svg_="<svg>";
    var _svg="</svg>";
    
    var objContainer=null;
    var idCanvas="idCanvas";
    this.GetIdCanvas=function(){return idCanvas;};
    
    var objCanvas=null;
    var width=0;
    var height=0;
    
    var idElements=Array();
    
    //глобальні параметри
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
    
    //глобальний нумератор вершин
    var global_number_vertex=0;
    
    //параметри курсора-прицілу
    var sightR=5;
    var sightD=3;
    
    //колір напрямних
    var stroke_guide="#1D2949";
    
    //зсув центрів розширених примітивів для їх приховування з області відображення
    var offsetX=0;
    var offsetY=0;
    
    //величина коригування вказівника стрілки
    var qArrow=2;
    this.GetQArrow=function(){return qArrow;};
    
    this.GetOffsetX=function(){return offsetX;};
    this.GetOffsetY=function(){return offsetY;};

    //
    if (typeof prm !=="undefined"){
        if (typeof prm.idCanvas !== "undefined")
            idCanvas=prm.idCanvas;       
        
        if (typeof prm.drawing !== "undefined"){
            ;
        }
        
        if (typeof prm.idContainer !== "undefined"){  
            var selector="#";
            if (typeof prm.selector !== "undefined")
                selector=prm.selector;
            objContainer=$(selector+prm.idContainer);
            if (objContainer){  
                width=parseInt(objContainer.css("width"));
                height=parseInt(objContainer.css("height"));
                var html="<svg id='"+idCanvas+"' width='"+width+"' height='"+height+"'></svg>";                
                objContainer.html(html);
                
                console.log(objContainer);
                
                //
                objCanvas=$("#"+idCanvas);                
            }
        }
    }
        
    //параметри лінії курсорів додавання перестінків
    var CursorLineAddInsideWall={
        stroke: "grey",
        stroke_dasharray: "2 7 6"
    };
    
    //встановити наявність або відсутність тегів svg
    SetSvgTag=function(add){
        svg_="";
        _svg="";
        if (add){
            svg_="<svg>";
            _svg="</svg>";
        };
    };
    
    //додавання елементу до сцени
    AddElement=function(add, element){
        if (add)
            objCanvas.append(element);
    };
    
    //встановити локальні параметри для поточного ГП
    SetLocalPrm=function(){
        stroke_=stroke;
        stroke_width_=stroke_width;
        fill_=fill;
        fill_opacity_=fill_opacity;
        stroke_dasharray_=stroke_dasharray;
    };
    
    //призначити локальним параметрам ГП значення глобальних параметрів сцени
    SetExternalPrm=function(prm){
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
    
    //використати id для графічного примітива (ГП)
    UseID=function(prm){
        var result="";
        if (typeof prm.id !=="undefined"){
            result+="id='"+prm.id+"' ";
            idElements.push(prm.id);
        }
        
        return result;
    };
    
    //видалити сцену
    this.RemoveScene=function(){objCanvas.html("");};
    
    //перемалювати сцену
    //this.RedrawScene=function(){objCanvas.html(scene);};
    
    //отримати текстовий вміст сцени
    this.GetScene=function(){return objCanvas.html();};
    
    //редагувати елемент з вказаним id
    this.EditElement=function(id, prm){        
        if (typeof id !== "undefined" && typeof prm !== "undefined" && prm instanceof Object){
            var element=$("#"+id);
            
            for (var attr in prm){
                if (element.attr(attr))
                    element.attr(attr, prm[attr]);
                else
                    if (element.css(attr))
                        element.css(attr, prm[attr]);
            }                       
        }
    };
    
    //видалити ГП з вказаним id
    this.Remove=function(id){
        if (typeof id!== "undefined"){                        
           for(var i=0; i<idElements.length; i++){
                if (idElements[i]===id){
                    idElements.splice(i, 1);
                    break;
                }
            }
           ($("#"+id)).remove();
        }
    };
    
    //перемістити ГП на рівень вниз
    this.ToDown=function(id){
        /*if (typeof id!== "undefined"){
            var dLocal="<"+mask+id+mask+_tag;
            var localMask="<"+mask+_tag+dLocal;
            var reg=new RegExp(localMask);
            var ds=scene.match(reg);            
            if (ds){
                var reg2=new RegExp(dLocal);
                var down=ds[0].match(reg2);            
                var result=down[0]+ds[0].replace(down[0], "");
            
                scene=scene.replace(ds[0], result);            
                self.RedrawScene();                                                
            }
        }*/
    };
    
    //перемістити ГП на рівень вгору
    this.ToUp=function(id){
        /*if (typeof id!== "undefined"){
            var dLocal="<"+mask+id+mask+_tag;
            var localMask=dLocal+"<"+mask+_tag;
            var reg=new RegExp(localMask);
            var ds=scene.match(reg);            
                                    
            if (ds){
                var reg2=new RegExp(dLocal);
                var up=ds[0].match(reg2);            
                var result=ds[0].replace(up, "")+up;
                
                scene=scene.replace(ds[0], result);                
                self.RedrawScene();                                                
            }
        }*/
    };
        
    //вставляння вершини point в параметр points так, щоб ця вершина 
    //розташовувалася між двома вже існуючими  вершнами... тут є нюанси, які потрібно врахувати ...
    //якщо скалярний добуток векторів, що виходять з point і напрямлені на дві сусідні вершини 
    //менший від нуля (кут між векторами тупий), то саме ці дві вершини і є вершинами між якими потрібнно здійснити
    //вставляння нової вершини point. якщо ж усі скалярні добутки виявляться додатніми, то це означає,
    //що point лежить делеко від довільної пари сусідніх вершин і вставляння нової вершини відбувається у кінець полігону
    //якщо ж буде знайдено кілька від*ємних скалярних добутків, то вставляння вершини відбудеться лише біля пршої знайденої пари
    this.InsertPoint=function(point, points){
        var result="";
        
        try{
            var reg=new RegExp(maskCoords, "g");
            var reg2=new RegExp("[0-9]+", "g");
            var arrPoints=points.match(reg);
            var ins=false;
            if (arrPoints){
                var pset={};
                var pPset={};
                var i=0;
                for(var idx in arrPoints){                    
                    pPset=pset;                   
                    pset=arrPoints[idx].match(reg2);
                    if (i>0){
                        var v=new CVector2D;
                        var scalar=v.GetScalarProd(point, {x: pPset[0], y: pPset[1]}, {x: pset[0], y: pset[1]});
                        if (scalar<0 && !ins){
                            result+=point.x+" "+point.y+" ";
                            ins=true;
                        }
                    }
                    result+=pset[0]+" "+pset[1]+" ";
                    i++;
                }
                if (!ins)
                    result+=point.x+" "+point.y+" ";
            }else
                result+=point.x+" "+point.y;
        }catch (err){
            console.log(err);
        }
        
        return result;
    };
    
    //отримання масиву відрізків з рядкової величини, що містить координати вершин, розділені пробілом або комою
    this.GetArraySegments=function(points){
        var result=Array();
        
        try{
            var reg=new RegExp(maskCoords, "g");
            var reg2=new RegExp("[0-9]+", "g");
            var arrPoints=points.match(reg);          
            if (arrPoints){
                var fPset={};
                var pset={};
                var pPset={};
                var i=0;
                for(var idx in arrPoints){                    
                    pPset=pset;                   
                    pset=arrPoints[idx].match(reg2);
                    if (i===0)
                        fPset=pset;
                    if (i>0){
                        var segment=new CSegment2D({
                            v1: {x: pPset[0], y: pPset[1]},
                            v2: {x: pset[0], y: pset[1]}
                        });
                        result.push(segment);
                    }                    
                    i++;
                }
                if (points.indexOf("z")>0 || points.indexOf("Z")>0){
                    segment=new CSegment2D({
                        v1: {x: pset[0], y: pset[1]},
                        v2: {x: fPset[0], y: fPset[1]}
                    });
                    result.push(segment);
                }
            }
        }catch (err){
            console.log("error CSvg.GetArraySegments: ", err);
        }
        
        return result;
    };
    
    //пошук у масиві відрізків segments найближчого відрізка (і точки перетину на ньому), який перетинається
    //променем typeRay, що виходить з деякої точки pset і паралельний одній з координатних осей
    //typeRay==="L|l" - промінь паралельний осі абсцис і напрямлений від точки pset ліворуч
    //typeRay==="R|r" - промінь паралельний осі абсцис і напрямлений від точки pset праворч
    //typeRay==="T|t" - промінь паралельний осі ординат і напрямлений від точки pset вгору
    //typeRay==="B|b" - промінь паралельний осі ординат і напрямлений від точки pset вниз
    this.SearchNearestSegmentForRey=function(pset, segments, typeRay){        
        typeRay=typeRay.toUpperCase();
        try{
            var xRes=-1000;
            var yRes=-1000;
            var nS=-1;
            var cur_xRes=xRes;
            var cur_yRes=yRes;            
            
            var minD=10000;
            var curD=10000;
            
            var segment=null;
            var arg=pset.x;
            var rezPset=pset.y;
            var res=0;
            var typeArg="x";
            if (typeRay==="L" || typeRay==="R"){
                arg=pset.y;
                rezPset=pset.x;
                typeArg="y";
            }
            var i=0;
            for (var idx in segments){
                segment=segments[idx];
                segment.CalcCoefStraight();
                
                //!!!!!!!!!!!!!
                //console.log(segment.GetCoefStraight());
                
                res=segment.GetXorY(arg, typeArg);
                if (res>-1000 && 
                    (typeRay==="L" && res<pset.x || 
                     typeRay==="R" && res>pset.x ||
                     typeRay==="B" && res<pset.y ||
                     typeRay==="T" && res>pset.y) 
                   ){                    
                    if (typeArg==="x"){
                        cur_xRes=arg;
                        cur_yRes=res;                            
                    }else{
                        cur_xRes=res;
                        cur_yRes=arg;                           
                    }
                    if (i>0){                        
                        curD=Math.abs(res-rezPset);
                        if (curD<minD){
                            minD=curD;
                            xRes=cur_xRes;
                            yRes=cur_yRes;
                            nS=idx;
                        }
                    }else{
                        minD=Math.abs(res-rezPset);
                        nS=0;
                        xRes=cur_xRes;
                        yRes=cur_yRes;
                    }
                }
                i++;
            }
        }catch (err){
            console.log("CSvg.SearchNearestSegmentForRey: ", err);
        }
        
        return {pset: {x: xRes, y: yRes}, nSegment: nS};
    };
    
    //пошук найблищої вершини елемента з вказаним id до точки pset
    this.SearchNearVertex=function(id, pset, first){
        var result=new Array();
        
        try{
            var points=$("#"+id).attr("points");
            if (!points)
                points=$("#"+id).attr("d");
            if (points){
                var reg=new RegExp(maskCoords, "g");
                var reg2=new RegExp("[0-9]+", "g");
                var arrPoints=points.match(reg);
                if (arrPoints){
                    var point={};
                    for(var idx in arrPoints){
                        point=arrPoints[idx].match(reg2);
                        if (typeof point[0] !== "undefined" && typeof point[1] !== "undefined"){                                                                            
                            if (Math.abs(pset.x-parseInt(point[0]))<mouseSensitivity &&
                                Math.abs(pset.y-parseInt(point[1]))<mouseSensitivity){
                                result.push({x: point[0], y: point[1]});
                                if (first)
                                    break;
                            }
                        }                                                                                    
                    }
                }
            }
        }catch (err){
            console.log(err);
        }
        
        return result;
    };
    
    //пошук найблищої вершини усіх елементів сцени до точки pset
    this.SearchElementNearVertex=function(pset, first){
        var result=new Array();
        
        try{            
            var points=new Array();
            for(var i=0; i<idElements.length; i++){
                points=self.SearchNearVertex(idElements[i], pset, first);
                if (points.length)
                    result[idElements[i]]=points;
            }
        }catch (err){
            console.log(err);
        }
        
        return result;
    };
    
    //
    
    //переміщення вершини pset елемента з вказаним id у точку move
    this.MoveVertex=function(id, pset, move, remove){
        
        try{        
            var element=$("#"+id);
            
            var mAttr="points";
            var attr=element.attr(mAttr);
            if (!attr){
                mAttr="d";
                attr=element.attr(mAttr);
            }
           
            var reg=new RegExp("\w*\\s*"+pset.x+",?\\s*\w*\\s*"+pset.y);
            var st=attr.match(reg);
                    
            var reg2=new RegExp("\w", "g");
            var letter=st[0].match(reg2);
            var L1="";
            var L2="";
            if (letter){
                if (typeof letter[0] !== "undefined")
                    L1=letter[0];
                if (typeof letter[1] !== "undefined")
                    L2=letter[1];
            }
            
            var rep=" ";
            if (!remove)
                rep=" "+L1+move.x+" "+L2+move.y+" ";
            
            attr=attr.replace(st[0], rep);
            element.attr(mAttr, attr);                
                                    
        } catch (err){
            console.log(err);
        }
    };
    
    //видалення вершини pset елемента з вказаним id 
    this.RemoveVertex=function(id, pset){
        this.MoveVertex(id, pset, null, true);
    };
    
    //перетворення рядка на зразок "matrix(0, 1.25, 4.48, -3.58, 2.36, -8.69)" у масив дійсних чисел
    ParseToMatrix=function(str){
        var result=new Array();
        
        try{
            var reg=new RegExp("-?[0-9.]+", "g");
            result=str.match(reg);
            for(var i=0; i<result.length; i++)
                result[i]=parseFloat(result[i]);
        } catch (err){
            console.log(err);
        }
        
        return result;
    };
    
    //добуток матриць
    ProdMatrix=function(m1, m2, asArray){
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
    
    //переміщення елементу або групи з вказаним id на вектор vector
    this.Translate=function(id, vector){
        try{
            var element=$("#"+id);
            var oldTransform=element.attr("transform");
            var m1=Array(1, 0, 0, 1, 0, 0);
            if (typeof oldTransform !== "undefined")
                m1=ParseToMatrix(oldTransform);            
            var m2=Array(1, 0, 0, 1, vector.x, vector.y);
            element.attr("transform", ProdMatrix(m1, m2));
        } catch (err){
            console.log(err);
        }
    };
    
    //поворот елементу або групи з вказаним id на кут alf (градуси, за годинниковою стрілкою) відносно точки pset
    // ??? Після повороту переміщення працює криво ???
    this.Rotate=function(id, alf, pset){
        try{
            var element=$("#"+id);            
            var oldTransform=element.attr("transform");
            var m1=Array(1, 0, 0, 1, 0, 0);
            if (typeof oldTransform !== "undefined")
                m1=ParseToMatrix(oldTransform);            
            var m2=new Array(1, 0, 0, 1, pset.x, pset.y); 
            var alfRad=Math.PI*alf/180;
            var m3=new Array(Math.cos(alfRad), Math.sin(alfRad),-Math.sin(alfRad), Math.cos(alfRad), 0, 0);
            var m4=new Array(1, 0, 0, 1, -pset.x, -pset.y);
            var prod=ProdMatrix(m1, m2, true);
            prod=ProdMatrix(prod, m3, true);                            
            element.attr("transform", ProdMatrix(prod, m4));
        } catch (err){
            console.log(err);
        };
    };
    
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //БАЗОВІ ГРАФІЧНІ ПРИМІТИВИ
    
    //пряма     
    this.Line=function(prm){                
                        
        if (objCanvas){
            var add=true;
            var x1=50;
            var y1=50;
            var x2=100;
            var y2=50;
            
            SetLocalPrm();
            
            var id="";
            if (typeof prm !== "undefined"){
                SetExternalPrm(prm);
                id=UseID(prm);
                
                if (typeof prm.add !== "undefined")
                    add=prm.add;
                if (typeof prm.x1 !== "undefined")
                    x1=prm.x1;
                if (typeof prm.y1 !== "undefined")
                    y1=prm.y1;
                if (typeof prm.x2 !== "undefined")
                    x2=prm.x2;
                if (typeof prm.y2 !== "undefined")
                    y2=prm.y2;                
            }
            
            SetSvgTag(add);
                                
            var element=svg_+"<line "+id+" x1='"+x1+"' y1='"+y1+"' x2='"+x2+"' y2='"+y2+"' ";
            element+="style='stroke:"+stroke_+";stroke-width:"+stroke_width_+"; stroke-dasharray: "+stroke_dasharray_+";'></line>"+_svg;
                    
            AddElement(add, element);                
        }
        
        return element;
    };
    
    //прямокутник
    this.Rect=function(prm){
        var element="";
        if (objCanvas){
            var add=true;
            var x=10;
            var y=10;
            var width=200;
            var height=120;
            
            SetLocalPrm();
            
            var id="";
            if (typeof prm !== "undefined"){
                SetExternalPrm(prm);
                id=UseID(prm);
                
                if (typeof prm.add !== "undefined")
                    add=prm.add;
                if (typeof prm.x !== "undefined")
                    x=prm.x;
                if (typeof prm.y !== "undefined")
                    y=prm.y;
                if (typeof prm.width !== "undefined")
                    width=prm.width;
                if (typeof prm.height !== "undefined")
                    height=prm.height;
            }
            
            SetSvgTag(add);
            
            element=svg_+"<rect "+id+" x='"+x+"' y='"+y+"' width='"+width+"' height='"+height+"' ";
            element+="style='stroke:"+stroke_+";stroke-width:"+stroke_width_+"; fill: "+fill_+"; fill-opacity: "+fill_opacity_+";'>";
            element+="</rect>"+_svg;
                    
            AddElement(add, element);
        }
        
        return element;
    };
    
    //коло
    this.Circle=function(prm){                
        var element="";
        if (objCanvas){
            var add=true;
            var cx=50;
            var cy=50;
            var r=100;            
            
            SetLocalPrm();
            
            var id="";
            if (typeof prm !== "undefined"){
                SetExternalPrm(prm);
                id=UseID(prm);
                
                if (typeof prm.add !== "undefined")
                    add=prm.add;
                if (typeof prm.cx !== "undefined")
                    cx=prm.cx;
                if (typeof prm.cy !== "undefined")
                    cy=prm.cy;
                if (typeof prm.r !== "undefined")
                    r=prm.r;                
            }
            
            SetSvgTag(add);
                                
            element=svg_+"<circle "+id+" cx='"+cx+"' cy='"+cy+"' r='"+r+"' ";
            element+="style='stroke:"+stroke_+";stroke-width:"+stroke_width_+"; fill: "+fill_+"'>";
            element+="</circle>"+_svg;
                    
            AddElement(add, element);
        }
        
        return element;
    };
    
    //еліпс
    this.Ellipse=function(prm){
        var element;
        if (objCanvas){
            var add=SetPrm(prm, "add", true);
            var cx=SetPrm(prm, "cx", 0);
            var cy=SetPrm(prm, "cy", 0);
            var rx=SetPrm(prm, "rx", 100);
            var ry=SetPrm(prm, "ry", 50);
            var style=SetPrm(prm, "style", "");
            var class_=SetPrm(prm, "class_", "");   
            
            if (style) style="style='"+style+"' ";
            if (class_) class_="class='"+class_+"' ";
            
            SetSvgTag(add);
            
            element=svg_+"<ellipse cx='"+cx+"' cy='"+cy+"' rx='"+rx+"' ry='"+ry+"' ";
            element+=style+class_+">";
            element+="</ellipse>"+_svg;
            
            AddElement(add, element);
        }
    };
    
    //ламана або багатокутник
    Poly=function(prm){
                        
        if (objCanvas){
            var add=true;
            
            var points="10,10, 40,10, 40,40, 10,40";
            
            SetLocalPrm();
            
            var id="";
            if (typeof prm !== "undefined"){
                SetExternalPrm(prm);
                id=UseID(prm); 
                
                if (typeof prm.add !== "undefined")
                    add=prm.add;
                
                var setType=false;
                if (typeof prm.type === "undefined")
                    setType=true;
                else
                    if (prm.type !== "polyline" && prm.type !== "polygon")
                        setType=true;                   
                if (setType){
                    prm.type="polyline";
                    fill_="none";
                }
                if (prm.type==="polyline")
                    fill_="none";
                                                                
                if (typeof prm.points !== "undefined")
                    points=prm.points;
                else
                if (typeof prm.psets !== "undefined" && prm.psets instanceof Object){ 
                    points="";                    
                    for (var idx in prm.psets){
                        var pset=prm.psets[idx];
                        if (typeof pset.x !== "undefined" && typeof pset.y !== "undefined")
                            points+=pset.x+" "+pset.y+" ";                        
                    }                                        
                }                                                                
            }
            
            SetSvgTag(add);
                                    
            var element =svg_+"<"+prm.type+" "+id+" points='"+points+"' ";
            element+="style='stroke:"+stroke_+";stroke-width:"+stroke_width_+";fill:"+fill_+";'></"+prm.type+">"+_svg;
            
            AddElement(add, element);
        }
        
        //
        
        return element;
    };
    
    //ламана
    this.Polyline=function(prm){
        if (typeof prm === "undefined")
            var prm={};        
        prm.type="polyline";
        return Poly(prm);
    };
    
    //багатокутник
    this.Polygon=function(prm){
        if (typeof prm === "undefined")
            var prm={};        
        prm.type="polygon";
        return Poly(prm);
    };
    
    //шлях
    this.Path=function(prm){
        if (objCanvas){
            var add=true;
            
            var d="10,10, 40,10, 40,40, 10,40";
            var classPath=SetPrm(prm, "class", "");
            var stylePath=SetPrm(prm, "style", "");
            var transformPath=SetPrm(prm, "transform", "");
            
            SetLocalPrm();
            
            var id="";
            if (typeof prm !== "undefined"){
                SetExternalPrm(prm);
                id=UseID(prm); 
                
                if (typeof prm.add !== "undefined")
                    add=prm.add;
                                                                                                
                if (typeof prm.d !== "undefined")
                    d=prm.d;                
            }
            
            if (classPath)
                classPath="class='"+classPath+"'";
            if (stylePath)
                stylePath="style='"+stylePath+"'";
            if (transformPath)
                transformPath="transform='"+transformPath+"'";
            
            SetSvgTag(add);
                                    
            var element=svg_+"<path "+id+" d='"+d+"' "+classPath+" "+stylePath+" "+transformPath+" ";
            element+="style='stroke:"+stroke_+";stroke-width:"+stroke_width_+";fill:"+fill_+";'></path>"+_svg;
            
            AddElement(add, element);
        }
        
        return element;
    };
    
    //текст
    this.Text=function(prm){
        var add=SetPrm(prm, "add", true);
        var id=UseID(prm);        
        var text=SetPrm(prm, "text", "TEXT");
        var classText=SetPrm(prm, "class", "");
        var styleText=SetPrm(prm, "style", "");
        
        if (classText.length>0)
            classText="class='"+classText+"'";
        if (styleText.length>0)
            styleText="style='"+styleText+"'";
        
        SetSvgTag(add);
        
        var element=svg_+"<text "+id+" "+classText+" "+styleText+" x=0 y=0 >";
        element+=text+"</text>"+_svg;
        
         AddElement(add, element);
    };
    
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //РОЗШИРЕНІ ГРАФІЧНІ ПРИМІТИВИ
    
    //стрілка
    this.Arrow=function(prm){
        try{
            var add=true;
            
            var A={x: 30, y: 200};
            var B={x: 200, y: 30};
            var h=20;
            var w=15;
            
            SetLocalPrm();
            
            var id="";
            if (typeof prm !== "undefined"){
                SetExternalPrm(prm);
                id=UseID(prm); 
                
                if (typeof prm.add !== "undefined")
                    add=prm.add;
                                                                                                
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
            
            SetSvgTag(add);
                                    
            var element=svg_+"<g "+id+" style='stroke:"+stroke_+";stroke-width:"+stroke_width_+";' >";
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
            element+="</g>"+_svg;
            
            AddElement(add, element);
            
        } catch (err){
            console.log(err);
        }
        
        return element;
    };        
    
    //мітка масштабу 
    this.Scale=function(prm){ //alert(ObjToString(prm));
        var add=SetPrm(prm, "add", true);                
        var x=SetPrm(prm, "x", 15);
        var y=SetPrm(prm, "y", 100);          //
        var lengthOrt=SetPrm(prm, "lengthOrt", 25);   //
        var height=SetPrm(prm, "height", 5);       //
        var cScale=SetPrm(prm, "cScale", 25);       //
        var ov=SetPrm(prm, "ov", "m");         //
        
        //
        var showOV=SetPrm(prm, "showOV", true);    //
        var showScale=SetPrm(prm, "showScale", true); //
        
        //
        //var pairStyle="";      //
        var oddStyle=SetPrm(prm, "oddStyle", "stroke: black;");       //
        var strokeBorder=SetPrm(prm, "strokeBorder", "grey");             //    
        var classLabelScale=SetPrm(prm, "classLabelScale", "");              //
        var styleLabelScale=SetPrm(prm, "styleLabelScale", "font-weight: bold; font-size: 8pt; stroke-width: 1;");            
                
        var pairStyle=SetPrm(prm, "pairStyle", "stroke: white;");
        
        pairStyle="style='"+pairStyle+"'";
        oddStyle="style='"+oddStyle+"'";    
        if (classLabelScale)
            classLabelScale="class='"+classLabelScale+"'";
        if (styleLabelScale)
            styleLabelScale="style='"+styleLabelScale+"'";
        
        var id="";
        if (typeof prm !== "undefined"){
            id=UseID(prm);                                              
        }                
        
        SetSvgTag(add);
        
        var oldX=x;
        var x2;
        var element=svg_+"<g "+id+">";
        var curStyle="";      
        var tY=y+height+7;
        var num=0;
        for(var i=1; i<=cScale; i++, num++){
            if (i%2===0)
                curStyle=pairStyle;
            else
                curStyle=oddStyle;
            x2=x+lengthOrt;            
            element+="<line x1="+x+" y1="+y+" x2="+x2+" y2="+y+" "+curStyle+" stroke-width="+height+"></line>";
            x-=3;
            if (showScale){                               
                element+="<text x="+x+" y="+tY+" "+classLabelScale+" "+styleLabelScale+">"+num+"</text>";
            }
            
            x=x2;
        }
        x-=3;
        if (showScale){                               
            element+="<text x="+x+" y="+tY+" "+classLabelScale+" "+styleLabelScale+">"+num+"</text>";
        }
        if (showOV){
            x+=20;
            element+="<text x="+x+" y="+tY+" "+classLabelScale+" "+styleLabelScale+">("+ov+")</text>";
        }
        element+=self.Rect({
            add: false,
            x: oldX, y: y-height/2, 
            width: lengthOrt*cScale, height: height,
            stroke: strokeBorder,
            fill_opacity: 0
        });
        element+="</g>"+_svg;                        
        
        AddElement(add, element);
               
        return element;
    };
            
    //додавання вершини
    this.AddVertex=function(pset){
        global_number_vertex++;                
        return self.Circle({   
            id: "id_vertex_"+global_number_vertex,
            cx: pset.x,
            cy: pset.y,
            r: 3,
            fill: "blue",
            stroke: "black",
            stroke_width: 2
        });                    
    };
    
    //стрілка для курсорів
    CursorArrow=function(prm){
        
        var stroke=SetPrm(prm, "stroke", "#455278");
        var stroke_width=SetPrm(prm, "stroke_width", 3);
        var fill=SetPrm(prm, "fill", "#9AADDF");        
        
        return self.Arrow({
            add: false,
            h: 10,
            w: 8,
            B: {x: 0, y: 0},
            A: {x: 15, y: 15},
            stroke: stroke,
            stroke_width: stroke_width,
            fill: fill
        });
    };
    
    //курсори режимів роботи
    //виділення прямокутної області
    this.cursorSelectedRectArea=function(){
        var element="<svg><g id='id_cmw_SelectedRectArea'>"+CursorArrow()+"</g></svg>";
        objCanvas.append(element);
    };
    
    this.cursorAddVertex=function(){    //додавання вершини до поточного контура                    
        var element="<svg><g id='id_cmw_AddVertex'>"+self.Circle({            
            add: false,
            cx: offsetX,
            cy: offsetY,
            r: 3,
            fill: "green",
            stroke: "grey",
            stroke_width: 2
        })+"</g></svg>";                    
        objCanvas.append(element);
    };
    
    //
    Sight=function(type){
        var r=sightR;
        var cx=offsetX;
        var cy=offsetY;
        var d=sightD;
        
        var p1={x: cx-r-d, y: cy};
        var p2={x: cx-r, y: cy};
        var p3={x: cx, y: cy-r-d};
        var p4={x: cx, y: cy-r};
        var p5={x: cx+r, y: cy};
        var p6={x: cx+r+d, y: cy};
        var p7={x: cx, y: cy+r};
        var p8={x: cx, y: cy+r+d};
        
        var id="id_cmw_MoveVertex";
        var stroke="grey";        
        switch (type){
            case "remove":{
                stroke="red";
                id="id_cmw_RemoveVertex";
                break;
            }
            case "addArrow":{
                stroke="green";
                id="id_cmw_AddArrow";
                break;              
            }
            case "delArrow":{
                stroke="red";
                id="id_cmw_DelArrow";
                break;
            }            
        }
                
        var element="<g id='"+id+"' style='stroke: "+stroke+"; stroke-width: 2; fill: none;'>";
        element+="<circle r="+r+" cx="+cx+" cy="+cy+"></circle>";
        element+="<line x1="+p1.x+" y1="+p1.y+" x2="+p2.x+" y2="+p2.y+"></line>";
        element+="<line x1="+p3.x+" y1="+p3.y+" x2="+p4.x+" y2="+p4.y+"></line>";
        element+="<line x1="+p5.x+" y1="+p5.y+" x2="+p6.x+" y2="+p6.y+"></line>";
        element+="<line x1="+p7.x+" y1="+p7.y+" x2="+p8.x+" y2="+p8.y+"></line>";
        if (type !== "addArrow" && type !== "delArrow")
            element+="</g>";
        
        return element;
    };
    
    this.cursorMoveVertex=function(){   //переміщення вершини поточного контура        
        var element=Sight();        
        objCanvas.append("<svg>"+element+"</svg>");                
    };
    
    //видалення вершини поточного контура
    this.cursorRemoveVertex=function(){
        var element=Sight("remove");
        objCanvas.append("<svg>"+element+"</svg>"); 
    }; 
    
    //курсор горизонтальної напрямної
    this.cursorHGuide=function(){
        var line=self.Line({
            add: false,
            x1: -1500,  y1: -qArrow, x2: 1500, y2: -qArrow,
            stroke: "grey"
        });
        var element="<svg><g id='id_cmw_HGuide'>"+CursorArrow()+line+"</g></svg>";
        objCanvas.append(element);
    };
    
    //курсор вертикальної напрямної
    this.cursorVGuide=function(){
        var line=self.Line({add: false, x1: -qArrow,  y1: -1500, x2: -qArrow, y2: 1500});
        var element="<svg><g id='id_cmw_VGuide'>"+CursorArrow()+line+"</g></svg>";
        objCanvas.append(element);
    };
    
    //курсор додавання стрілки розміру
    this.cursorAddArrow=function(first, del){
        var typeArrow="addArrow";
        if (typeof del!=="undefined" && del)
            typeArrow="delArrow";
        var element=Sight(typeArrow);
        var Y=offsetY+sightR+sightD+2;
        var p1={x: offsetX, y: Y};
        var p2={x: offsetX, y: Y+10};
        element+="<line x1="+p1.x+" y1="+p1.y+" x2="+p2.x+" y2="+p2.y+"></line>";
        if (first){            
            element+="<line x1="+(p1.x+20)+" y1="+p1.y+" x2="+(p2.x+20)+" y2="+p2.y+"></line>";            
            element+="<line x1="+p1.x+" y1="+(p2.y-2)+" x2="+(p2.x+20)+" y2="+(p2.y-2)+"></line>";
            if (del){
                element+="<line x1="+(p1.x+5)+" y1="+(p1.y)+" x2="+(p2.x+15)+" y2="+(p2.y+5)+"></line>";
                element+="<line x1="+(p1.x+5)+" y1="+(p1.y+15)+" x2="+(p2.x+15)+" y2="+(p2.y-10)+"></line>";
            }
        }else{
            element+="<line x1="+(p1.x-20)+" y1="+p1.y+" x2="+(p2.x-20)+" y2="+p2.y+"></line>";            
            element+="<line x1="+p1.x+" y1="+(p2.y-2)+" x2="+(p2.x-20)+" y2="+(p2.y-2)+"></line>";
        }
        
        objCanvas.append("<svg>"+element+"</g></svg>");         
    };
    
    //курсор видалення стрілки розміру
    this.cursorDelArrow=function(){
        self.cursorAddArrow(true, true);
    };
    
    //курсор "відкрита рука"
    this.cursorOpenHand=function(){
        var element="<g  id='id_cmw_OpenHand'>";
        element+="<line x1=0 y1=0 x2=10 y2=10 stroke=black stroke-width=2>";
        element+="</g>";
        objCanvas.append("<svg>"+element+"</svg>");
    };
    
    //курсор "закрита рука"
    this.cursorCloseHand=function(){
        var element="<g id='id_cmw_CloseHand'>";
        element+="<line x1=10 y1=0 x2=0 y2=10 stroke=black stroke-width=2>";
        element+="</g>";
        objCanvas.append("<svg>"+element+"</svg>");
    };
    
    //курсор додавання мітки розміру між двома довільними точками на кресленні
    this.cursorGetDistance=function(second){
        var len=20;
        var angle=45;
        var element="<g id='id_cmw_GetDistance'>";
        
        if (typeof second === "undefined")
            second=false;
                        
        if (!second){
            element+=this.Path({
                add: false,
                d: "M0 0 L-3 -3 L-3 -"+len+" L0 -"+len+" Z",
                stroke: "black",
                fill: "white",
                stroke_width: 1
            });
            var len_=len-3;
            element+=this.Path({
                add: false,
                d: "M0 0 L3 0 L3 "+len_+" L0 "+len+" Z",
                stroke: "black",
                fill: "white",
                stroke_width: 1,
                transform: " translate(0 -"+len+")  rotate(-70)" // 
            });
            len_=len+7;
            element+=this.Path({
                add: false,
                d: "M0 0 L0 5 L-3 8 L-3 12 L2 15 L7 12 L7 8 L4 5 L4 0  Z",
                stroke: "black",
                fill: "white",
                stroke_width: 1,
                transform: " translate(-10 -"+len_+") rotate(-"+angle+")   " // 
            });           
        }else{
            element+=this.Path({
                add: false,
                d: "M0 0 L3 -3 L3 -"+len+" L0 -"+len+" Z",
                stroke: "black",
                fill: "white",
                stroke_width: 1
            });
            var len_=len-3;
            element+=this.Path({
                add: false,
                d: "M0 0 L-3 0 L-3 "+len_+" L0 "+len+" Z",
                stroke: "black",
                fill: "white",
                stroke_width: 1,
                transform: " translate(0 -"+len+")  rotate(70)" // 
            });
            len_=len+11;
            element+=this.Path({
                add: false,
                d: "M0 0 L0 5 L-3 8 L-3 12 L2 15 L7 12 L7 8 L4 5 L4 0  Z",
                stroke: "black",
                fill: "white",
                stroke_width: 1,
                transform: " translate(8 -"+len_+") rotate("+angle+")   " // 
            });
        }            
        element+="</g>";
        objCanvas.append("<svg>"+element+"</svg>");
    };
    
    //курсори перестінків
    
    this.cursorAddLineWall=function(){  //курсор додавання перестінку у вигляді відрізка
        var element="<g id='id_cmw_AddLineWall'>";
        
        element+=self.Polygon({
            add: false,
            points: "-5 0 0 5 5 0 0 -5 z",
            stroke: "navy",
            stroke_width: 2,
            fill: "none"
        });
        
        element+="</g>";
        objCanvas.append("<svg>"+element+"</svg>");
    };
    
    
    this.cursorAddHWall=function(){    //курсор горизонтального перестінку
        var line=self.Line({
            add: false,
            x1: -1500,  y1: -qArrow, x2: 1500, y2: -qArrow,
            stroke: CursorLineAddInsideWall.stroke,
            stroke_dasharray:  CursorLineAddInsideWall.stroke_dasharray,
            stroke_width: 2
        });
        var element="<svg><g id='id_cmw_AddHWall'>"+CursorArrow()+line+"</g></svg>";
        objCanvas.append(element);
    };
    
    this.cursorAddVWall=function(){
        var line=self.Line({
            add: false, 
            x1: -qArrow,  y1: -1500, x2: -qArrow, y2: 1500,
            stroke: CursorLineAddInsideWall.stroke,
            stroke_dasharray: CursorLineAddInsideWall.stroke_dasharray,
            stroke_width: 2
        });
        var element="<svg><g id='id_cmw_AddVWall'>"+CursorArrow()+line+"</g></svg>";
        objCanvas.append(element);
    };
    
    //відрізки курсорів Г-подібних, хрестовидного та П-подібних перестінків
    var lineL=self.Line({
        add: false, 
        x1: -1500,  y1: 0, x2: 0, y2: 0,
        stroke: CursorLineAddInsideWall.stroke,
        stroke_dasharray: CursorLineAddInsideWall.stroke_dasharray,
        stroke_width: 2
    });
    var lineL2=self.Line({
        add: false, 
        x1: -1500,  y1: 0, x2: 0, y2: 0,
        stroke: CursorLineAddInsideWall.stroke,
        stroke_dasharray: CursorLineAddInsideWall.stroke_dasharray,
        stroke_width: 2
    });
    var lineB=self.Line({
        add: false, 
        x1: 0,  y1: 0, x2: 0, y2: 1500,
        stroke: CursorLineAddInsideWall.stroke,
        stroke_dasharray: CursorLineAddInsideWall.stroke_dasharray,
        stroke_width: 2
    });
    var lineB2=self.Line({
        add: false, 
        x1: 0,  y1: 0, x2: 0, y2: 1500,
        stroke: CursorLineAddInsideWall.stroke,
        stroke_dasharray: CursorLineAddInsideWall.stroke_dasharray,
        stroke_width: 2
    });
    var lineR=self.Line({
        add: false, 
        x1: 0,  y1: 0, x2: 1500, y2: 0,
        stroke: CursorLineAddInsideWall.stroke,
        stroke_dasharray: CursorLineAddInsideWall.stroke_dasharray,
        stroke_width: 2
    });
    var lineR2=self.Line({
        add: false, 
        x1: 0,  y1: 0, x2: 1500, y2: 0,
        stroke: CursorLineAddInsideWall.stroke,
        stroke_dasharray: CursorLineAddInsideWall.stroke_dasharray,
        stroke_width: 2
    });
    var lineT=self.Line({
        add: false, 
        x1: 0,  y1: 0, x2: 0, y2: -1500,
        stroke: CursorLineAddInsideWall.stroke,
        stroke_dasharray: CursorLineAddInsideWall.stroke_dasharray,
        stroke_width: 2
    });
    var lineT2=self.Line({
        add: false, 
        x1: 0,  y1: 0, x2: 0, y2: -1500,
        stroke: CursorLineAddInsideWall.stroke,
        stroke_dasharray: CursorLineAddInsideWall.stroke_dasharray,
        stroke_width: 2
    });
        
    this.cursorAddGLBWall=function(){        
        var element="<svg><g id='id_cmw_AddGLBWall'>"+CursorArrow()+lineL+lineB+"</g></svg>";
        objCanvas.append(element);
    };
    
    this.cursorAddGLTWall=function(){        
        var element="<svg><g id='id_cmw_AddGLTWall'>"+CursorArrow()+lineL+lineT+"</g></svg>";
        objCanvas.append(element);
    };
    
    this.cursorAddGRTWall=function(){       
        var element="<svg><g id='id_cmw_AddGRTWall'>"+CursorArrow()+lineR+lineT+"</g></svg>";
        objCanvas.append(element);
    };
    
    this.cursorAddGRBWall=function(){        
        var element="<svg><g id='id_cmw_AddGRBWall'>"+CursorArrow()+lineR+lineB+"</g></svg>";
        objCanvas.append(element);
    };
    
    this.cursorAddCrossWall=function(){        
        var element="<svg><g id='id_cmw_AddCrossWall'>"+CursorArrow()+lineR+lineL+lineT+lineB+"</g></svg>";
        objCanvas.append(element);
    };
    
    this.cursorAddPLLWall=function(width){
        lineL2=self.Line({
            add: false, 
            x1: -1500,  y1: -width, x2: 0, y2: -width,
            stroke: CursorLineAddInsideWall.stroke,
            stroke_dasharray: CursorLineAddInsideWall.stroke_dasharray,
            stroke_width: 2
        });
        var lineT2=self.Line({
            add: false, 
            x1: 0,  y1: 0, x2: 0, y2: -width,
            stroke: CursorLineAddInsideWall.stroke,
            stroke_dasharray: CursorLineAddInsideWall.stroke_dasharray,
            stroke_width: 2
        });
        var element="<svg><g id='id_cmw_AddPLLWall'>"+CursorArrow()+lineL+lineL2+lineT2+"</g></svg>";
        objCanvas.append(element);
    };
    
    this.cursorAddPTTWall=function(width){        
        var lineT2=self.Line({
            add: false, 
            x1: -width,  y1: 0, x2: -width, y2: -1500,
            stroke: CursorLineAddInsideWall.stroke,
            stroke_dasharray: CursorLineAddInsideWall.stroke_dasharray,
            stroke_width: 2
        });
        lineL2=self.Line({
            add: false, 
            x1: -width,  y1: 0, x2: 0, y2: 0,
            stroke: CursorLineAddInsideWall.stroke,
            stroke_dasharray: CursorLineAddInsideWall.stroke_dasharray,
            stroke_width: 2
        });
        var element="<svg><g id='id_cmw_AddPTTWall'>"+CursorArrow()+lineT+lineT2+lineL2+"</g></svg>";
        objCanvas.append(element);
    };
    
    this.cursorAddPRRWall=function(width){        
        var lineR2=self.Line({
            add: false, 
            x1: 0,  y1: -width, x2: 1500, y2: -width,
            stroke: CursorLineAddInsideWall.stroke,
            stroke_dasharray: CursorLineAddInsideWall.stroke_dasharray,
            stroke_width: 2
        });
        lineT2=self.Line({
            add: false, 
            x1: 0,  y1: 0, x2: 0, y2: -width,
            stroke: CursorLineAddInsideWall.stroke,
            stroke_dasharray: CursorLineAddInsideWall.stroke_dasharray,
            stroke_width: 2
        });
        var element="<svg><g id='id_cmw_AddPRRWall'>"+CursorArrow()+lineR+lineR2+lineT2+"</g></svg>";
        objCanvas.append(element);
    };
    
    this.cursorAddPBBWall=function(width){        
        var lineB2=self.Line({
            add: false, 
            x1:  -width, y1: 0, x2: -width, y2: 1500,
            stroke: CursorLineAddInsideWall.stroke,
            stroke_dasharray: CursorLineAddInsideWall.stroke_dasharray,
            stroke_width: 2
        });
        lineL2=self.Line({
            add: false, 
            x1: 0,  y1: 0, x2: -width, y2: 0,
            stroke: CursorLineAddInsideWall.stroke,
            stroke_dasharray: CursorLineAddInsideWall.stroke_dasharray,
            stroke_width: 2
        });
        var element="<svg><g id='id_cmw_AddPBBWall'>"+CursorArrow()+lineB+lineB2+lineL2+"</g></svg>";
        objCanvas.append(element);
    };
    
    this.cursorDellIWall=function(){
        var prm={
            stroke: "red",
            fill: "#EE564F"
        };
        
        var d=-5;
        var L1=self.Line({
            add: false,
            x1: d, y1: -10, x2: d, y2: 10,
            stroke: "red",
            stroke_width: 2
        });
        var L2=self.Line({
            add: false,
            x1: d, y1: 0, x2: -15+d, y2: 0,
            stroke: "red",
            stroke_width: 1
        });
        var element="<svg><g id='id_cmw_DelIWall'>"+CursorArrow(prm)+L1+L2+"</g></svg>";
        objCanvas.append(element);
    };
    
    //маркери        
    this.markerPset=function(id){
        var d=5;
        var element="<g id="+id+" >";
        element+=self.Polygon({
            add: false,
            psets: {
                p1: {x: 0, y: d},
                p2: {x: d, y: 0},
                p3: {x: 0, y: -d},
                p4: {x: -d, y: 0}
            },
            stroke: "#abc",
            stroke_width: 2,
            fill: "red"
        });
        element+="</g>";
        objCanvas.append("<svg>"+element+"</svg>");
    };
    
    this.markerLineDistance=function(id){        
        var element=this.Line({
            add: false,
            id: id,
            stroke: "grey",
            stroke_width: 1,
            x1: -20,
            y1: -20,
            x2: -10,
            y2: -10
        });        
        objCanvas.append("<svg>"+element+"</svg>");
    };
    
    this.markerVertexLIW=function(id){
        var element="<g id='"+id+"'>";
        
        element+=self.Polygon({
            add: false,
            points: "-5 0 0 5 5 0 0 -5 z",
            stroke: "green",
            stroke_width: 2,
            fill: "none"
        });
        
        element+="</g>";
        objCanvas.append("<svg>"+element+"</svg>");
    };
    
    this.markerHWall=function(id){               
        var element=self.Line({
            id: id,
            add: false,
            stroke: "green",
            stroke_width: 4,
            stroke_dasharray: "",
            
            x1: -100, y1: -100, x2: -120, y2: -100
        });
                
        objCanvas.append("<svg>"+element+"</svg>");
    };
    
    this.markerVWall=function(id){               
        var element=self.Line({
            id: id,
            add: false,
            stroke: "green",
            stroke_width: 4,
            stroke_dasharray: "",
            
            x1: -100, y1: -100, x2: -120, y2: -100
        });
                
        objCanvas.append("<svg>"+element+"</svg>");
    };
       
    
    //інші об*єкти
    
    //рамка виділення об*єктів в області зображення
    this.rectSelectObjects=function(){
        var element="<svg>"+self.Rect({
            add: false,
            id: "id_objSelectRectArea",
            x: -100,
            y: -100,
            width: 10,
            height: 20,
            fill: "#F1F3AA",
            fill_opacity: 0.3,
            stroke: "#1D2949"            
        });        
        element+="</svg>";
        objCanvas.append(element);
    };
    
    //горизонтальна напрямна
    this.hGuide=function(id){
        var hgID="id_obj_hGuide";
        if (id && id instanceof String)
            hgID=id;
        var element="<svg>"+self.Line({
            add: false,
            id: hgID,
            x1: -1500, y1: -qArrow, x2: 1500, y2: -qArrow,                        
            stroke: stroke_guide       
        });        
        element+="</svg>";
        objCanvas.append(element);
    };
    
    //вертикальна напрямна
    this.vGuide=function(id){
        var vgID="id_obj_vGuide";
        if (id && id instanceof String)
            vgID=id;
        var element="<svg>"+self.Line({
            add: false,
            id: vgID,
            x1: -qArrow,  y1: -1500, x2: -qArrow, y2: 1500,                    
            stroke: stroke_guide      
        });        
        element+="</svg>";
        objCanvas.append(element);
    };
    
    //внутрішній перестінок
    this.insideWall=function(prm){                        
        var result=0;
        if (typeof prm !== "undefined"){            
            try{
                var element="<svg><g id='"+prm.id+"' >";
                element+=self.Path({
                    add: false,
                    d: prm.path,
                    stroke: "grey",
                    stroke_width: 3,
                    fill: "none"
                });
                element+="</g></svg>";
                objCanvas.append(element);
                result=1;
            }catch (err){
                console.log(".CSvg.insideWall", err);
            }
        }
        
        return result;
    };
        
    //
};
