(function( base, core, models, $ ){
	
	"use strict";
	
	models.Application = function Application( options ){
		this._applicationReady = false;
		this._functionQueue = [];
		
		this.templateIds = options && options.templates ? options.templates : [];
		this.templates = {};
		
		this.styleIds = options && options.styles ? options.styles : [];

		this._initialise();
	};
	
	models.Application.prototype._runFunctionQueue = function (){
		var self = this;
		
		if ( this._applicationReady ){
			if ( this._queueTimerId ){
				clearInterval(this._queueTimerId);
			}
			
			for ( var i=0; i<this._functionQueue.length; i++ ){
				this._functionQueue[i]();
			}
		}else if ( !this._queueTimerId ){
			this._queueTimerId = setInterval(function(){self._runFunctionQueue();}, 50);
		}else{
			
		}
	};
	
	models.Application.prototype.ready = function( fn ){
		if ( this._applicationReady ){
			fn();
		}else{
			this._functionQueue.push(fn);
			this._runFunctionQueue();
		}
	};
	
	models.Application.prototype._initialise = function (){
		var def = $.Deferred();
		var self = this;
		
		//Load the style sheets
		var stylesheet;
		for ( var i=0; i<this.styleIds.length; i++ ){
			stylesheet = $('<link rel="stylesheet" href="css/'+this.styleIds[i]+'.css"/>');
			$("head").append(stylesheet);
		}
		
		var templateCounter = 0;
		
		//Load the templates
		for ( i=0; i<this.templateIds.length; i++ ){
			this.templates[this.templateIds[i]] = new models.Template(this.templateIds[i]);
			this.templates[this.templateIds[i]].load().always(function(){
				templateCounter++;
				if ( templateCounter === self.templateIds.length ){
					self._applicationReady = true;
					def.resolve();
				}
			});
		}
		
		return def.promise();
	};
	
	models.Application.prototype.run = function ( fn ){
		if ( this._applicationReady === true ){
			fn();
		}else{
			this.ready(fn);
		}
	};
	
	models.Application.prototype.getUrlParameter = function (){
		
	};
})
( 
	(base = window || global || {} ),
	base.core || (base.core={}),
	base.core.models || (base.core.models={}),
	jQuery
);

