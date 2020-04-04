
<style>
    svg{
        margin: 5px;
    }
    
    #draft{
       width: 700px;
       height: 500px;
       border: 1px solid grey;
       
       /*cursor: url(cursors/addVShelf.cur), auto;*/
    }
    
    [id^='id_shelf_']{
        cursor: pointer;
    }
    
    /*
    [id^='id_shelf_']:hover{
       fill: rgb(228, 228, 228) !important;
    }
    */
    
    .fill_under_cursor{
        fill: rgb(228, 228, 228) !important;
    }
    
    .fill_standart{
        fill: white !important;
    }
    
    .groupButtons{        
        padding: 5px;
        border: 1px solid darkgrey;
        background: lightgray;
        
    }
    
    .rbtWorkShelf{
        width: 50px;
        height: 50px;
        border: 1px solid gray;
        border-radius: 4px;
        background-color: #999;
        padding-left: 10px;
        padding-right: 10px;
        font-size: 30px;
        font-weight: bold;
        text-align: center;
        cursor: pointer;
    }
    .rbtWorkShelf:hover{
        background-color: #777;
    }
    
    #delShelf{
        margin-left: 30px;
        color: red;
    }
</style>

<svg id="draft"></svg>
<div id="panel">        
    <div class="groupButtons"> <!-- buttons -->
        <span class="rbtWorkShelf" id="addHShelf">H</span>
        <span class="rbtWorkShelf" id="addVShelf">V</span>
        <span class="rbtWorkShelf" id="delShelf">D</span>
    </div>
</div>

<script src="js/main.js"></script>
<script src="js/dr2d.js"></script>
<script src="js/svg.js"></script>
<script src="js/frame_draft.js"></script>
<script src="js/shelf.js"></script>
<script src="js/furniture_design.js"></script>

<script>    
    var fd=new CFurnitureDesign(); //design-controller
    var main=new CMain; //main-controller
</script>
