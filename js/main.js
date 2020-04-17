"use strict";

//головний контролер
var CMain=function(){
    
    var self=this;
    
    var objDraft=null;      //DOM-об*єкт контейнера креслення
    
    var objFrameDraft=null; //DOM-об*єкт рамки лінійних розмірів креслення
    
    
    //прапор розташувння курсора миші в межах рамки лінійних розмірів креслення
    var mouseIsFrameDraft=false;
    self.GetMouseIsFrameDraft=function(){ return mouseIsFrameDraft; };
    
    const halfThickShelfPX=fd.GetHalfThickShelfPX(); //отримати половину товщини полиці у px
    
    self.cursor="?";
    var pathCursors="cursors/"; //
    self.GetPathCursors=function(){return pathCursors;};
    
    
    var action=""; //прапор поточної дії
    self.GetAction=function(){return action;};
    
    var __constructor=function(){     
        objDraft=document.getElementById("draft");
        
        //створити обробник кліка в області креслення
        objDraft.onclick=function(ev){ClickOnDraft(ev);};
        objDraft.onmousemove=function(ev){MoveOnDraft(ev);};
        
        //створити обробники подій для курсора миші в межах рамки лінійних розмірів креслення
        ReCreateEventsForFrameDraft();
        //отримати параметри позиціонування рамки лінійних розмірів креслення
        //GetPosFrameDraft();
        
        //створти обробники подій для кнопок вибору режиму вставки полиць (вертикальна чи горизонтальна)
        self.CreateEventsForElements({onclick: "ClickBtnWorkShelf"}, ".rbtWorkShelf");               
    };
    
    var ReCreateEventsForFrameDraft=function(){
        objFrameDraft=document.getElementById("frameDraft");
        objFrameDraft.onmouseover=function(ev){mouseIsFrameDraft=true;};
        objFrameDraft.onmouseout=function(ev){mouseIsFrameDraft=false;};
    };
    
    //установка курсора у залежності від режиму роботи
    var SetCursor=function(){        
        try{
            var cursor="default";
            if (action !== "" && action !=="moveShelf" && mouseIsFrameDraft ){
                self.cursor=pathCursors+action+".cur";
                cursor="url("+pathCursors+action+".cur), auto";            
            }      
            objDraft.style.cursor=cursor;
        }catch (err){
            console.log(err);
        }
    
    };
    
    //створити обробники подій events над елементами обраними за селектором selector_elements
    //приклад events
    /*
    events={
        onclick     : "ClickBtnAddShelf",
        onmousemove : "MouseMoveBtnAddShelf"
    }
    */
    self.CreateEventsForElements=function(events, selector_elements){
        try{
            var elements=document.querySelectorAll(selector_elements);
            var l=elements.length;
            for(var i=0; i<l; i++){
                for(var event in events){
                    var code="elements["+i+"]."+event+"=function(ev){"+events[event]+"(ev)};";                    
                    eval(code);
                }
            }
        }catch(err){
            console.log("error: ", err);
        }
    };
    
    //клік в області креслення
    var ClickOnDraft=function(ev){ //console.log(ev);               
        var dataMouse={
            x     : ev.offsetX,
            y     : ev.offsetY,
            ctrl  : ev.ctrlKey,
            shift : ev.shiftKey,
            alt   : ev.altKey
        };
       
        //console.log(JSON.stringify(dataMouse));
                
        eval(action+"("+JSON.stringify(dataMouse)+ ");"); //                 
        //console.log(ev);
    };
    
    //рух курсора миші в області креслення
    var startMove=false;
    var oldMouse={};
    var MoveOnDraft=function(ev){                               
        var idMoveShelf=fd.GetIdMoveShelf();
        if (idMoveShelf && ev.buttons === 1){ //режим переміщення полиці
            //fd.OnMouseMoveShelf(ev);
            if (!startMove){ 
                startMove=true;
                oldMouse={
                    x: ev.offsetX,
                    y: ev.offsetY
                };
            }else{
                var dx=ev.offsetX-oldMouse.x;
                var dy=ev.offsetY-oldMouse.y;
                
                fd.MoveImgShelf(dx, dy);
                
                oldMouse={
                    x: ev.offsetX,
                    y: ev.offsetY
                };
            }                        
            
            //objDraft.style.cursor="move";
            
            //console.log("move shelf: ",fd.GetMoveShelf());
        }else{
            startMove=false;
            SetCursor();            
        };
        
        console.log("startMove: ", startMove);        
    };
    
    //клік на одній з кнопок вибору режиму роботи з полицями
    //(вибір режиму додавання: горизонтальна чи вертикальна полиця; режим видалення полиці)
    var ClickBtnWorkShelf=function(ev){
        action=ev.target.id; console.log(action);
        
        var elements=document.querySelectorAll(".rbtWorkShelf");
        var l=elements.length; 
        for(var i=0; i<l; i++){ 
            elements[i].setAttribute("style", "background-color: #999;");
        }        
        document.getElementById(action).setAttribute("style", "background-color: #777;");        
        SetCursor();
        
        //console.log(action, l, elements);
    };
    
    //додавання полиці
    var addShelf=function(data){       
        if (mouseIsFrameDraft){
            fd.addShelf({ //лінійні розміри передаються в px
                type: action,
                width: data.width, 
                depth: data.depth,                        
                start: {
                    x: data.x,
                    y: data.y
                }
            }); 
            
            ReCreateEventsForFrameDraft();
        }
    };
    
    //переміщення полиці - заглушка
    //реальне переміщення здійснюється на об*єкті полиці
    var moveShelf=function(data){};
            
    //додавання вертикальної полиці
    var addVShelf=function(data){
        
        
        data.depth=100; //!!!!!!!!
        
        fd.CalcHVShelf(data);
        
        addShelf(data);
        
        //console.log("add v shelf: ", data);
    };
    
    //додавання горизонтальної полиці
    var addHShelf=function(data){
                
        data.depth=100; //!!!!!!!!!!
        
        fd.CalcWHShelf(data);
        
        addShelf(data);
                
        //console.log("add h shelf: ", data);
    };
    
    //видалення полиці - тут це просто заглушка 
    //реальне видалення здійснюється на об*єкті fd ()
    var delShelf=function(data){};
    
    __constructor();
};