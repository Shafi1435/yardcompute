const GA_MEASUREMENT_ID="G-BLY14S21HM";
function initAnalytics(){
  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
  window.gtag("js",new Date());
  window.gtag("config",GA_MEASUREMENT_ID,{anonymize_ip:true});
  if(!document.querySelector('script[data-yardcompute-ga4]')){
    const s=document.createElement("script");
    s.async=true;
    s.src="https://www.googletagmanager.com/gtag/js?id="+encodeURIComponent(GA_MEASUREMENT_ID);
    s.dataset.yardcomputeGa4="true";
    document.head.appendChild(s);
  }
  window.addEventListener("calculator_view",e=>window.gtag("event","calculator_view",{calculator_name:e.detail?.calculator||"unknown"}));
  window.addEventListener("calculator_start",e=>window.gtag("event","calculator_start",{calculator_name:e.detail?.calculator||"unknown"}));
  window.addEventListener("calculator_completed",e=>window.gtag("event","calculator_completed",{calculator_name:e.detail?.calculator||"unknown"}));
}
const unitGroups={
  lengthFt:{base:"ft",options:[["ft","ft"],["m","m"]]},
  dimensionIn:{base:"in",options:[["in","in"],["ft","ft"],["cm","cm"]]},
  density:{base:"lb/cu ft",options:[["lb/cu ft","lb/cu ft"],["kg/m3","kg/m³"]]}
};
const configs={
"fence-calculator":{title:"Fence Calculator",desc:"Estimate fence sections, posts, and approximate materials from fence length and post spacing.",fields:[["length","Fence length","ft",1,"lengthFt"],["spacing","Post spacing","ft",8,"lengthFt"]],calc(v){const sections=Math.ceil(v.length/v.spacing);return [["Fence sections",sections+" sections"],["Posts",sections+1+" posts"],["Approx. fence line",v.length.toFixed(2)+" ft"]]}},
"fence-post-spacing-calculator":{title:"Fence Post Spacing Calculator",desc:"Calculate practical post count and adjusted spacing for a fence run.",fields:[["length","Fence length","ft",1,"lengthFt"],["spacing","Target spacing","ft",8,"lengthFt"]],calc(v){const posts=Math.ceil(v.length/v.spacing)+1;const bays=posts-1;return [["Posts",posts+" posts"],["Fence bays",bays+" bays"],["Adjusted spacing",(v.length/bays).toFixed(2)+" ft"]]}},"fence-material-calculator":{title:"Fence Material Calculator",desc:"Estimate fence posts, rails, pickets, and adjusted spacing for a straight fence run.",fields:[["length","Fence length","ft",100,"lengthFt"],["spacing","Target post spacing","ft",8,"lengthFt"],["rails","Rails per section","rails",3],["picket","Picket width","in",5.5,"dimensionIn"],["gap","Picket gap","in",0.125,"dimensionIn"],["waste","Waste allowance","%",10]],calc(v){const sections=Math.ceil(v.length/v.spacing);const posts=sections+1;const railBase=sections*v.rails;const railOrder=Math.ceil(railBase*(1+v.waste/100));const picketBase=Math.ceil((v.length*12)/(v.picket+v.gap));const picketOrder=Math.ceil(picketBase*(1+v.waste/100));return [["Fence sections",sections+" sections"],["Posts",posts+" posts"],["Adjusted post spacing",(v.length/sections).toFixed(2)+" ft"],["Rails to order",railOrder+" rails"],["Pickets to order",picketOrder+" pickets"]]}},
"fence-post-concrete-calculator":{title:"Fence Post Concrete Calculator",desc:"Estimate concrete volume for fence post holes using hole diameter, depth, and post count.",fields:[["posts","Number of posts","posts",10],["diameter","Hole diameter","in",12,"dimensionIn"],["depth","Hole depth","in",24,"dimensionIn"]],calc(v){const one=Math.PI*Math.pow(v.diameter/24,2)*(v.depth/12);const total=one*v.posts;return [["Concrete volume",total.toFixed(2)+" cu ft"],["Approx. 80-lb bags",Math.ceil(total/0.60)+" bags"],["Approx. 60-lb bags",Math.ceil(total/0.45)+" bags"]]}},
"deck-board-calculator":{title:"Deck Board Calculator",desc:"Estimate the number of deck boards needed from deck dimensions, actual board width, gap, and board run length.",fields:[["length","Deck length","ft",12,"lengthFt"],["width","Deck width","ft",16,"lengthFt"],["board","Board width","in",5.5,"dimensionIn"],["gap","Board gap","in",0.125,"dimensionIn"]],calc(v){const widthIn=v.width*12;const boards=Math.ceil((widthIn+v.gap)/(v.board+v.gap));const linearFeet=boards*v.length;return [["Boards needed",boards+" boards"],["Base linear feet",linearFeet.toFixed(1)+" ft"],["Board length",v.length.toFixed(2)+" ft"],["Deck area",(v.length*v.width).toFixed(1)+" sq ft"]]}},
"deck-board-spacing-calculator":{title:"Deck Board Spacing Calculator",desc:"Calculate the number of deck boards and actual gap from deck width and board width.",fields:[["width","Deck width","ft",12,"lengthFt"],["board","Board width","in",5.5,"dimensionIn"],["gap","Desired gap","in",0.125,"dimensionIn"]],calc(v){const w=v.width*12;const n=Math.floor((w+v.gap)/(v.board+v.gap));const actual=n>1?(w-n*v.board)/(n-1):0;return [["Boards",n+" boards"],["Approx. actual gap",Math.max(0,actual).toFixed(3)+" in"],["Coverage width",w.toFixed(1)+" in"]]}},
"concrete-calculator":{title:"Concrete Calculator",desc:"Estimate concrete volume for rectangular slabs, pads, and footings.",fields:[["length","Length","ft",10,"lengthFt"],["width","Width","ft",10,"lengthFt"],["depth","Thickness","in",4,"dimensionIn"]],calc(v){const cu=v.length*v.width*(v.depth/12);return [["Concrete",cu.toFixed(2)+" cu ft"],["Concrete with 10% waste",(cu*1.10).toFixed(2)+" cu ft"],["Approx. cubic yards",(cu/27*1.10).toFixed(2)+" yd³"]]}},
"post-hole-concrete-calculator":{title:"Post Hole Concrete Calculator",desc:"Estimate concrete needed for cylindrical post holes.",fields:[["posts","Number of holes","posts",4],["diameter","Hole diameter","in",12,"dimensionIn"],["depth","Hole depth","in",24,"dimensionIn"]],calc(v){const one=Math.PI*Math.pow(v.diameter/24,2)*(v.depth/12);const total=one*v.posts;return [["Concrete",total.toFixed(2)+" cu ft"],["With 10% waste",(total*1.10).toFixed(2)+" cu ft"],["Approx. 80-lb bags (0.60 cu ft yield)",Math.ceil(total*1.10/0.60)+" bags"]]}},
"gravel-calculator":{title:"Gravel Calculator",desc:"Estimate gravel volume and weight for a rectangular area.",fields:[["length","Length","ft",20,"lengthFt"],["width","Width","ft",10,"lengthFt"],["depth","Depth","in",3,"dimensionIn"],["density","Gravel density","lb/cu ft",105,"density"]],calc(v){const cu=v.length*v.width*(v.depth/12);return [["Gravel volume",cu.toFixed(2)+" cu ft"],["With 10% waste",(cu*1.10).toFixed(2)+" cu ft"],["Estimated weight",(cu*1.10*v.density/2000).toFixed(2)+" tons"]]}},
"driveway-gravel-calculator":{title:"Driveway Gravel Calculator",desc:"Estimate gravel needed for a driveway based on length, width, depth, and density.",fields:[["length","Driveway length","ft",40,"lengthFt"],["width","Driveway width","ft",12,"lengthFt"],["depth","Gravel depth","in",4,"dimensionIn"],["density","Gravel density","lb/cu ft",105,"density"]],calc(v){const cu=v.length*v.width*(v.depth/12);const waste=cu*1.10;return [["Base volume",cu.toFixed(2)+" cu ft"],["Order volume with 10% waste",waste.toFixed(2)+" cu ft"],["Estimated weight",(waste*v.density/2000).toFixed(2)+" tons"]]}},
"paver-calculator":{title:"Paver Calculator",desc:"Estimate the number of pavers needed for a rectangular patio, walkway, or project area.",fields:[["length","Project length","ft",12,"lengthFt"],["width","Project width","ft",20,"lengthFt"],["paverLength","Paver length","in",6,"dimensionIn"],["paverWidth","Paver width","in",6,"dimensionIn"],["waste","Waste allowance","%",10]],calc(v){const area=v.length*v.width;const paverArea=(v.paverLength/12)*(v.paverWidth/12);const base=area/paverArea;const order=Math.ceil(base*(1+v.waste/100));return [["Project area",area.toFixed(2)+" sq ft"],["Pavers without waste",Math.ceil(base)+" pavers"],["Pavers to order",order+" pavers"]]}},"paver-base-sand-calculator":{title:"Paver Base and Bedding Sand Calculator",desc:"Estimate paver base aggregate and bedding sand volume from project dimensions, layer depths, and waste allowance.",fields:[["length","Project length","ft",12,"lengthFt"],["width","Project width","ft",20,"lengthFt"],["baseDepth","Base depth","in",6,"dimensionIn"],["sandDepth","Bedding sand depth","in",1,"dimensionIn"],["waste","Waste allowance","%",10]],calc(v){const area=v.length*v.width;const baseCu=area*(v.baseDepth/12);const sandCu=area*(v.sandDepth/12);return [["Project area",area.toFixed(2)+" sq ft"],["Base volume with waste",(baseCu*(1+v.waste/100)).toFixed(2)+" cu ft"],["Base volume",(baseCu*(1+v.waste/100)/27).toFixed(2)+" yd³"],["Bedding sand with waste",(sandCu*(1+v.waste/100)).toFixed(2)+" cu ft"],["Bedding sand volume",(sandCu*(1+v.waste/100)/27).toFixed(2)+" yd³"]]}},"mulch-calculator":{title:"Mulch Calculator",desc:"Estimate mulch volume for garden beds and landscaping areas.",fields:[["length","Area length","ft",20,"lengthFt"],["width","Area width","ft",8,"lengthFt"],["depth","Mulch depth","in",3,"dimensionIn"]],calc(v){const cu=v.length*v.width*(v.depth/12);return [["Mulch",cu.toFixed(2)+" cu ft"],["With 10% waste",(cu*1.10).toFixed(2)+" cu ft"],["Cubic yards",(cu/27*1.10).toFixed(2)+" yd³"]]}},"mulch-bag-calculator":{title:"Mulch Bag Calculator",desc:"Estimate mulch volume and the number of bags needed from garden bed dimensions, depth, bag volume, and waste.",fields:[["length","Area length","ft",20,"lengthFt"],["width","Area width","ft",8,"lengthFt"],["depth","Mulch depth","in",3,"dimensionIn"],["bagVolume","Bag volume","cu ft",2],["waste","Waste allowance","%",10]],calc(v){const base=v.length*v.width*(v.depth/12);const order=base*(1+v.waste/100);return [["Project area",(v.length*v.width).toFixed(2)+" sq ft"],["Mulch volume with waste",order.toFixed(2)+" cu ft"],["Cubic yards",(order/27).toFixed(2)+" yd³"],["Bags to order",Math.ceil(order/v.bagVolume)+" bags"]]}}
,"fence-picket-calculator":{title:"Fence Picket Calculator",desc:"Estimate the number of fence pickets needed from fence length, picket width, gap, and waste allowance.",fields:[["length","Fence length","ft",100,"lengthFt"],["picket","Picket width","in",5.5,"dimensionIn"],["gap","Picket gap","in",0.125,"dimensionIn"],["waste","Waste allowance","%",10]],calc(v){const base=Math.ceil((v.length*12)/(v.picket+v.gap));const order=Math.ceil(base*(1+v.waste/100));return [["Fence length",v.length.toFixed(2)+" ft"],["Pickets without waste",base+" pickets"],["Pickets to order",order+" pickets"]]}},"fence-rail-calculator":{title:"Fence Rail Calculator",desc:"Estimate the number of fence rails needed from fence length, post spacing, rails per section, and waste.",fields:[["length","Fence length","ft",100,"lengthFt"],["spacing","Post spacing","ft",8,"lengthFt"],["rails","Rails per section","rails",3],["waste","Waste allowance","%",10]],calc(v){const sections=Math.ceil(v.length/v.spacing);const base=sections*v.rails;const order=Math.ceil(base*(1+v.waste/100));return [["Fence sections",sections+" sections"],["Rails without waste",base+" rails"],["Rails to order",order+" rails"]]}},"deck-joist-calculator":{title:"Deck Joist Calculator",desc:"Estimate deck joist count and linear feet from deck dimensions and target joist spacing.",fields:[["length","Deck length","ft",16,"lengthFt"],["width","Deck width","ft",12,"lengthFt"],["spacing","Joist spacing","in",16,"dimensionIn"],["waste","Waste allowance","%",10]],calc(v){const count=Math.ceil((v.width*12)/v.spacing)+1;const lf=count*v.length;return [["Deck area",(v.length*v.width).toFixed(2)+" sq ft"],["Joists",count+" joists"],["Base linear feet",lf.toFixed(1)+" ft"],["Linear feet with waste",(lf*(1+v.waste/100)).toFixed(1)+" ft"]]}},"deck-joist-spacing-calculator":{title:"Deck Joist Spacing Calculator",desc:"Calculate deck joist count and adjusted spacing from deck width and a target joist spacing.",fields:[["width","Deck width","ft",12,"lengthFt"],["spacing","Target joist spacing","in",16,"dimensionIn"]],calc(v){const width=v.width*12;const joists=Math.ceil(width/v.spacing)+1;const bays=joists-1;return [["Deck width",width.toFixed(1)+" in"],["Joists",joists+" joists"],["Joist bays",bays+" bays"],["Adjusted spacing",(width/bays).toFixed(2)+" in"]]}},"concrete-footing-calculator":{title:"Concrete Footing Calculator",desc:"Estimate concrete volume and bag quantities for cylindrical footings from diameter, depth, count, and waste.",fields:[["footings","Number of footings","footings",4],["diameter","Footing diameter","in",18,"dimensionIn"],["depth","Footing depth","in",24,"dimensionIn"],["waste","Waste allowance","%",10]],calc(v){const one=Math.PI*Math.pow(v.diameter/24,2)*(v.depth/12);const total=one*v.footings;const order=total*(1+v.waste/100);return [["Base concrete",total.toFixed(2)+" cu ft"],["Order volume",order.toFixed(2)+" cu ft"],["Cubic yards",(order/27).toFixed(2)+" yd³"],["Approx. 80-lb bags",Math.ceil(order/0.60)+" bags"]]}},"concrete-bag-calculator":{title:"Concrete Bag Calculator",desc:"Estimate the number of concrete bags needed for a rectangular project from dimensions, bag yield, and waste.",fields:[["length","Length","ft",10,"lengthFt"],["width","Width","ft",10,"lengthFt"],["depth","Thickness","in",4,"dimensionIn"],["bagYield","Bag yield","cu ft",0.6],["waste","Waste allowance","%",10]],calc(v){const base=v.length*v.width*(v.depth/12);const order=base*(1+v.waste/100);return [["Base volume",base.toFixed(2)+" cu ft"],["Order volume",order.toFixed(2)+" cu ft"],["Cubic yards",(order/27).toFixed(2)+" yd³"],["Bags to order",Math.ceil(order/v.bagYield)+" bags"]]}},"pea-gravel-calculator":{title:"Pea Gravel Calculator",desc:"Estimate pea gravel volume and weight from project dimensions, depth, and material density.",fields:[["length","Project length","ft",20,"lengthFt"],["width","Project width","ft",10,"lengthFt"],["depth","Gravel depth","in",2,"dimensionIn"],["density","Pea gravel density","lb/cu ft",105,"density"]],calc(v){const cu=v.length*v.width*(v.depth/12);const order=cu*1.1;return [["Project area",(v.length*v.width).toFixed(2)+" sq ft"],["Volume with 10% waste",order.toFixed(2)+" cu ft"],["Cubic yards",(order/27).toFixed(2)+" yd³"],["Estimated weight",(order*v.density/2000).toFixed(2)+" tons"]]}},"gravel-bag-calculator":{title:"Gravel Bag Calculator",desc:"Estimate gravel volume and whole bag quantity from project dimensions, bag yield, and waste allowance.",fields:[["length","Project length","ft",20,"lengthFt"],["width","Project width","ft",10,"lengthFt"],["depth","Gravel depth","in",3,"dimensionIn"],["bagYield","Bag yield","cu ft",0.5],["waste","Waste allowance","%",10]],calc(v){const base=v.length*v.width*(v.depth/12);const order=base*(1+v.waste/100);return [["Project area",(v.length*v.width).toFixed(2)+" sq ft"],["Volume with waste",order.toFixed(2)+" cu ft"],["Cubic yards",(order/27).toFixed(2)+" yd³"],["Bags to order",Math.ceil(order/v.bagYield)+" bags"]]}},"paver-edge-restraint-calculator":{title:"Paver Edge Restraint Calculator",desc:"Estimate linear feet of paver edge restraint needed around a rectangular project with a planning allowance.",fields:[["length","Project length","ft",20,"lengthFt"],["width","Project width","ft",12,"lengthFt"],["waste","Waste allowance","%",10]],calc(v){const perimeter=2*(v.length+v.width);const order=perimeter*(1+v.waste/100);return [["Project perimeter",perimeter.toFixed(2)+" ft"],["Edge restraint with waste",order.toFixed(2)+" linear ft"],["Suggested order quantity",Math.ceil(order)+" linear ft"]]}},"topsoil-calculator":{title:"Topsoil Calculator",desc:"Estimate topsoil volume in cubic feet and cubic yards from project dimensions, depth, and waste.",fields:[["length","Area length","ft",20,"lengthFt"],["width","Area width","ft",10,"lengthFt"],["depth","Topsoil depth","in",4,"dimensionIn"],["waste","Waste allowance","%",10]],calc(v){const base=v.length*v.width*(v.depth/12);const order=base*(1+v.waste/100);return [["Project area",(v.length*v.width).toFixed(2)+" sq ft"],["Topsoil with waste",order.toFixed(2)+" cu ft"],["Cubic yards",(order/27).toFixed(2)+" yd³"]]}},"sod-calculator":{title:"Sod Calculator",desc:"Estimate lawn area and sod quantity with a planning allowance from rectangular lawn dimensions.",fields:[["length","Lawn length","ft",40,"lengthFt"],["width","Lawn width","ft",20,"lengthFt"],["waste","Waste allowance","%",10]],calc(v){const area=v.length*v.width;const order=area*(1+v.waste/100);return [["Lawn area",area.toFixed(2)+" sq ft"],["Sod area with waste",order.toFixed(2)+" sq ft"],["Sod area to order",Math.ceil(order)+" sq ft"]]}}};
"fence-gate-calculator":{title:"Fence Gate Calculator",desc:"Estimate fence gate opening area and approximate picket quantity for a rectangular gate.",fields:[["width","Gate width","ft",4,"lengthFt"],["height","Gate height","ft",6,"lengthFt"],["picket","Picket width","in",5.5,"dimensionIn"],["gap","Picket gap","in",0.125,"dimensionIn"],["waste","Waste allowance","%",10]],calc(v){const area=v.width*v.height;const pickets=Math.ceil((v.width*12)/(v.picket+v.gap));return [["Gate area",area.toFixed(2)+" sq ft"],["Pickets without waste",pickets+" pickets"],["Pickets to order",Math.ceil(pickets*(1+v.waste/100))+" pickets"]]}},
"fence-picket-spacing-calculator":{title:"Fence Picket Spacing Calculator",desc:"Calculate picket count and adjusted gap from fence length, picket width, and maximum gap.",fields:[["length","Fence length","ft",100,"lengthFt"],["picket","Picket width","in",5.5,"dimensionIn"],["gap","Maximum gap","in",2,"dimensionIn"]],calc(v){const w=v.length*12;const n=Math.floor((w+v.gap)/(v.picket+v.gap));const gap=n>1?(w-n*v.picket)/(n-1):0;return [["Fence length",v.length.toFixed(2)+" ft"],["Pickets",n+" pickets"],["Adjusted gap",Math.max(0,gap).toFixed(3)+" in"]]}},
"fence-panel-calculator":{title:"Fence Panel Calculator",desc:"Estimate the number of fence panels and posts for a straight fence run.",fields:[["length","Fence length","ft",100,"lengthFt"],["panel","Panel width","ft",8,"lengthFt"],["waste","Waste allowance","%",10]],calc(v){const panels=Math.ceil(v.length/v.panel);const order=Math.ceil(panels*(1+v.waste/100));return [["Fence panels",panels+" panels"],["Panels to order",order+" panels"],["Posts",panels+1+" posts"]]}},
"deck-screw-calculator":{title:"Deck Screw Calculator",desc:"Estimate deck screws from deck dimensions, board width, joist spacing, and screws per board crossing.",fields:[["length","Deck length","ft",16,"lengthFt"],["width","Deck width","ft",12,"lengthFt"],["board","Board width","in",5.5,"dimensionIn"],["gap","Board gap","in",0.125,"dimensionIn"],["spacing","Joist spacing","in",16,"dimensionIn"],["screws","Screws per crossing","screws",2],["waste","Waste allowance","%",10]],calc(v){const rows=Math.ceil((v.width*12+v.gap)/(v.board+v.gap));const crossings=Math.ceil(v.length*12/v.spacing)+1;const base=rows*crossings*v.screws;return [["Deck boards",rows+" boards"],["Joist crossings",crossings+" per board"],["Screws to order",Math.ceil(base*(1+v.waste/100))+" screws"]]}},
"deck-footing-calculator":{title:"Deck Footing Calculator",desc:"Estimate cylindrical deck footing concrete volume and bag quantity from footing dimensions and count.",fields:[["footings","Number of footings","footings",6],["diameter","Footing diameter","in",12,"dimensionIn"],["depth","Footing depth","in",36,"dimensionIn"],["waste","Waste allowance","%",10]],calc(v){const one=Math.PI*Math.pow(v.diameter/24,2)*(v.depth/12);const base=one*v.footings;const order=base*(1+v.waste/100);return [["Base concrete",base.toFixed(2)+" cu ft"],["Order volume",order.toFixed(2)+" cu ft"],["Cubic yards",(order/27).toFixed(2)+" yd³"],["Approx. 80-lb bags",Math.ceil(order/0.60)+" bags"]]}},
"concrete-patio-calculator":{title:"Concrete Patio Calculator",desc:"Estimate concrete volume and cubic yards for a rectangular patio with a waste allowance.",fields:[["length","Patio length","ft",20,"lengthFt"],["width","Patio width","ft",12,"lengthFt"],["depth","Slab thickness","in",4,"dimensionIn"],["waste","Waste allowance","%",10]],calc(v){const base=v.length*v.width*(v.depth/12);const order=base*(1+v.waste/100);return [["Patio area",(v.length*v.width).toFixed(2)+" sq ft"],["Base concrete",base.toFixed(2)+" cu ft"],["Order volume",order.toFixed(2)+" cu ft"],["Cubic yards",(order/27).toFixed(2)+" yd³"]]}},
"concrete-column-calculator":{title:"Concrete Column Calculator",desc:"Estimate concrete volume and cubic yards for cylindrical concrete columns.",fields:[["columns","Number of columns","columns",4],["diameter","Column diameter","in",12,"dimensionIn"],["height","Column height","ft",8,"lengthFt"],["waste","Waste allowance","%",10]],calc(v){const one=Math.PI*Math.pow(v.diameter/24,2)*v.height;const base=one*v.columns;const order=base*(1+v.waste/100);return [["Base concrete",base.toFixed(2)+" cu ft"],["Order volume",order.toFixed(2)+" cu ft"],["Cubic yards",(order/27).toFixed(2)+" yd³"]]}},
"gravel-tonnage-calculator":{title:"Gravel Tonnage Calculator",desc:"Convert gravel volume to approximate tons using material density.",fields:[["length","Project length","ft",20,"lengthFt"],["width","Project width","ft",10,"lengthFt"],["depth","Gravel depth","in",3,"dimensionIn"],["density","Gravel density","lb/cu ft",105,"density"]],calc(v){const cu=v.length*v.width*(v.depth/12);return [["Volume",cu.toFixed(2)+" cu ft"],["Cubic yards",(cu/27).toFixed(2)+" yd³"],["Estimated weight",(cu*v.density/2000).toFixed(2)+" tons"]]}},
"river-rock-calculator":{title:"River Rock Calculator",desc:"Estimate river rock volume and approximate weight from area, depth, and material density.",fields:[["length","Project length","ft",20,"lengthFt"],["width","Project width","ft",10,"lengthFt"],["depth","Rock depth","in",2,"dimensionIn"],["density","River rock density","lb/cu ft",100,"density"],["waste","Waste allowance","%",10]],calc(v){const base=v.length*v.width*(v.depth/12);const order=base*(1+v.waste/100);return [["Project area",(v.length*v.width).toFixed(2)+" sq ft"],["Volume with waste",order.toFixed(2)+" cu ft"],["Cubic yards",(order/27).toFixed(2)+" yd³"],["Estimated weight",(order*v.density/2000).toFixed(2)+" tons"]]}},
"paver-sand-calculator":{title:"Paver Sand Calculator",desc:"Estimate bedding sand volume for a paver project from area, sand depth, and waste.",fields:[["length","Project length","ft",20,"lengthFt"],["width","Project width","ft",12,"lengthFt"],["depth","Sand depth","in",1,"dimensionIn"],["waste","Waste allowance","%",10]],calc(v){const base=v.length*v.width*(v.depth/12);const order=base*(1+v.waste/100);return [["Project area",(v.length*v.width).toFixed(2)+" sq ft"],["Sand with waste",order.toFixed(2)+" cu ft"],["Cubic yards",(order/27).toFixed(2)+" yd³"]]}},
"grass-seed-calculator":{title:"Grass Seed Calculator",desc:"Estimate grass seed quantity from lawn area and the seeding rate printed on the seed product.",fields:[["length","Lawn length","ft",40,"lengthFt"],["width","Lawn width","ft",20,"lengthFt"],["rate","Seed rate","lb per 1000 sq ft",5],["waste","Waste allowance","%",10]],calc(v){const area=v.length*v.width;const base=area*v.rate/1000;return [["Lawn area",area.toFixed(2)+" sq ft"],["Base seed",base.toFixed(2)+" lb"],["Seed to order",(base*(1+v.waste/100)).toFixed(2)+" lb"]]}},

function convertToBase(value,unit,group){
  if(group==="lengthFt") return unit==="m"?value*3.280839895:value;
  if(group==="dimensionIn"){
    if(unit==="ft") return value*12;
    if(unit==="cm") return value/2.54;
    return value;
  }
  if(group==="density") return unit==="kg/m3"?value*0.0624279606:value;
  return value;
}
function initCalculator(){
  const key=document.body.dataset.calc;
  if(!key||!configs[key])return;
  const c=configs[key],form=document.querySelector("#calc-form"),fields=document.querySelector("#fields");
  form.setAttribute("autocomplete","off");
  document.querySelector("#calc-title").textContent=c.title;
  document.querySelector("#calc-desc").textContent=c.desc;
  let started=false;
  c.fields.forEach(([id,label,unit,def,group])=>{
    const d=document.createElement("div");
    d.className="field";
    let selector="";
    if(group){
      const options=unitGroups[group].options.map(([value,text])=>'<option value="'+value+'"'+(value===unit?" selected":"")+'>'+text+"</option>").join("");
      selector='<label for="'+id+'">'+label+'</label><input id="'+id+'" name="'+id+'" type="number" min="0.000001" max="1000000" step="any" value="'+def+'" required><select id="'+id+'-unit" aria-label="'+label+' unit">'+options+"</select>";
    }else{
      selector='<label for="'+id+'">'+label+' ('+unit+')</label><input id="'+id+'" name="'+id+'" type="number" min="0.000001" max="1000000" step="any" value="'+def+'" required>';
    }
    d.innerHTML=selector;
    const input=d.querySelector("#"+id);
    if(input) input.setAttribute("autocomplete","off");
    fields.appendChild(d);
  });
  form.addEventListener("input",()=>{
    if(started)return;
    started=true;
    window.dispatchEvent(new CustomEvent("calculator_start",{detail:{calculator:c.title}}));
  });
  form.addEventListener("submit",e=>{
    e.preventDefault();
    const vals={};
    let bad=false;
    c.fields.forEach(([id,,unit, ,group])=>{
      const n=Number(document.getElementById(id).value);
      if(!Number.isFinite(n)||n<=0||n>1000000)bad=true;
      const selected=group?document.getElementById(id+"-unit").value:unit;
      vals[id]=convertToBase(n,selected,group);
      if(!Number.isFinite(vals[id])||vals[id]<=0)bad=true;
    });
    const out=document.querySelector("#results"),err=document.querySelector("#error");
    if(bad){
      err.textContent="Please enter valid values greater than zero and no greater than 1,000,000.";
      out.innerHTML="";
      return;
    }
    err.textContent="";
    out.innerHTML=c.calc(vals).map(x=>'<div class="result"><span class="muted">'+x[0]+'</span><strong>'+x[1]+"</strong></div>").join("");
    window.dispatchEvent(new CustomEvent("calculator_completed",{detail:{calculator:c.title}}));
  });
  document.querySelector("#reset").onclick=()=>{
    c.fields.forEach(([id,,unit,def,group])=>{
      const input=document.getElementById(id);
      if(input) input.value=String(def);
      if(group){
        const select=document.getElementById(id+"-unit");
        if(select) select.value=unit;
      }
    });
    document.querySelector("#results").innerHTML="<p class=\"muted\">Enter your project measurements and select Calculate.</p>";
    document.querySelector("#error").textContent="";
    started=false;
  };
  document.querySelector("#copy").onclick=async()=>{
    const t=document.querySelector("#results").innerText;
    if(!t)return;
    try{
      await navigator.clipboard.writeText(t);
      document.querySelector("#copy").textContent="Copied!";
      setTimeout(()=>document.querySelector("#copy").textContent="Copy Results",1400);
    }catch{}
  };
  window.dispatchEvent(new CustomEvent("calculator_view",{detail:{calculator:c.title}}));
}
function filterCards(){
  const q=document.querySelector("#search");
  if(!q)return;
  q.addEventListener("input",()=>{
    const v=q.value.toLowerCase();
    document.querySelectorAll("[data-card]").forEach(x=>x.hidden=!x.innerText.toLowerCase().includes(v));
  });
}
document.addEventListener("DOMContentLoaded",()=>{
  initAnalytics();
  initCalculator();
  filterCards();
});