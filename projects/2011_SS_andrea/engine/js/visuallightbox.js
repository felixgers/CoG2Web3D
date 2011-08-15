// -----------------------------------------------------------------------------------
//
// VisualLightBox for Prototype v 1.8.14p
// http://visuallightbox.com/
// VisualLightBox is a free wizard program that helps you easily generate LightBox photo
// galleries, in a few clicks without writing a single line of code. For Windows and Mac!
// Last updated: 2010-04-12
//
function VisualLightbox(options){var C=null,badObjects=["select","object","embed"],l=null,B=[],k=null,c=null,m=50,I,resizeEffects,showTimer;if(!document.getElementsByTagName){return;}options=$H({animate:true,autoPlay:true,borderSize:39,containerID:document,enableSlideshow:true,googleAnalytics:false,descSliding:true,imageDataLocation:"south",shadowLocation:"",closeLocation:"",initImage:"",loop:true,overlayDuration:0.2,overlayOpacity:0.7,prefix:"",classNames:"vlightbox",resizeSpeed:7,Ae:false,slideTime:4,strings:{closeLink:"",loadingMsg:"loading",nextLink:"",prevLink:"",startSlideshow:"",stopSlideshow:"",numDisplayPrefix:"",numDisplaySeparator:"/"},enableRightClick:false,featBrowser:true,breathingSize:20,startZoom:false,floating:true}).merge(options);if(options.animate){var overlayDuration=Math.max(options.overlayDuration,0);options.resizeSpeed=Math.max(Math.min(options.resizeSpeed,10),1);var resizeDuration=(11-options.resizeSpeed)*0.15;}else{var overlayDuration=0;var resizeDuration=0;}var enableSlideshow=options.enableSlideshow;options.overlayOpacity=Math.max(Math.min(options.overlayOpacity,1),0);var playSlides=options.autoPlay;var container=$(options.containerID);var classNames=options.classNames;AW();var objBody=container!=document?container:document.getElementsByTagName("body").item(0);new Insertion.Top($(objBody),"<div></div>");objBody=objBody.childNodes[0];function connectEvent(obj,name,func){Event.observe(obj,name,func.bindAsEventListener(this));}var n=document.createElement("div");n.setAttribute("id",getID("overlay"));n.style.display="none";objBody.appendChild(n);connectEvent(n,"click",end);var W=document.createElement("div");W.setAttribute("id",getID("lightbox"));W.style.display="none";objBody.appendChild(W);connectEvent(W,"click",end);var U=document.createElement("div");U.setAttribute("id",getID("imageDataContainer"));U.className=getID("clearfix");var P=document.createElement("table");P.setAttribute("id",getID("outerImageContainer"));P.cellSpacing=0;W.appendChild(P);var AG=P.insertRow(-1);var AY=AG.insertCell(-1);AY.className="tl";var Ac=AG.insertCell(-1);Ac.className="tc";var AI=AG.insertCell(-1);AI.className="tr";var AF=P.insertRow(-1);var Af=AF.insertCell(-1);Af.className="ml";var b=AF.insertCell(-1);b.setAttribute("id",getID("lightboxFrameBody"));var Ag=AF.insertCell(-1);Ag.className="mr";var AD=P.insertRow(-1);var AZ=AD.insertCell(-1);AZ.className="bl";var Ab=AD.insertCell(-1);Ab.className="bc";var Ad=AD.insertCell(-1);Ad.className="br";if(options.imageDataLocation=="north"){b.appendChild(U);}var p=document.createElement("div");p.setAttribute("id",getID("imageData"));U.appendChild(p);var g=document.createElement("div");g.setAttribute("id",getID("imageDetails"));p.appendChild(g);var AP=document.createElement("div");AP.setAttribute("id",getID("caption"));g.appendChild(AP);var AK=document.createElement("span");AK.setAttribute("id",getID("numberDisplay"));g.appendChild(AK);var S=document.createElement("span");S.setAttribute("id",getID("detailsNav"));g.appendChild(S);var T=document.createElement("a");T.setAttribute("id",getID("prevLinkDetails"));T.setAttribute("href","javascript:void(0);");T.innerHTML=options.strings.prevLink;S.appendChild(T);connectEvent(T,"click",showPrev);var q=document.createElement("a");q.setAttribute("id",getID("slideShowControl"));q.setAttribute("href","javascript:void(0);");S.appendChild(q);connectEvent(q,"click",AH);var Z=document.createElement("a");Z.setAttribute("id",getID("closeLink"));Z.setAttribute("href","javascript:void(0);");Z.innerHTML=options.strings.closeLink;if(options.closeLocation=="nav"){S.appendChild(Z);}else{var _=document.createElement("div");_.setAttribute("id",getID("close"));if(options.closeLocation=="top"){AI.appendChild(_);}else{p.appendChild(_);}_.appendChild(Z);}connectEvent(Z,"click",end);var f=document.createElement("a");f.setAttribute("id",getID("nextLinkDetails"));f.setAttribute("href","javascript:void(0);");f.innerHTML=options.strings.nextLink;S.appendChild(f);connectEvent(f,"click",showNext);var objImageContainerMain=document.createElement("div");objImageContainerMain.setAttribute("id",getID("imageContainerMain"));b.appendChild(objImageContainerMain);var h=document.createElement("div");h.setAttribute("id",getID("imageContainer"));objImageContainerMain.appendChild(h);var AJ=document.createElement("img");AJ.setAttribute("id",getID("lightboxImage"));h.appendChild(AJ);if(!options.enableRightClick){var AB=document.createElement("div");AB.setAttribute("id",getID("hoverNav"));AB.style.background="white";AB.style.opacity=0;AB.style.filter="alpha(opacity=0)";h.appendChild(AB);connectEvent(AB,"mousemove",hoverNav);connectEvent(AB,"mouseout",outNav);}var AA=document.createElement("a");AA.setAttribute("id",getID("prevLinkImg"));AA.setAttribute("href","javascript:void(0);");objImageContainerMain.appendChild(AA);connectEvent(AA,"click",showPrev);var u=document.createElement("a");u.setAttribute("id",getID("nextLinkImg"));u.setAttribute("href","javascript:void(0);");objImageContainerMain.appendChild(u);connectEvent(u,"click",showNext);var AE=document.createElement("div");AE.setAttribute("id",getID("loading"));h.appendChild(AE);var a=document.createElement("a");a.setAttribute("id",getID("loadingLink"));a.setAttribute("href","javascript:void(0);");a.innerHTML=options.strings.loadingMsg;AE.appendChild(a);connectEvent(a,"click",end);if(options.imageDataLocation!="north"){b.appendChild(U);}var objShadow=document.createElement("div");objShadow.setAttribute("id",getID("shadow"));(options.shadowLocation?document.getElementById(getID(options.shadowLocation)):Ab).appendChild(objShadow);if(options.initImage!=""){start($(options.initImage));}function getHref(Node){if(Node.tagName.toUpperCase()!="A"){for(var i=0;i<Node.childNodes.length;i++){if(Node.childNodes[i].tagName.toUpperCase()=="A"){return Node.childNodes[i].getAttribute("href");}}}return Node.getAttribute("href");}function getTitle(Node){if(Node.tagName.toUpperCase()=="A"){return Node.getAttribute("title");}var TitleNode;for(var i=Node.childNodes.length-1;i>=0;i--){TitleNode=Node.childNodes[i];if(TitleNode.tagName){break;}}if(TitleNode&&TitleNode.tagName){return TitleNode.innerHTML;}return"";}function AW(){var els,refClasses=classNames.split(",");for(var i=0;i<refClasses.length;i++){els=$(container).getElementsByClassName(refClasses[i]);for(var j=0;j<els.length;j++){if(getHref(els[j])){els[j].onclick=function(){start(this);return false;};}}}}var t="VisualLightBox.com";if(t){var c=document.createElement("div");with(c.style){position="absolute";right=0;bottom=0;padding="2px 3px";backgroundColor="#EEE";zIndex=10;}$(h).appendChild(c);var d=document.createElement("a");with(d.style){color="#555";font="11px Arial,Verdana,sans-serif";padding="3px 6px";width="auto";height="auto";margin="0 0 0 0";outline="none";}d.href="http://"+t.toLowerCase();d.innerHTML=t;d.oncontextmenu=function(){return false;};c.appendChild(d);}var start=this.start=function(G){if($$("lightbox").visible()){return;}Aa();$$("overlay").setStyle({height:docWH()[1]+"px"});if(options.descSliding){$$("imageDataContainer").hide();}$$("lightboxImage").hide();$$("lightboxImage").src="";var linkSize=$(G).getDimensions();if(options.startZoom){$$("imageContainer").setStyle({width:linkSize.width+"px",height:linkSize.height+"px"});$$("outerImageContainer").setStyle({opacity:document.all?1:0.1});Position.clone(G,$$("lightbox"),{offsetLeft:-options.borderSize,offsetTop:-options.borderSize});$$("lightbox").setStyle({width:linkSize.width+options.borderSize*2+"px",height:"auto"});}else{new Effect.Appear($$("overlay"),{duration:overlayDuration,from:0,to:options.overlayOpacity});$$("lightbox").setStyle({left:0,width:"100%"});}$$("lightbox").show();$$("lightboxImage").setStyle({visibility:"hidden"});B=[];l=null;c=0;var els=container.getElementsByClassName(G.className);for(var i=0;i<els.length;i++){var el=els[i];if(getHref(el)){B.push({link:getHref(el),title:getTitle(el)});if(el==G){c=B.length-1;}}}if(B.length){l=G.getAttribute("className");}if(options.featBrowser){Event.observe(window,"resize",v);}if(options.floating){Event.observe(window,"scroll",v);}Event.observe(window,"resize",adjustOverlay);Event.observe(window,"scroll",adjustOverlay);changeImage(c);};function changeImage(imageNum){C=imageNum;disableKeyboardNav();V();showLoading();$$("lightboxImage").hide();$$("prevLinkImg").hide();$$("nextLinkImg").hide();if(options.descSliding){$$("imageDataContainer").hide();}I=new Image;I.onload=function(){B[C].link=I.src;B[C].width=I.width;B[C].height=I.height;AC(false);};if(options.startZoom&&!$$("lightboxImage").getAttribute("src")){B[C].width=320;B[C].height=240;AC(false,true);}I.src=B[C].link;if(options.googleAnalytics){urchinTracker(B[C].link);}}function AC(recall,J){var imgWidth=B[C].width;var imgHeight=B[C].height;var L=w();var r=imgWidth/imgHeight;if(options.featBrowser){var AX=L.AL/L.s;if(r>AX){var t=L.AL-options.borderSize*2-options.breathingSize*2;var z=Math.round(t/r);}else{var z=L.s-options.borderSize*2-options.breathingSize*2-m;var t=Math.round(z*r);}if(imgWidth>t||imgHeight>z){imgWidth=t;imgHeight=z;}}var K=AM().y+(w().s-(imgHeight+m+options.borderSize*2))/2;var Q=$$("imageContainer");if(recall==true){Q.setStyle({height:imgHeight+"px",width:imgWidth+"px"});if(options.floating){new Effect.Parallel([moveEffect($$("lightbox"),K)[0]],{duration:resizeDuration});}else{$$("lightbox").setStyle({top:K+"px"});}}else{var F=$$("lightboxImage");if(resizeEffects){resizeEffects.cancel();}if(!J){F.remove();F=$(I);F.hide();F.setAttribute("id",getID("lightboxImage"));Q.appendChild(F);if(options.startZoom){var cDim=Q.getDimensions();if(cDim.width/cDim.height>r){F.setStyle({position:"relative",top:(cDim.height-cDim.width/r)/2+"px",left:0,width:"100%",height:"auto"});}else{F.setStyle({position:"relative",top:0,left:(cDim.width-cDim.height*r)/2+"px",width:"auto",height:"100%"});}}if(options.startZoom){hideLoading();}}AV(K,imgWidth,imgHeight,J);}if(document.all){$$("imageDataContainer").setStyle({width:imgWidth+"px"});}if(options.enableRightClick){Event.observe($("lightboxImage"),"mouseout",outNav);Event.observe($("lightboxImage"),"mousemove",hoverNav);}}function AV(K,imgWidth,imgHeight,J){var Q=$$("imageContainer");var F=$$("lightboxImage");var effectScale=[];var cDims=Q.getDimensions();if(!cDims.width){Q.setStyle({width:1});cDims.width=1;}if(!cDims.height){Q.setStyle({height:1});cDims.height=1;}if(options.startZoom){if(!J){new Effect.Appear(F,{from:0,to:1,duration:resizeDuration});}new Effect.Opacity($$("outerImageContainer"),{duration:resizeDuration});}var lightbox=$$("lightbox");var move=moveEffect(lightbox,K);for(var i=0;i<move.length;i++){effectScale[effectScale.length]=move[i];}if(options.startZoom&&!J){if(parseFloat(F.getStyle("top"))){effectScale[effectScale.length]=new Effect.Move(F,{y:0,mode:"absolute",sync:true});}if(parseFloat(F.getStyle("left"))){effectScale[effectScale.length]=new Effect.Move(F,{x:0,mode:"absolute",sync:true});}}if(cDims.width!=imgWidth){effectScale[effectScale.length]=new Effect.Scale(Q,imgWidth/cDims.width*100,{scaleY:false,sync:true});}if(cDims.height!=imgHeight){effectScale[effectScale.length]=new Effect.Scale(Q,imgHeight/cDims.height*100,{scaleX:false,sync:true});}if(effectScale.length){resizeEffects=new Effect.Parallel(effectScale,{duration:resizeDuration,afterFinish:!J?function(){showImage();}:null});}else{setTimeout(function(){showImage();},resizeDuration);}}function moveEffect(lightbox,K){if(this.moveEffectObj){this.moveEffectObj.cancel();}this.moveEffectObj=new Effect.Move(lightbox,{x:0,y:K,mode:"absolute",sync:true});var result=[this.moveEffectObj];if(options.startZoom){var cWidth=lightbox.getStyle("width");if(cWidth!="100%"&&cWidth!="auto"){var relWidth=lightbox.getWidth()/docWH()[0];lightbox.setStyle({width:relWidth*100+"%"});result[1]=new Effect.Scale(lightbox,100/relWidth,{scaleY:false,sync:true,afterFinish:function(){$$("lightbox").setStyle({width:"100%"});}});}}return result;}function showLoading(){clearTimeout(showTimer);var loading=$$("loading");loading.show();loading.setStyle({visibility:"hidden"});showTimer=setTimeout(function(){$$("loading").setStyle({visibility:"visible"});},300);}function hideLoading(){clearTimeout(showTimer);$$("loading").hide();}function showImage(){hideLoading();if(options.startZoom){if(!$$("overlay").visible()){new Effect.Appear($$("overlay"),{duration:overlayDuration,to:options.overlayOpacity});}showDetails();}else{new Effect.Appear($$("lightboxImage"),{duration:0.5,queue:"end",afterFinish:function(){showDetails();}});}AS();}function updateDetails(){$$("caption").update(B[C].title);if(B.length>1){var num_display=options.strings.numDisplayPrefix+" "+eval(C+1)+" "+options.strings.numDisplaySeparator+" "+B.length;if(options.Ae&&l!=""){num_display+=" "+options.strings.numDisplaySeparator+" "+l;}$$("numberDisplay").update(num_display);$$("slideShowControl").setStyle({display:enableSlideshow?"":"none"});}}function showDetails(){updateDetails();if(options.descSliding){new Effect.Parallel([new Effect.SlideDown($$("imageDataContainer"),{sync:true}),new Effect.Appear($$("imageDataContainer"),{sync:true})],{duration:0.65,afterFinish:function(){updateNav();}});}else{updateNav();}}function updateNav(){var d=1/B.length;m=m*(1-d)+$$("imageDataContainer").getHeight()*d;if(B.length>1){$$("prevLinkImg").show();$$("nextLinkImg").show();if(enableSlideshow){if(playSlides){AN();}else{AO();}}}AR();}function AN(){if(!$$("lightbox").visible()){return;}playSlides=true;k=new PeriodicalExecuter(function(pe){showNext();pe.stop();},options.slideTime);$$("slideShowControl").update(options.strings.stopSlideshow);$$("slideShowControl").addClassName("started");}function AO(){playSlides=false;V();$$("slideShowControl").update(options.strings.startSlideshow);$$("slideShowControl").removeClassName("started");}function AH(){if(playSlides){AO();}else{AN();}}function V(){if(k){k.stop();}}function showNext(){if(B.length>1){if(!options.loop&&(C==B.length-1&&c==0||C+1==c)){end();return;}if(C==B.length-1){O(0);}else{O(C+1);}}}function O(imageNum){if(options.descSliding){new Effect.Parallel([new Effect.SlideUp($$("imageDataContainer"),{sync:true}),new Effect.Fade($$("imageDataContainer"),{sync:true})],{duration:0.65,afterFinish:function(){changeImage(imageNum);}});}else{changeImage(imageNum);}}function showPrev(){if(B.length>1){if(C==0){O(B.length-1);}else{O(C-1);}}}function showFirst(){if(B.length>1){O(0);}}function showLast(){if(B.length>1){O(B.length-1);}}function AR(){document.onkeydown=keyboardAction;}function disableKeyboardNav(){document.onkeydown="";}function keyboardAction(e){if(e==null){keycode=event.keyCode;}else{keycode=e.which;}key=String.fromCharCode(keycode).toLowerCase();if(key=="x"||key=="o"||key=="c"){end();}else if(key=="p"||key=="%"){showPrev();}else if(key=="n"||key=="'"){showNext();}else if(key=="f"){showFirst();}else if(key=="l"){showLast();}else if(key=="s"){if(B.length>0&&options.enableSlideshow){AH();}}}function AS(){var AT=B.length-1==C?0:C+1;(new Image).src=B[AT].link;var AQ=C==0?B.length-1:C-1;(new Image).src=B[AQ].link;}function end(e){if(e){var id=$(Event.element(e)).id;if(getID("closeLink")!=id&&getID("lightbox")!=id&&getID("overlay")!=id){return;}}if(resizeEffects){resizeEffects.cancel();}I.onload=null;disableKeyboardNav();V();$$("lightbox").hide();if(options.overlayOpacity){new Effect.Fade($$("overlay"),{duration:overlayDuration,afterFinish:function(){AU();}});}else{$$("overlay").hide();AU();}Event.stopObserving(window,"resize",v);if(options.floating){Event.stopObserving(window,"scroll",v);}Event.stopObserving(window,"resize",adjustOverlay);Event.stopObserving(window,"scroll",adjustOverlay);}function hoverNav(event){if(Event.pointerX(event)-Position.page($$("imageContainer"))[0]<$$("imageContainer").getWidth()/2){$$("prevLinkImg").addClassName("hover");$$("nextLinkImg").removeClassName("hover");}else{$$("prevLinkImg").removeClassName("hover");$$("nextLinkImg").addClassName("hover");}}function outNav(){$$("prevLinkImg").removeClassName("hover");$$("nextLinkImg").removeClassName("hover");}function v(){AC(true);}function adjustOverlay(){$$("overlay").setStyle({left:AM().x+"px",top:0,width:"100%",height:docWH()[1]+"px"});}function AU(){var els;var tags=badObjects;for(var i=0;i<tags.length;i++){els=document.getElementsByTagName(tags[i]);for(var j=0;j<els.length;j++){$(els[j]).setStyle({visibility:"visible"});}}}function Aa(){var els;var tags=badObjects;for(var i=0;i<tags.length;i++){els=document.getElementsByTagName(tags[i]);for(var j=0;j<els.length;j++){$(els[j]).setStyle({visibility:"hidden"});}}}function AM(){var x,y;if(self.pageYOffset){x=self.pageXOffset;y=self.pageYOffset;}else if(document.documentElement&&document.documentElement.scrollTop){x=document.documentElement.scrollLeft;y=document.documentElement.scrollTop;}else if(document.body){x=document.body.scrollLeft;y=document.body.scrollTop;}return{x:x,y:y};}function w(){var N,M;if(self.innerHeight){N=self.innerWidth;M=self.innerHeight;}else if(document.documentElement&&document.documentElement.clientHeight){N=document.documentElement.clientWidth;M=document.documentElement.clientHeight;}else if(document.body){N=document.body.clientWidth;M=document.body.clientHeight;}return{AL:N,s:M};}function docWH(){var b=document.body,e=document.documentElement,w=0,h=0;if(e){w=Math.max(w,e.scrollWidth,e.offsetWidth);h=Math.max(h,e.scrollHeight,e.offsetHeight);}if(b){w=Math.max(w,b.scrollWidth,b.offsetWidth);h=Math.max(h,b.scrollHeight,b.offsetHeight);if(window.innerWidth){w=Math.max(w,window.innerWidth);h=Math.max(h,window.innerHeight);}}return[w,h];}function getID(id){return options.prefix+id;}function $$(name){return $(getID(name));}}