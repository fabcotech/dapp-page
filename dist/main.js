!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=2)}([function(e,t){e.exports=React},function(e,t){e.exports=ReactDOM},function(e,t,n){"use strict";n.r(t);var o=n(0),r=n.n(o),a=n(1),l=n.n(a);function c(e){return(c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function i(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function u(e,t){return(u=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function s(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,o=p(e);if(t){var r=p(this).constructor;n=Reflect.construct(o,arguments,r)}else n=o.apply(this,arguments);return f(this,n)}}function f(e,t){return!t||"object"!==c(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function p(e){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var d=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&u(e,t)}(l,e);var t,n,o,a=s(l);function l(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,l),(t=a.call(this,e)).state={text:e.text||"Hi I'm Bob",title:e.title||"Bob's page"},t}return t=l,(n=[{key:"render",value:function(){var e=this;return console.log(this.state),r.a.createElement("div",{className:"genesis-form form"},r.a.createElement("p",null,r.a.createElement("h5",{className:"title is-5"},"Setup your personal page on Dappy"),"We see that this page has just been deployed and there is no text associated with it. Once you have submitted this form, wait few minutes and reload the page to see the page.",r.a.createElement("br",null),r.a.createElement("br",null)),r.a.createElement("div",{className:"field"},r.a.createElement("label",{className:"label"},"Title (tab)"),r.a.createElement("div",{className:"control"},r.a.createElement("input",{className:"input",onChange:function(t){return e.setState({title:t.target.value})},type:"text",defaultValue:this.props.title||"Bob's page"}))),r.a.createElement("div",{className:"field"},r.a.createElement("label",{className:"label"},"Text"),r.a.createElement("p",{className:"note"},r.a.createElement("b",null,"Note: "),"Data will be stored as a string, and secured with"," ",r.a.createElement("b",null,"encodeURI()")),r.a.createElement("div",{className:"control"},r.a.createElement("textarea",{className:"textarea",rows:"25",onInput:function(t){e.setState({text:t.target.value})},defaultValue:this.props.text||"Hi I'm Bob"}))),r.a.createElement("br",null),r.a.createElement("div",{className:"field"},r.a.createElement("button",{className:"button is-light",disabled:!(this.state&&this.state.text&&this.state.title),type:"button",onClick:function(t){e.state&&e.state.text&&e.state.title&&e.props.onUpdatePage({text:e.state.text,title:e.state.title,nonce:e.props.nonce})}},"Save text and create page")))}}])&&i(t.prototype,n),o&&i(t,o),l}(r.a.Component);function m(e){return(m="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function y(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function b(e,t){return(b=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function h(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,o=E(e);if(t){var r=E(this).constructor;n=Reflect.construct(o,arguments,r)}else n=o.apply(this,arguments);return g(this,n)}}function g(e,t){return!t||"object"!==m(t)&&"function"!=typeof t?v(e):t}function v(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function E(e){return(E=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var x=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&b(e,t)}(c,e);var t,n,a,l=h(c);function c(e){var t,n,o,r;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,c),t=l.call(this,e),n=v(t),r=function(e){if("undefined"!=typeof dappyRChain){var n=blockchainUtils.generateNonce(),o='new entryCh, lookup(`rho:registry:lookup`), stdout(`rho:io:stdout`) in {\n  lookup!(`rho:id:REGISTRY_URI`, *entryCh) |\n\n  for(entry <- entryCh) {\n    entry!(\n      {\n        "type": "ADD_OR_UPDATE",\n        "payload": {\n          "id": "page",\n          "file": {\n            "text": "'.concat(encodeURI(e.text),'",\n            "title": "').concat(encodeURI(e.title),'",\n          },\n          "nonce": "').concat(n,'",\n          "signature": "SIGN"\n        }\n      },\n      *stdout\n    )\n  }\n}');dappyRChain.transaction({term:o,signatures:{SIGN:e.nonce}}).then((function(e){t.setState({modal:"transaction-sent",update:!1})}))}else console.warn("window.dappyRChain is undefined, cannot deploy page")},(o="onUpdatePage")in n?Object.defineProperty(n,o,{value:r,enumerable:!0,configurable:!0,writable:!0}):n[o]=r,t.state={modal:void 0,update:!1},t}return t=c,(n=[{key:"render",value:function(){var e=this;return"transaction-sent"===this.state.modal?r.a.createElement("div",{className:"modal"},r.a.createElement("div",{className:"modal-background"}),r.a.createElement("div",{className:"modal-card"},r.a.createElement("header",{className:"modal-card-head"},r.a.createElement("p",{className:"modal-card-title"},"Transaction successfully sent"),r.a.createElement("button",{onClick:function(){return e.setState({modal:void 0})},className:"delete","aria-label":"close"})),r.a.createElement("section",{className:"modal-card-body"},"Transaction was successfully sent. Wait few minutes, reload, and you should see the page updated."),r.a.createElement("footer",{className:"modal-card-foot"},r.a.createElement("button",{onClick:function(){return e.setState({modal:void 0})},class:"button"},"Ok")))):this.props.text&&!this.state.update?r.a.createElement(o.Fragment,null,r.a.createElement("div",{className:"page-text"},this.props.text),r.a.createElement("a",{className:"update-page",onClick:function(){e.setState({update:!0})}},"Update page (admin only)")):r.a.createElement(o.Fragment,null,r.a.createElement(d,{onUpdatePage:this.onUpdatePage,nonce:this.props.nonce,text:this.props.text,title:this.props.title}))}}])&&y(t.prototype,n),a&&y(t,a),c}(r.a.Component);"undefined"!=typeof dappyRChain&&dappyRChain.fetch("dappy://betanetwork/REGISTRY_URI").then((function(e){var t=JSON.parse(e).expr[0],n=blockchainUtils.rhoValToJs(t);console.log(n),n.files.page?dappyRChain.exploreDeploys("dappy://betanetwork/explore-deploys",["new return,\n              fileCh,\n              fileCh,\n              filesModuleCh,\n              lookup(`rho:registry:lookup`) in {\n                lookup!(`".concat(n.files.page,"`, *fileCh) |\n                for(file <- fileCh) {\n                  return!(*file)\n                }\n            }")]).then((function(e){var t=JSON.parse(e).results,o=blockchainUtils.rhoValToJs(JSON.parse(t[0].data).expr[0]),a=decodeURI(o.text),c=decodeURI(o.title);document.title=c,console.log("files-module .page file retrieved with explore-deploy :"),console.log(a),l.a.render(r.a.createElement(x,{nonce:n.nonce,title:c,text:a}),document.getElementById("root"))})):l.a.render(r.a.createElement(x,{nonce:n.nonce,text:void 0}),document.getElementById("root"))})).catch((function(e){console.error("Something went wrong when retreiving the files module object"),console.log(e)}))}]);