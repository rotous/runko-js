(function( base, core, models, $ ){
	
	"use strict";
	
	models.Url = function (){
		this.hash = '';
		this.hashParameters = {};
		this.hashChangeListeners = [];
			
		this.InitialiseHashChangeListener();
		
		this.parseHash();
	};
	
	models.Url.prototype.getHash = function (){
		this.hash = location.hash.substring(1);
		return this.hash;
	};
	
	models.Url.prototype.setHash = function (hash){
		this.hash = hash;
		location.hash = this.hash;
	};
	
	models.Url.prototype.InitialiseHashChangeListener = function(){
		var self = this;
		
		$(window).on('hashchange', function(){
			
			//Update the hash property
			self.getHash();
			
			for ( var i=0; i<self.hashChangeListeners.length; i++ ){
				self.hashChangeListeners[i].apply(null, arguments);
			}
		});
	};
	
	models.Url.prototype.parseHash = function (){
		this.getHash();
		this.hashParameters = {};
		var keyVal;
		var hashSplit = this.hash.split('&');
		for ( var i=0; i<hashSplit.length; i++ ){
			keyVal = hashSplit[i].split('=');
			if ( keyVal.length === 1 ){
				this.hashParameters[keyVal[0]] = undefined;
			}else{
				if ( parseInt(keyVal[1], 10) == keyVal[1] ){ keyVal[1] = parseInt(keyVal[1], 10); }
				else if ( parseFloat(keyVal[1]) == keyVal[1] ){ keyVal[1] = parseFloat(keyVal[1]); }
				else if ( keyVal[1] === 'true' ) { keyVal[1] = true; }
				else if ( keyVal[1] === 'false' ) { keyVal[1] = false; }
				this.hashParameters[keyVal[0]] = keyVal[1];
			}
		}
		
		return this.hashParameters;
	};
	
	models.Url.prototype.addHashChangeListener = function ( fn ){
		if ( this.hashChangeListeners.indexOf(fn) === -1 ){
			this.hashChangeListeners.push(fn);
		}
	};
	models.Url.prototype.onHashChange = models.Url.prototype.addHashChangeListener;
	
	models.Url.prototype.removeHashChangeListener = function ( fn ){
		if ( !this.hashChangeListeners ){ return };
		
		var index = this.hashChangeListeners.indexOf(fn);
		if ( index >= 0 ) { 
			this.hashChangeListeners.splice(index, 1);
		}
	};
	models.Url.prototype.offHashChange = models.Url.prototype.removeHashChangeListener;
	
})
( 
	(base = window || global || {} ),
	base.core || (base.core={}),
	base.core.models || (base.core.models={}),
	jQuery
);
