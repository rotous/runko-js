(function( base, core, models, $ ){
	
	"use strict";
	
	models.Template = function Template(templateId){
		this.templateId = templateId;
		
		this.content = undefined;
		
		this.loaded = false;
		this.loading = false;
		this.load();
	};
	
	models.Template.prototype.load = function(){
		if ( !this.loadingDef ){ this.loadingDef = $.Deferred(); }
		var self = this;
		
		if ( this.loaded && this.content ){ //It has already been loaded
			this.loadingDef.resolve( this.content );
		}else if ( this.loading ){ //It is being loaded right now
			return this.loadingDef.promise();
		}else{
			this.loading = true;
			
			//Try to find it as inline script
			var $inlineTemplate = $("script[type='text/x-template']#tpl-"+this.templateId);
			
			if ( $inlineTemplate.length > 0 ){
				
				this.content = $inlineTemplate.html();
				this.loaded = true;
				this.loading = false;
				this.loadingDef.resolve(this.content);
				
			}else{
				
				$.get('js/views/'+this.templateId+'.tpl.html')
					.done(function(data){
						self.content = data;
						self.loaded = true;
						self.loading = false;
						self.loadingDef.resolve(self.content);
					})
					.fail(function(data){
						self.loaded = false;
						self.loading = false;
						self.loadingDef.reject('unable to load template');
					});
			}
		}
		
			
		return this.loadingDef.promise();
	};
	
	models.Template.prototype.loadVariables = function ( variables ){
		this.variables = variables;
	};
	
	models.Template.prototype.parse = function ( variables ){
		if ( variables ){
			this.loadVariables(variables);
		}
		
		var re;
		var matches;
		
		//Work with a copy, so we can keep the original
		var template = this.content;
		
		//First simple replacements
		if ( typeof this.variables === 'object' ){
			for ( var k in this.variables ){
				re = new RegExp('\{\{('+k+'(\|\|(.*?))?)\}\}');
				while ( matches = template.match(re) ){
					template = template.replace(matches[0], this.variables[k]);
				}
			}
		}
		
		//Then simple loops
		
		//Parse unhandled curly braces
		re = /\{\{((.*?)(\|\|(.*?))?)\}\}/i;
		while ( matches = template.match(re) ){
			template = template.replace(matches[0], matches[4] ? matches[4] : '{' + matches[1] + '}');
		}
		
		//Finally replace escaped curly braces
		
		return template;
	};
	
	models.Template.prototype.place = function( sectionId, variables ){
		var self = this;
		
		this.load().done(function(){
			if ( !variables && typeof sectionId === 'object' ){
				variables = sectionId;
				sectionId = undefined;
			}

			var parsedTemplate = self.parse(variables);
			
			if ( !sectionId ){ sectionId = self.templateId; }
			self.$section = $("#"+sectionId);
			self.$section.html(parsedTemplate);
		});
	};
	
})
( 
	(base = window || global || {} ),
	base.core || (base.core={}),
	base.core.models || (base.core.models={}),
	jQuery
);
