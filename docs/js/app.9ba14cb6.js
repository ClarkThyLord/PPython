(function(e){function t(t){for(var r,l,i=t[0],c=t[1],s=t[2],d=0,p=[];d<i.length;d++)l=i[d],Object.prototype.hasOwnProperty.call(a,l)&&a[l]&&p.push(a[l][0]),a[l]=0;for(r in c)Object.prototype.hasOwnProperty.call(c,r)&&(e[r]=c[r]);u&&u(t);while(p.length)p.shift()();return o.push.apply(o,s||[]),n()}function n(){for(var e,t=0;t<o.length;t++){for(var n=o[t],r=!0,i=1;i<n.length;i++){var c=n[i];0!==a[c]&&(r=!1)}r&&(o.splice(t--,1),e=l(l.s=n[0]))}return e}var r={},a={app:0},o=[];function l(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,l),n.l=!0,n.exports}l.m=e,l.c=r,l.d=function(e,t,n){l.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},l.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},l.t=function(e,t){if(1&t&&(e=l(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(l.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)l.d(n,r,function(t){return e[t]}.bind(null,r));return n},l.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return l.d(t,"a",t),t},l.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},l.p="";var i=window["webpackJsonp"]=window["webpackJsonp"]||[],c=i.push.bind(i);i.push=t,i=i.slice();for(var s=0;s<i.length;s++)t(i[s]);var u=c;o.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},4507:function(e,t,n){"use strict";n("fef8")},"56d7":function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var r=n("7a23"),a=n("976a"),o=n.n(a),l={class:"h-100 d-grid gap-3 p-3"},i={class:"row h-100"},c={class:"col-lg-6 d-flex flex-column"},s={class:"hstack gap-3 mx-3"},u=Object(r["d"])("img",{src:o.a,alt:"",height:"48",class:"d-inline-block align-text-top ppython-icon"},null,-1),d=Object(r["d"])("h1",null,"PPython",-1),p=Object(r["d"])("a",{href:"https://github.com/ClarkThyLord/PPython#readme",class:"link-info"}," ? ",-1),b=Object(r["d"])("div",{class:"ms-auto d-flex"},null,-1),f={class:"btn-group"},h=Object(r["d"])("label",{class:"btn btn-outline-success",for:"autoTranspile"}," Auto ",-1),g=Object(r["d"])("hr",null,null,-1),O={class:"col-lg-6 d-flex flex-column"},m={class:"hstack gap-3 mx-3"},v=Object(r["d"])("h1",null,"C++",-1),j={class:"ms-auto btn-group"},y=Object(r["d"])("button",{type:"button",class:"btn btn-primary active"},"Code",-1),x={class:"btn btn-outline-secondary",for:"showTranspilingLogs"},w=Object(r["e"])(" Log "),T=Object(r["d"])("hr",null,null,-1);function A(e,t,n,a,o,A){var $=Object(r["l"])("Spinner"),S=Object(r["l"])("TextArea");return Object(r["h"])(),Object(r["c"])("div",l,[Object(r["d"])("div",i,[Object(r["d"])("div",c,[Object(r["d"])("div",s,[u,d,p,b,Object(r["f"])($,{class:Object(r["g"])({"d-none":!this.$data.transpiling})},null,8,["class"]),Object(r["d"])("div",f,[Object(r["o"])(Object(r["d"])("input",{type:"checkbox",class:"btn-check",id:"autoTranspile",autocomplete:"off","onUpdate:modelValue":t[0]||(t[0]=function(e){return o.autoTranspiling=e})},null,512),[[r["n"],o.autoTranspiling]]),h,Object(r["d"])("button",{type:"button",class:"btn btn-success",onClick:t[1]||(t[1]=function(e){return A.transpile()})}," Transpile ")])]),g,Object(r["f"])(S,{placeholder:"# Write some PPython code here...\nx = 10\nwhile x > 0:\n\tx = x - 1","onUpdate:value":A.ppythonSourceUpdatedValue,ref:"ppythonSource"},null,8,["onUpdate:value"])]),Object(r["d"])("div",O,[Object(r["d"])("div",m,[v,Object(r["d"])("div",j,[y,Object(r["o"])(Object(r["d"])("input",{type:"checkbox",class:"btn-check",id:"showTranspilingLogs",autocomplete:"off","onUpdate:modelValue":t[2]||(t[2]=function(e){return o.showTranspilingLogs=e})},null,512),[[r["n"],o.showTranspilingLogs]]),Object(r["d"])("label",x,[w,Object(r["d"])("span",{class:Object(r["g"])(["position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger",{"d-none":0==o.transpilingLogs.length}])},Object(r["m"])(o.transpilingLogs.length),3)])])]),T,Object(r["f"])(S,{placeholder:"\\\\ Get some C++ code here...\nint x = 10;\nwhile (x > 0) {\n\tx = x - 1\n}",ref:"cppSource"},null,512),Object(r["d"])("ul",{style:{"max-height":"15vh"},class:Object(r["g"])(["m-2 list-group overflow-auto",{"d-none":!o.showTranspilingLogs}])},[(Object(r["h"])(!0),Object(r["c"])(r["a"],null,Object(r["k"])(o.transpilingLogs,(function(e){return Object(r["h"])(),Object(r["c"])("li",{key:e,class:Object(r["g"])(["list-group-item",{"list-group-item-danger":e.isError,"list-group-item-warning":e.isWarning}])},Object(r["m"])(e.message),3)})),128))],2)])])])}var $=["placeholder"];function S(e,t,n,a,o,l){return Object(r["h"])(),Object(r["c"])("textarea",{placeholder:n.placeholder},null,8,$)}var k={name:"TextArea",emits:["update:value"],props:{placeholder:{type:String,default:""}},data:function(){return{editor:void 0}},mounted:function(){var e=this,t=codemirror.fromTextArea(this.$el,{lineNumbers:!0});t.on("change",(function(t,n){e.$emit("update:value",e.getValue())})),t.getWrapperElement().classList.add("overflow-auto"),t.getWrapperElement().classList.add("flex-fill"),t.getWrapperElement().classList.add("rounded-2"),this.$data.editor=t},methods:{getValue:function(){return this.$data.editor?this.$data.editor.getValue():void 0},setValue:function(e){this.$data.editor&&this.$data.editor.setValue(e)},setReadOnly:function(e){this.$data.editor&&(this.$data.editor.options.readOnly=e)}}},L=n("6b0d"),P=n.n(L);const E=P()(k,[["render",S]]);var V=E,_={class:"spinner"};function C(e,t,n,a,o,l){return Object(r["h"])(),Object(r["c"])("div",_)}var U={name:"Spinner"};n("4507");const W=P()(U,[["render",C],["__scopeId","data-v-434fa27c"]]);var J=W;n("4de4"),n("ac1f"),n("1276"),n("5b81"),n("159b"),n("b64b"),n("07ac"),n("466d");function M(e){var t=void 0,n=[],r=function(e){n.push({isError:!0,message:e})},a={"Estructura de Iteracion":{while:/(?<!.)while(?!.)/},"Operador Logico":{and:/(?<!.)and(?!.)/,or:/(?<!.)or(?!.)/},"Estructura Condicional":{if:/(?<!.)if(?!.)/,elif:/(?<!.)elif(?!.)/,else:/(?<!.)else(?!.)/},"Funcion Auxilliar":{break:/(?<!.)break(?!.)/,return:/(?<!.)return(?!.)/},"Delimitador Emparejado":{parenthesis_left:/(?<!.)[(](?!.)/,parenthesis_right:/(?<!.)[)](?!.)/},Delimitador:{colon:/(?<!.):(?!.)/,newline:/(?<!.)\n(?!.)/,tab:/(?<!.)\t(?!.)/},"operador de comparacion":{addition:/(?<!.)[+](?!.)/,subtraction:/(?<!.)[-](?!.)/,multiplication:/(?<!.)[*](?!.)/,division:/(?<!.)[/](?!.)/,assignment:/(?<!.)=(?!.)/,equals:/(?<!.)==(?!.)/,diffrent:/(?<!.)!=(?!.)/,greater:/(?<!.)[>](?!.)/,lesser:/(?<!.)[<](?!.)/},"operador aritmetico":{addition:/(?<!.)[+](?!.)/,subtraction:/(?<!.)[-](?!.)/,multiplication:/(?<!.)[*](?!.)/,division:/(?<!.)[/](?!.)/},literal:{bool:/(?<!.)True|False(?!.)/,string:/(?<!.)".*"(?!.)/,integer:/(?<!.)[0-9]+(?!.)/},comentario:{line:/#.*/},identificador:{variable_name:/(?<!.)[^0-9]\w*(?!.)/}},o=e.replaceAll("\n"," \n ").replaceAll("\t"," \t ").replaceAll(":"," : ").replaceAll("("," ( ").replaceAll(")"," ) ").replaceAll("="," = ").replaceAll("<"," < ").replaceAll(">"," > ").replaceAll("=="," == ").replaceAll("!="," != ").replaceAll("*"," * ").replaceAll("+"," + ").replaceAll("-"," - ").replaceAll("/"," / ").split(/[ ]+/).filter((function(e){return e}));console.log(JSON.stringify(o));var l=[];return o.forEach((function(e){var t=void 0;Object.keys(a).some((function(n){if(Object.values(a[n]).some((function(r){if(t=e.match(r),null!==t&&1==t.length)return l.push([n,e]),!0})),t)return!0})),t||r("Error: Syntax error")})),t=JSON.stringify(l,null,"\t"),void 0===t&&r("Error: No C++ source code could be produced"),{result:t,logs:n}}var N={name:"App",components:{TextArea:V,Spinner:J},data:function(){return{edits:0,autoTranspiling:!0,transpiling:!1,transpilingLogs:[],showTranspilingLogs:!0}},methods:{ppythonSourceUpdatedValue:function(e){var t=this;this.$data.autoTranspiling&&(this.$data.edits+=1,setTimeout((function(){t.$data.edits-=1,0!==t.$data.edits||t.$data.transpiling||t.transpile()}),3e3))},transpile:function(){var e=this;this.$data.transpiling=!0,setTimeout((function(){var t=M(e.$refs.ppythonSource.getValue());e.$refs.cppSource.setValue(t.result?t.result:""),e.$data.transpilingLogs=t.logs,e.$data.transpiling=!1}),600)}},mounted:function(){this.$refs.cppSource.setReadOnly(!0)}};n("7906");const D=P()(N,[["render",A]]);var F=D,I=(n("ab8b"),n("7b17")),R=(n("a7be"),n("56b3"));window.bootstrap=I,window.codemirror=R,n("d7d5"),Object(r["b"])(F).mount("#app")},7906:function(e,t,n){"use strict";n("b7d0")},"976a":function(e,t,n){e.exports=n.p+"img/ppython.447d7e27.svg"},b7d0:function(e,t,n){},fef8:function(e,t,n){}});
//# sourceMappingURL=app.9ba14cb6.js.map