"use ctrict";

//псевдоклас креслення меблів - контролер дій на кресленні
var CFurnitureDesign=function(){
    var self=this;
    
    var scale=100; //масштаб: кількість пікселів в одному метрі
    const thickShelf=18; //товщина полиці в мм
    const halfThickShelf=thickShelf/2;
    self.GetHalfThickShelfPX=function(){return parseInt(halfThickShelf/scale);};
    
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
    var isMoveShelf=false; //прапор переміщення полиці
    self.GetIsMoveShelf=function(){return isMoveShelf;};
    var moveShelf=null; //об*єкт полиці, що переміщується
    var oldMouse={x: -100, y: -100}; //попереднє положення курсора миші
            
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
        shelfsViewsObjs=document.querySelectorAll("[id^='id_shelf_']");
        var l=shelfsViewsObjs.length;
        for(var i=0; i<l; i++){            
            shelfsViewsObjs[i].onmousemove=function(ev){ self.OnMouseMoveShelf(ev); };
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
    
    //курсор миші на полиці
    self.OnMouseMoveShelf=function(ev){                        
        //рух миші по полиці при натисненій лівій клавіші не в режимы видалення полиці
        //(в режимі видалення полиці не рухаються)
        if (ev.buttons === 1 && main.GetAction() !== "delShelf"){ 
            if (!isMoveShelf){
                moveShelf=document.getElementById(ev.target.id);                
                moveShelf.style.cursor="move";
                isMoveShelf=true;
                oldMouse={
                    x: ev.offsetX,
                    y: ev.offsetY
                };
            }else{                                                                
                var dx=ev.offsetX-oldMouse.x;
                var dy=ev.offsetY-oldMouse.y;
                
                var x=parseInt(moveShelf.getAttribute("x"))+dx;
                var y=parseInt(moveShelf.getAttribute("y"))+dy;
                
                moveShelf.setAttribute("x", x);
                moveShelf.setAttribute("y", y);
                
                oldMouse={
                    x: ev.offsetX,
                    y: ev.offsetY
                };
            }
            
            //shelfs[ev.target.id]
            console.log("mouse on shelf: ", ev);
        }else{
            moveShelf=document.getElementById(ev.target.id);                        
            if (main.GetAction() === "delShelf"){                    
                moveShelf.style.cursor="url("+main.GetPathCursors()+"delShelf.cur), auto";                
                moveShelf.style.fill="red";

                console.log("regime deleting ... "+moveShelf.style.fill);
            }else{
                moveShelf.style.cursor="pointer";
                moveShelf.style.fill="rgb(228, 228, 228)";
            }                            
            isMoveShelf=false;
        }
        
        //moveShelf.setAttribute("class", "fill_under_cursor");                
    };
    
    //курсор миші зліз з полиці
    var OnMouseOutShelf=function(ev){
        var moveShelf=document.getElementById(ev.target.id);
        moveShelf.style.fill="white";
        
        //moveShelf.setAttribute("class", "fill_standart");                
    };
    
    //клік на полиці
    var ClickShelf=function(ev){    
        
        //!!!!!!
        console.log(ev.target.id, ev);
        
        ev.stopPropagation();
        
        //видалення полиці
        if (main.GetAction() === "delShelf"){
            
            deleteShelf(ev.target.id);
        }
                
    };
    
    //додавання полиці
    self.addShelf=function(prm){ 
        prm.thick= self.MtToPixels(thickShelf/1000);
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

