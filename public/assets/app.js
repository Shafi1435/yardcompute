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
"fence-post-spacing-calculator":{title:"Fence Post Spacing Calculator",desc:"Calculate practical post count and adjusted spacing for a fence run.",fields:[["length","Fence length","ft",1,"lengthFt"],["spacing","Target spacing","ft",8,"lengthFt"]],calc(v){const posts=Math.ceil(v.length/v.spacing)+1;const bays=posts-1;return [["Posts",posts+" posts"],["Fence bays",bays+" bays"],["Adjusted spacing",(v.length/bays).toFixed(2)+" ft"]]}},
"fence-post-concrete-calculator":{title:"Fence Post Concrete Calculator",desc:"Estimate concrete volume for fence post holes using hole diameter, depth, and post count.",fields:[["posts","Number of posts","posts",10],["diameter","Hole diameter","in",12,"dimensionIn"],["depth","Hole depth","in",24,"dimensionIn"]],calc(v){const one=Math.PI*Math.pow(v.diameter/24,2)*(v.depth/12);const total=one*v.posts;return [["Concrete volume",total.toFixed(2)+" cu ft"],["Approx. 80-lb bags",Math.ceil(total/0.60)+" bags"],["Approx. 60-lb bags",Math.ceil(total/0.45)+" bags"]]}},
"deck-board-calculator":{title:"Deck Board Calculator",desc:"Estimate the number of deck boards needed from deck dimensions, board width, and gap.",fields:[["length","Deck length","ft",12,"lengthFt"],["width","Deck width","ft",16,"lengthFt"],["board","Board width","in",5.5,"dimensionIn"],["gap","Board gap","in",0.125,"dimensionIn"]],calc(v){const widthIn=v.width*12;const boards=Math.floor((widthIn+v.gap)/(v.board+v.gap));return [["Boards needed",boards+" boards"],["Board length",v.length.toFixed(2)+" ft"],["Deck area",(v.length*v.width).toFixed(1)+" sq ft"]]}},
"deck-board-spacing-calculator":{title:"Deck Board Spacing Calculator",desc:"Calculate the number of deck boards and actual gap from deck width and board width.",fields:[["width","Deck width","ft",12,"lengthFt"],["board","Board width","in",5.5,"dimensionIn"],["gap","Desired gap","in",0.125,"dimensionIn"]],calc(v){const w=v.width*12;const n=Math.floor((w+v.gap)/(v.board+v.gap));const actual=n>1?(w-n*v.board)/(n-1):0;return [["Boards",n+" boards"],["Approx. actual gap",Math.max(0,actual).toFixed(3)+" in"],["Coverage width",w.toFixed(1)+" in"]]}},
"concrete-calculator":{title:"Concrete Calculator",desc:"Estimate concrete volume for rectangular slabs, pads, and footings.",fields:[["length","Length","ft",10,"lengthFt"],["width","Width","ft",10,"lengthFt"],["depth","Thickness","in",4,"dimensionIn"]],calc(v){const cu=v.length*v.width*(v.depth/12);return [["Concrete",cu.toFixed(2)+" cu ft"],["Concrete with 10% waste",(cu*1.10).toFixed(2)+" cu ft"],["Approx. cubic yards",(cu/27*1.10).toFixed(2)+" yd³"]]}},
"post-hole-concrete-calculator":{title:"Post Hole Concrete Calculator",desc:"Estimate concrete needed for cylindrical post holes.",fields:[["posts","Number of holes","posts",4],["diameter","Hole diameter","in",12,"dimensionIn"],["depth","Hole depth","in",24,"dimensionIn"]],calc(v){const one=Math.PI*Math.pow(v.diameter/24,2)*(v.depth/12);const total=one*v.posts;return [["Concrete",total.toFixed(2)+" cu ft"],["With 10% waste",(total*1.10).toFixed(2)+" cu ft"],["Approx. 80-lb bags",Math.ceil(total*1.10/0.60)+" bags"]]}},
"gravel-calculator":{title:"Gravel Calculator",desc:"Estimate gravel volume and weight for a rectangular area.",fields:[["length","Length","ft",20,"lengthFt"],["width","Width","ft",10,"lengthFt"],["depth","Depth","in",3,"dimensionIn"],["density","Gravel density","lb/cu ft",105,"density"]],calc(v){const cu=v.length*v.width*(v.depth/12);return [["Gravel volume",cu.toFixed(2)+" cu ft"],["With 10% waste",(cu*1.10).toFixed(2)+" cu ft"],["Estimated weight",(cu*1.10*v.density/2000).toFixed(2)+" tons"]]}},
"driveway-gravel-calculator":{title:"Driveway Gravel Calculator",desc:"Estimate gravel needed for a driveway based on length, width, depth, and density.",fields:[["length","Driveway length","ft",40,"lengthFt"],["width","Driveway width","ft",12,"lengthFt"],["depth","Gravel depth","in",4,"dimensionIn"],["density","Gravel density","lb/cu ft",105,"density"]],calc(v){const cu=v.length*v.width*(v.depth/12);const waste=cu*1.10;return [["Base volume",cu.toFixed(2)+" cu ft"],["Order volume with 10% waste",waste.toFixed(2)+" cu ft"],["Estimated weight",(waste*v.density/2000).toFixed(2)+" tons"]]}},
"mulch-calculator":{title:"Mulch Calculator",desc:"Estimate mulch volume for garden beds and landscaping areas.",fields:[["length","Area length","ft",20,"lengthFt"],["width","Area width","ft",8,"lengthFt"],["depth","Mulch depth","in",3,"dimensionIn"]],calc(v){const cu=v.length*v.width*(v.depth/12);return [["Mulch",cu.toFixed(2)+" cu ft"],["With 10% waste",(cu*1.10).toFixed(2)+" cu ft"],["Cubic yards",(cu/27*1.10).toFixed(2)+" yd³"]]}}
};

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
function addFooterLinks(){
  document.querySelectorAll("footer .wrap").forEach(f=>{
    if(f.querySelector(".site-links"))return;
    const p=document.createElement("p");
    p.className="site-links";
    p.innerHTML='<a href="/about/">About</a> · <a href="/contact/">Contact</a> · <a href="/privacy-policy/">Privacy Policy</a> · <a href="/terms/">Terms</a> · <a href="/disclaimer/">Disclaimer</a>';
    f.appendChild(p);
  });
}
document.addEventListener("DOMContentLoaded",()=>{
  initAnalytics();
  initCalculator();
  filterCards();
  addFooterLinks();
});