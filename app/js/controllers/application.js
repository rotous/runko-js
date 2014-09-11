(function( base, core, $ ){
	
	"use strict";
	
//	var t0 = new core.models.Template('inline-header');
//	t0.place('header', {subtitle: 'this is my subtitle'});
	
	var myApp = new core.models.Application({
		templates: ['header', 'inline-header', 'footer', 'content'],
		styles: ['reset', 'layout', 'header', 'footer']
	});
	
	myApp.run(function(){
		console.log('running the app');
		myApp.templates['header'].place({title: 'My first app with x.js', subtitle: 'this is my app'});
		myApp.templates['footer'].place();
		myApp.templates['header'].place({title: 'My first app with runkoJS', subtitle: 'this is my app subtitle'});
		myApp.templates['content'].place();
		
		var url = new core.models.Url();
		var myHashChangeListener = function(e){
			console.log('hash params=', url.parseHash(), e);
			url.offHashChange(myHashChangeListener);
		}
		url.onHashChange(myHashChangeListener);
	});
	
	console.log('myApp=', myApp)
})
( 
	(base = window || global || {} ),
	base.core || (base.core={}),
	jQuery
);

