;(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['exports'], function (exports) {
      factory(root);
    });
  } else if (typeof exports === 'object') {
    // CommonJS
    factory(exports);
  } else {
    // Browser globals
    factory(root);
  }
}(this, function (exports) {
	'use strict';
	function lunBo(opts){
		if (!(this instanceof lunBo))
	      return new lunBo(opts);
		this.selector = opts.selector;
		this.height = opts.height;
		this.width = opts.width;
		this.duration = opts.duration||3000;
		this.init();
	}
	lunBo.prototype={
		init:function (){
			this.container = document.querySelector(this.selector);
			this.container.children[0].style.transform = "translate3d(0px,0px,0px)";
			this.container.children[0].style.listStyle="none";
			this.container.children[0].style.position="relative";
			this.container.children[0].style.height= this.height+"px";
			this.container.children[0].style.width="100%";
			this.els = this.container.children[0].children;
			for (var i = 0; i < this.els.length; i++) {
				this.els[i].style.position = "absolute";
				this.els[i].style.float = "left";
				this.els[i].style.left = i*this.container.offsetWidth+"px";
				this.els[i].style.width = this.width+"px";
				this.els[i].style.height = this.height+"px";
				this.els[i].setAttribute("data-index",i);
				this.els[i].children[0].style.width = "100%";
				this.els[i].children[0].style.height = "100%";
				//this.els[i].children[0].style.maxWidth = this.width+"px";
				//this.els[i].children[0].style.maxHeight = this.height+"px";
			};

			var indicator = document.createElement("div");
				indicator.id = "indicator";
			for (var i = 0; i < this.els.length; i++) {
				var span = document.createElement("span");
				indicator.appendChild(span);
			};
			indicator.children[0].className="selected";
			this.container.appendChild(indicator);

			this.onOff = true;
			this.autoPlay();
			this.addEvent();
		},
		addEvent:function (){
			var that = this;
			var start,moveSize,position,step,index,moveON;
			this.container.children[0].addEventListener("touchstart",function(event){
				that.destroyTimmer();
				index = event.target.parentNode.dataset.index;
				start = event.changedTouches[0].pageX;
				moveSize = 0;
				step = that.width;
				position = parseFloat(that.getTranslate(that.container.children[0])[4]);
			},false);
			this.container.children[0].addEventListener("touchmove",function(event){
				event.preventDefault();
				moveSize = event.changedTouches[0].pageX-start;
				that.container.children[0].style.transform = "translate3d("+(position+moveSize)+"px,0px,0px)";
			},false);
			this.container.children[0].addEventListener("touchend",function(event){
				if(Math.abs(moveSize) > 20){
					if(index == 0 && moveSize>0){
						position = position;
					}else if(index == (that.els.length-1)&&moveSize<0){
						position = position;
					}else{
						var temp = (moveSize >= 0)?step:step*(-1)
						position = position + temp;
					}
					that.container.children[0].style.transform = "translate3d("+(position)+"px,0px,0px)";
					that.container.children[0].style.transition = "transform 200ms ease-in";
					that.showIndicator(Math.abs(position)/that.width);
				};
				that.Timmer2=window.setTimeout(function(){that.autoPlay();},this.duration);
			},false);
		},
		autoPlay:function(){
			var that =this;
			this.Timmer =  window.setInterval(function(){
				that.move();
			},this.duration);
		},	
		move:function() {
			var a=0;
			var position = parseFloat(this.getTranslate(this.container.children[0])[4]);
			var index = Math.abs(position)/this.width;
				a = index+1;
			this.showIndicator(a);
			if(index >= this.els.length-1){         
				index = 0;
				position = 0; 
			}else{
				position = (index+1)*this.width;
			}
			//console.log(position)
			this.container.children[0].style.transform = "translate3d(-"+(position)+"px,0px,0px)";
			this.container.children[0].style.transition = "transform 200ms ease";
		},
		next:function() {
			if(this.onOff){
				this.jump("next");
			}
		},
		previous:function(){
			if(this.onOff){
				this.jump("previous");
			}
		},
		jump:function(flag,index){
			this.onOff=false;
			var that = this;
			this.destroyTimmer();
			var position = parseFloat(this.getTranslate(this.container.children[0])[4]);
			var index = Math.abs(position)/this.width;
			switch (flag){
				case "next":
					if(index == this.els.length-1){
						index = 0;
						position = 0;
					}else{
						position = -(index+1)*this.width;
					}
					break;
				case "previous":
					if(index == 0){
						index = this.els.length-1;
						position = -(index)*this.width;
					}else{
						position = -(index-1)*this.width;
					}
					break;
				case "index":
					break;
				default:
					break;
			}
			this.container.children[0].style.transform = "translate3d("+(position)+"px,0px,0px)";
			this.container.children[0].style.transition = "transform 200ms ease";
			window.setTimeout(function(){
				that.onOff=true;
			},200);
			//this.Timmer2 = window.setTimeout(function(){that.autoPlay();},this.duration);
		},
		showIndicator:function(index){
			var dots = this.container.children[1].children;
			for (var i = 0; i < dots.length; i++) {
				dots[i].className = "";
			};
			if(index == this.els.length){
				dots[0].className = "selected";
			}else{
				dots[index].className = "selected";
			}
		},
		destroyTimmer:function(){
			clearInterval(this.Timmer);
			clearTimeout(this.Timmer2);
		},
		getTranslate:function(_self){
			var st = window.getComputedStyle(_self, null);
			var tr = st.getPropertyValue("-webkit-transform")||st.getPropertyValue("transform");
			var values = tr.split('(')[1].split(')')[0].split(',');
			return values;
	    }
	}
  exports.lunBo = lunBo;
}));