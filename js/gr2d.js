//бібліотека графічних примітивів на площині

//клас системи кооридинат
CJS_SC=function(prm){
    
    var ex=10;
    var ey=10;
    var x0=150;
    var y0=150;
    var width=300;
    var height=300;
    var color="#abc";
    
    if (typeof prm !=="undefined" && prm instanceof Object){
        if (typeof prm["ex"] !== "undefined")
            ex=prm["ex"];
        if (typeof prm["ey"] !== "undefined")
            ey=prm["ey"];
        if (typeof prm["x0"] !== "undefined")
            x0=prm["x0"];
        if (typeof prm["y0"] !== "undefined")
            y0=prm["y0"];
        if (typeof prm["width"] !== "undefined")
            width=prm["width"];
        if (typeof prm["height"] !== "undefined")
            height=prm["height"];
        if (typeof prm["color"] !== "undefined")
            color=prm["color"];
    }
    
    this.GetPrm=function(prm){
        var result=0;
        if (typeof prm !== "undefined"){            
            if (prm.search(/ex/i)>=0)
                result=ex;
            if (prm.search(/ey/i)>=0)
                result=ey;
            if (prm.search(/x0/i)>=0)
                result=x0;
            if (prm.search(/y0/i)>=0)
                result=y0;
            if (prm.search(/width/i)>=0)
                result=width;
            if (prm.search(/height/i)>=0)
                result=height;                                                
        }
        
        return result;
    };
                    
    this.GetScreenCoords=function(x, y){
        return {x: x0+ex*x, y: y0-ey*y};
    };
    
    this.GetRealCoords=function(x, y){
        return {x: (x-x0)/ex, y: (y0-y)/ey};
    };
    
    this.DrawAxises=function(canvas){
       canvas.Arrow({
           A: {x: 0, y: y0},
           B: {x: width, y: y0},           
           fill: "grey",
           h: 15,
           w: 8
       });
       canvas.Arrow({
           A: {x: x0, y: height},
           B: {x: x0, y: 0},           
           fill: "grey",
           h: 15,
           w: 8
       });        
    };
};

//клас вектора на площині
CVector2D=function(prm){
    var self=this;
    
    //координати вектора
    var x=0;
    var y=0;
    
    var A={x: 0, y: 0}; //початкова точка
    var B={x: 0, y: 0}; //кінцева точка
    
    if (typeof prm !== "undefined"){
        if (typeof prm.A !== "undefined" && typeof prm.A.x !== "undefined" && typeof prm.A.y !== "undefined" &&
            typeof prm.B !== "undefined" && typeof prm.B.x !== "undefined" && typeof prm.B.y !== "undefined"){
            A=prm.A;
            B=prm.B;           
        }
    }
    
    x=B.x-A.x;
    y=B.y-A.y;
    
    this.GetVector=function(){return {x: x, y: y};};    
    this.GetLength=function(){return Math.sqrt(x*x+y*y);};
    this.Reverse=function(){
        var dx=A.x;
        var dy=A.y;
        A.x=B.x;
        A.y=B.y;
        B.x=dx;
        B.y=dy;
        
        x=-x;
        y=-y;
    };
    
    //отримання точки, що лежить на відстані h від точки А або B на перпендикулярі до вектора АВ
    //можливі набори параметрів:
    //h, "A" або h, "A", "R" - на відстані h від точки A праворуч від вектора AB
    //h, "A", "L" - на відстані h від точки A ліворуч від вектора AB
    //h, "B" або h, "B", "R" - на відстані h від точки B праворуч від вектора AB
    //h, "B", "L" - на відстані h від точки B ліворуч від вектора AB
    this.GetPsetOnNormal=function(h, pset, side){
                
        //обчислення для точки B   
        var rev=false;
        if (typeof pset!=="undefined" && (pset==="B" || pset==="b")){      
            rev=true;
            self.Reverse();            
            if (typeof side!=="undefined" && side!=="L" && side!=="l" || typeof side==="undefined")
                side="L";
            else
                side="undefined";
        }
        
        var A_=y;
        var B_=-x;
        var C_=-A.y*B_-A.x*A_;
        var qw=A_*A_+B_*B_;
        var D_=h*Math.sqrt(qw)-C_;
        var E_=-B_*A.x+A_*A.y;
        
        //страховка від дуже короткого вектора (від ділення на нуль)
        if (Math.abs(qw)<0.0000001)
            qw=-1000;    
        
        var Cx=(A_*D_-B_*E_)/qw;
        var Cy=(B_*D_+A_*E_)/qw;                
        
        //обчислення для лівої сторони від напряму вектора AB
        if (typeof side!=="undefined" && (side==="L" || side==="l")){       
            Cx=2*A.x-Cx;
            Cy=2*A.y-Cy;      
        }
        
        if (rev)
            self.Reverse();
        
        return {x: Cx, y: Cy};
    };
    
    //отримання скалярного добутку векторів, що виходять з вершини А та напрямлені до вершин В та С
    this.GetScalarProd=function(A, B, C){
        var result=-100; //ознака помилки
        
        try{
            var V1=new CVector2D({A: A, B: B});
            var V2=new CVector2D({A: A, B: C});
            var cv1=V1.GetVector();
            var cv2=V2.GetVector();
            
            result=cv1.x*cv2.x+cv1.y*cv2.y;
        }catch (err){
            console.log(err);
        }
        
        return result;
    };
};

//клас відрізка на площині
CSegment2D=function(prm){
    var self=this;
    
    var id_belongs_obj=""; //id об*єкта, якому належить відрізок
    this.v1={x: 0, y: 0};
    this.v2={x: 1, y: 0};
    this.__delta=0.05;
    
    //коефіцієнти рівняння прямої ax+by+c=0, що проходить через вершини відрізка
    var a=0;
    var b=0;
    var c=0;
    
    try{
        if (typeof prm !== "undefined"){
            id_belongs_obj=prm["id_belongs_obj"];
            self.v1=prm["v1"];
            self.v2=prm["v2"];
        }
    } catch (err) {
        console.log("CSegment2D.constructor: ", err);
    }
    
    //
    this.GetIdBelongsObj=function(){ return id_belongs_obj; };
    
    //обчислення коефіцієнтів рівняння прямої ax+by+c=0, що проходить через вершини відрізка
    this.CalcCoefStraight=function(){
        try{
            var yBA=this.v2.y-this.v1.y;
            var xBA=this.v2.x-this.v1.x;
    
            a=yBA;
            b=-xBA;
            c=-yBA*this.v1.x+xBA*this.v1.y;
    
            if (Math.abs(this.v1.x-this.v2.x)<0.00001){
                this.a=1;
                this.b=0;
                this.c=this.v1.x;
            };
        }catch (err){
            console.log("CSegment2D.CalcCoefStraight: ", err);
        }
    };
    
    //отримання коефіцієнтів рівняння прямої ax+by+c=0, що проходить через вершини відрізка
    this.GetCoefStraight=function(){return {a: a, b: b, c: c};};
    
    //отримання у(x)-координати точки на відрізку для вказаної x(y)-координати, яка належить відрізку
    //!!! - попередньо повинні бути обчислені коефіцієнти рівняння прямої - !!!
    this.GetXorY=function(arg, typeArg){
        var result=-1000; //точка не належить відрізку або відрізок проектується у цю точку
        
        var v1argX=self.v1.x;
        var v1argY=self.v1.y;
        var v2argX=self.v2.x;
        var v2argY=self.v2.y;
        
        var aArg=a;
        var bArg=b;
        if (typeArg==="y" || typeArg==="Y"){
            v1argX=self.v1.y;
            v1argY=self.v1.x;
            v2argX=self.v2.y;
            v2argY=self.v2.x;
        
            aArg=b;
            bArg=a;
        }
        
        var minArg=v1argX;
        var maxArg=v2argX;
        if (minArg>maxArg){
            var dArg=minArg;
            minArg=maxArg;
            maxArg=dArg;
        }
                
        if (Math.abs(arg-v1argX)<0.0001)
            result=v1argY;
        else
        if (Math.abs(arg-v2argX)<0.0001)
            result=v2argY;
        else
        if (arg>minArg && arg<maxArg && Math.abs(bArg)>0.0001)
            result=(-c-aArg*arg)/bArg;
    
        //!!!!!!!!!!
        //console.log(result, minArg, arg, maxArg, bArg);
                
        return result;
    };        
    this.GetY=function(x){ return self.GetXorY(x, "x");};
    this.GetX=function(y){ return self.GetXorY(y, "y");};            
    
    //обчислення координат середини відрізка
    this.GetCenterSegment=function(){
        return {x: (self.v1.x+self.v2.x)/2, y: (self.v1.y+self.v2.y)/2};
    };
    
    //обчислення довжини відрізка
    this.GetLength=function(){
        return Math.sqrt(Math.pow(self.v1.x-self.v2.x, 2)+Math.pow(self.v1.y-self.v2.y, 2));
    };
    
    //визначення належності точки до відрізка
    this.PsetInSegment=function(pset){
        var result=0;
        try{
            var a=Math.sqrt(Math.pow(pset.x-self.v1.x, 2)+Math.pow(pset.y-self.v1.y, 2));
            var b=Math.sqrt(Math.pow(pset.x-self.v2.x, 2)+Math.pow(pset.y-self.v2.y, 2));
            var c=Math.sqrt(Math.pow(self.v2.x-self.v1.x, 2)+Math.pow(self.v2.y-self.v1.y, 2));
            if (Math.abs(a+b-c)<this.__delta)
                result=1;
            else
                result=Math.abs(a+b-c);
        } catch (err) {
            result=-1;
            console.log(err);
        };
        
        return result;
    };
    
};

//клас контура кімнати
COutline=function(prm){    
    var self=this;
        
    var minX=1000;
    var minY=1000;
    var maxX=-1000;
    var maxY=-1000;
    var S=0;
    var P=0;
            
    this.psets={
        p1: {name: "A", x: 0, y: 0},
        p2: {name: "B", x: 0, y: 5},
        p3: {name: "C", x: 10, y: 5},
        p4: {name: "D", x: 10, y: 0}
    };    
    
    if (typeof prm !== "undefined"){
        if (typeof prm['psets'] !== "undefined"){
            var psets=prm['psets'];
            for(var pset in psets){                
                if (typeof psets[pset].x !== "undefined" &&
                    typeof psets[pset].y !== "undefined" &&
                    typeof psets[pset].name !== "undefined"){
                    self.psets[pset]=psets[pset];         
                }
            }
        }
    }
    
    this.GetCountVertex=function(){ return Object.keys(self.psets).length;};
    
    this.GetMin=function(prm){
        var result=0;
        if (prm==="x" || prm==="X")
            result=minX;
        if (prm==="y" || prm==="Y")
            result=minY;
        
        return result;
    };
    
    this.GetMax=function(prm){
        var result=0;
        if (prm==="x" || prm==="X")
            result=maxX;
        if (prm==="y" || prm==="Y")
            result=maxY;
        
        return result;
    };
    
    this.GetS=function(){return S;};
    this.GetP=function(){return P;};
        
    //
    this.each=function(prm){        
        
        var equalX=false;       //для точок з вказаними іменами у масиві namesEqual зробити абсцису вказаного значення valEqualX
        var equalY=false;       //для точок з вказаними іменами у масиві namesEqual зробити ординату вказаного значення valEqualY
        var min=false;          //шукати мінімальні значення координат контура
        var max=false;          //шукати максимальні значення координат контура
        var square=false;       //обчислювати площу фігури обмеженої контуром
        var perimeter=false;    //обчислювати периметр фігури обмеженої контуром
        if (typeof prm !=="undefined" ){
            if (typeof prm["pattern"]!=="undefined"){
                if (typeof prm["namesEqual"]!=="undefined" && prm["namesEqual"] instanceof Array){
                    if (prm["pattern"].search(/equalX/i)>=0 && typeof prm["valEqualX"])
                        equalX=true;                    
                    if (prm["pattern"].search(/equalY/i)>=0 && typeof prm["valEqualY"])
                        equalY=true;                    
                }
                if (prm["pattern"].search(/min/i)>=0)
                    min=true;
                if (prm["pattern"].search(/max/i)>=0)
                    max=true;
                if (prm["pattern"].search(/square|perimeter/i)>=0){
                    var cncp=1;                    
                    var first={};
                    var memFirst={};
                    var next={};
                                                            
                    if (prm["pattern"].search(/square/i)>=0) square=true;
                    if (prm["pattern"].search(/perimeter/i)>=0) perimeter=true;
                                                                
                    S=0;
                    P=0;
                }
            }                        
        }
                
        for (var pset in self.psets){            
            //
            if (equalX && prm["namesEqual"].indexOf(self.psets[pset].name)>=0)
                self.psets[pset].x=prm["valEqualX"];                        
            //
            if (equalY && prm["namesEqual"].indexOf(self.psets[pset].name)>=0)
                self.psets[pset].y=prm["valEqualY"];                        
            //
            if (min){
                if (self.psets[pset].x<minX)
                    minX=self.psets[pset].x;
                if (self.psets[pset].y<minY)
                    minY=self.psets[pset].y;
            }            
            //
            if (max){
                if (self.psets[pset].x>maxX)
                    maxX=self.psets[pset].x;
                if (self.psets[pset].y>maxY)
                    maxY=self.psets[pset].y;
            }
            //
            if (square || perimeter){
                if (cncp===1){
                    first=self.psets[pset];
                    memFirst=self.psets[pset];
                }else{
                    next=self.psets[pset];
                    if (square)
                        S+=CalcSquareTrapeze(first, next);
                    if (perimeter)
                        P+=CalcLengthSegment(first, next);
                    first=next;
                } 
                cncp++;
            }
            
            //console.log(self.psets[pset]);
        }
        if (square){
            S+=CalcSquareTrapeze(first, memFirst);
            S=Math.abs(S);
        }
        if (perimeter)
            P+=CalcLengthSegment(first, memFirst);
    };
    
    //обчислення площі трапеції під вектором р1р2
    CalcSquareTrapeze=function(p1, p2){                      
        var vX=p2.x-p1.x;
        var dY=(p2.y+p1.y)/2;
                                
        return vX*dY;                        
    };
    
    //обчислення довжини відрізка між точками p1, p2
    CalcLengthSegment=function(p1, p2){
        var X=Math.pow(p2.x-p1.x, 2);
        var Y=Math.pow(p2.y-p1.y, 2);
        
        return Math.sqrt(X+Y);
    };
    
    //обчислення площі фігури обмеженої контуром
    this.CalcSquare=function(){        
        this.each({pattern: "square"});        
        
        return S;
    };
    
    //обчислення периметру фігури обмеженої контуром
    this.CalcPerimeter=function(){
        this.each({pattern: "perimeter"});
        
        return P;
    };
    
    //обчислення довжини відрізка ламаної, заданого індексами вершин
    //this.CalcPerimeter
};

//клас прямокутника
CRect=function(prm){
    var self=this;
    
    this.width=1;
    this.height=1;
    
    if (typeof prm !== "undefined"){
        if (typeof prm['width'] !== "undefined"){
            self.width=prm['width'];
        }
        if (typeof prm['height'] !== "undefined"){
            self.height=prm['height'];
        }
    }
    
    this.CalcPerimeter=function(){return 2*(self.width+self.height);};
    this.CalcSquare=function(){return self.width*self.height;};
};


