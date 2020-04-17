"use ctrict";

//псевдоклас креслення меблів - контролер дій на кресленні
var CFurnitureDesign=function(){
    var self=this;
    
    var scale=120; //масштаб: кількість пікселів в одному метрі
    const thickShelf=18; //товщина полиці в мм
    const halfThickShelf=thickShelf/2;
    var halfThickShelfPX=5;
    self.GetHalfThickShelfPX=function(){
        halfThickShelfPX=parseInt(halfThickShelf/scale);
        return halfThickShelfPX;        
    };
    
    //переведення кількості пікселів у метри
    self.PixelsToMt=function(p){
        if (typeof p !== "number" || Math.abs(p) < 0.001)
            p=0.001;
        return (p/scale).toFixed(3);
    };
    
    //переведення метрів у пікселі
    self.MtToPixels=function(m){
        return parseInt(m*scale)+1;
    };
    
    var posFrameDraft={}; //параметри позиціонування рамки лінійних розмірів креслення
    ;
    
    //список усіх полиць - модель
    var idxShelfs=0;
    var shelfs={}; //тут зберігатимуться лінійні розміри полиць
    
    var shelfsViewsObjs={}; //вигляд полиць - тут зберігатимуться події над полицями
    var SearchIdxShelfView=function(id){ //пошук індексу вигляду полиці у масиві виглядів полиць
        var l=shelfsViewsObjs.length;
        var search=-1;
        for(var i=0; i<l && search<0; i++){            
            if (shelfsViewsObjs[i].id===id)
                search=i;            
        };
        
        return search;
    };
    
    //id контексту виведення зображення креслення
    var idDC="draft";
    
    var svg=null; //об*єкт рендерингу svg-примітивів
    
    var frameDraft=null; //об*єкт обмежувальної рамки креслення - фактично лінійні розміри виробу
    
    //
    var idMoveShelf=""; //id полиці, яка переміщується
    self.GetIdMoveShelf=function(){return idMoveShelf;};
    var moveShelf=null; //об*єкт полиці, що переміщується
    self.GetMoveShelf=function(){return moveShelf;};
    var oldMouse={x: -100, y: -100}; //попереднє положення курсора миші
    var imgMoveShelf=null;
            
    //
    var __constructor=function(prm){        
        
        try{
            idDC=prm.idDC;
            svg=new CSvg;
            frameDraft=new CFrameDraft({
                parent: self,
                containerId: idDC,
                svg    : svg,
                width  : 5,
                height : 3,
                scale  : scale
            });  
            
            posFrameDraft=frameDraft.GetPosFrameDraft();
        }catch(err){
            console.log(err);
        }
        
        /*
        //test!!!
        self.addShelf({
            type: "addVShelf",
            width: 130, 
            depth: 100,
            start: {
                x: 0,
                y: 0
            }
        });
        self.addShelf({
            type: "addVShelf",
            width: 130, 
            depth: 100,
            start: {
                x: 150,
                y: 0
            }
        });
        self.addShelf({
            type: "addHShelf",
            width: 150-18, 
            depth: 100,
            start: {
                x: 18,
                y: 130-18
            }
        });
        //*/
        
        
        //!!!
        //for(var fld in shelfs)
        //    console.log(shelfs[fld].GetShelf());
        
        //
        
        
        console.log(shelfsViewsObjs);
    };
    
    //створення/перестворення усіх обробників подій для зображень об*єктів полиць
    var ReCreateEventsForShelfs=function(){
        shelfsViewsObjs=document.querySelectorAll("[id^='id_shelf_']"); //console.log(shelfsViewsObjs);
        var l=shelfsViewsObjs.length;
        for(var i=0; i<l; i++){            
            shelfsViewsObjs[i].onmousemove=function(ev){ OnMouseMoveShelf(ev); };
            shelfsViewsObjs[i].onmouseover=function(ev){ OnMouseOverShelf(ev); };
            shelfsViewsObjs[i].onmouseout=function(ev){ OnMouseOutShelf(ev); };
            shelfsViewsObjs[i].onclick=function(ev){ ClickShelf(ev); };
        };
        
        //перетворити NodeList в Array
        shelfsViewsObjs=Array.prototype.slice.call(shelfsViewsObjs);
    };
    
    /*
    //створення усіх обробників подій для зображення об*єкта полиці з вказаним id
    var CreateEventForShelf=function(id){
        shelfsViewsObjs[id]=document.getElementById(id);
        shelfsViewsObjs[id].onmousemove=function(ev){ self.OnMouseMoveShelf(ev); };
        shelfsViewsObjs[id].onmouseout=function(ev){ OnMouseOutShelf(ev); };
        shelfsViewsObjs[id].onclick=function(ev){ ClickShelf(ev); };
    };
    */
   
    var StopMoveShelf=function(){         
        if (idMoveShelf !== ""){
            moveShelf={};
            imgMoveShelf.style.cursor="pointer";
            shelfs[idMoveShelf].SetStart(
                parseInt(imgMoveShelf.getAttribute("x")),
                parseInt(imgMoveShelf.getAttribute("y"))
            );                
        }
        
        idMoveShelf=""; 
    };
    
    var EventMouseOnShelf=function(ev){
        imgMoveShelf=document.getElementById(ev.target.id);
        var action=main.GetAction();
        switch (action){
            case "moveShelf": {
                if (ev.buttons === 1){ 
                    moveShelf=shelfs[ev.target.id].GetShelf();
                    idMoveShelf=ev.target.id;
                    imgMoveShelf.style.cursor="move";

                    //console.log("idMoveShelf: ", idMoveShelf);
                }else{                                                       
                    StopMoveShelf();
                }
                imgMoveShelf.style.fill="rgb(228, 228, 228)"; 
                
                break
            }        
            case "delShelf":{
                ;
            }
        }
    };
   
    //курсор миші щойно попав на полицю
    var OnMouseOverShelf=function(ev){ 
        EventMouseOnShelf(ev);
    };
    
    //курсор миші бігає по полиці
    var OnMouseMoveShelf=function(ev){
        EventMouseOnShelf(ev);
    };
    
    //курсор миші зліз з полиці
    var OnMouseOutShelf=function(ev){
        /*
        idMoveShelf="";
        
        var imgShelf=document.getElementById(ev.target.id);
        imgShelf.style.fill="white";
        */
       
       imgMoveShelf.style.fill="white";
        
       //console.log("mouseOut idMoveShelf: ", idMoveShelf, imgMoveShelf);                             
    };
    
    //
    self.MoveImgShelf=function(dx, dy){
        var x=parseInt(imgMoveShelf.getAttribute("x"))+dx;
        var y=parseInt(imgMoveShelf.getAttribute("y"))+dy;
                
        imgMoveShelf.setAttribute("x", x);
        imgMoveShelf.setAttribute("y", y);
    };        
    
    //клік на полиці
    var ClickShelf=function(ev){    
        
        //!!!!!!
        //console.log(ev.target.id, ev);
        
        ev.stopPropagation();
        
        //видалення полиці
        if (main.GetAction() === "delShelf"){
            
            deleteShelf(ev.target.id);
        }
                
    };
    
    //обчислення висоти вертикальної полиці
    self.CalcHVShelf=function(data){       
        data.x-=parseInt(halfThickShelfPX);
                        
        var yt=posFrameDraft.y;
        var yb=yt+posFrameDraft.height;
        
        //алгоритм уточнення yt, yb    
        var shelf={};
        var X=0;
        var W=0;
        var Y=0;           
        for (var key in shelfs){
            shelf=shelfs[key].GetShelf();
            //console.log("shelf: ", shelf);
            
            if (shelf.type === "addHShelf"){
                X=shelf.start.x;
                Y=shelf.start.y;
                W=X+shelf.width;                
                if (data.x > X && data.x < W){
                    if (Y > yt && Y < data.y)
                        yt=Y+shelf.thick;
                    if (Y < yb && Y > data.y)
                        yb=Y;
                }
            }
        }
        
        data.y=yt;
        data.width=yb-yt;         
    };
    
    //обчислення ширини горизонтальної полиці
    self.CalcWHShelf=function(data){
        data.y-=parseInt(halfThickShelfPX);
        
        var xl=posFrameDraft.x;
        var xr=xl+posFrameDraft.width;
        
        //алгоритм уточнення xl, xr
        var shelf={};
        var X=0;
        var Y=0;
        var H=0;
        for (var key in shelfs){
            shelf=shelfs[key].GetShelf();
            //console.log("shelf: ", shelf);
            
            if (shelf.type === "addVShelf"){
                X=shelf.start.x;
                Y=shelf.start.y;
                H=Y+shelf.width;
                if (data.y > Y && data.y < H){
                    if (X > xl && X < data.x)
                        xl=X+shelf.thick;
                    if (X < xr && X > data.x)
                        xr=X;
                }
            }
        }
        
        data.x=xl;
        data.width=xr-xl;        
    };
    
    //додавання полиці
    self.addShelf=function(prm){ 
        prm.thick=self.MtToPixels(thickShelf/1000);
        var shelf=new CShelf(prm); 
        var id="id_shelf_"+idxShelfs;
        shelf.AddToDraft({
            svg : svg,
            containerId: idDC,
            selfId: id
        });
        //CreateEventForShelf(id); //!!!
        shelfs[id]=shelf;
        idxShelfs++;
        
        ReCreateEventsForShelfs();
        
        //console.log(shelfsViewsObjs, shelfsViewsObjs[0].id);
    };
    
    //видалення полиці з вказаним id
    var deleteShelf=function(id){                    
        //видалення лінійних розмірів полиці
        delete shelfs[id];
        
        //видалення об*єкту з даними про обробку подій над полицею
        var idx=SearchIdxShelfView(id);        
        shelfsViewsObjs.splice(idx, 1);
        
        //видалення зображення полиці з DOM
        var shelf=document.getElementById(id);
        shelf.parentNode.removeChild(shelf);       
    };
    
    __constructor({
        "idDC" : "draft"
    });
};

