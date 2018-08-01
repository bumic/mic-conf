/* 
*  Thank you to https://www.html5rocks.com/en/tutorials/pagevisibility/intro/ for
*  the majority of the code to get this working.
*/

function getHiddenProp(){
	var prefixes = ['webkit','moz','ms','o'];
		
	// if 'hidden' is natively supported just return it
	if ('hidden' in document) return 'hidden';
		
	// otherwise loop over all the known prefixes until we find one
	for (var i = 0; i < prefixes.length; i++){
		if ((prefixes[i] + 'Hidden') in document) 
			return prefixes[i] + 'Hidden';
	}

	// otherwise it's not supported
	return null;
}

function isHidden() {
	var prop = getHiddenProp();
	if (!prop) return false;
		
	return document[prop];
}

/* 
*  Stop particleJS animation if webpage is not visible
*/

// use the property name to generate the prefixed event name
var hiddenProp = getHiddenProp();
if (hiddenProp) {
	var eventName = hiddenProp.replace(/[H|h]idden/,'') + 'visibilitychange';
	document.addEventListener(eventName, onVisChange);
}

function onVisChange() {
	if (isHidden()) {
		// disable particle movement
		pJSDom[0].pJS.particles.move.enable = false;
	} else {
		// restart particle movement
		pJSDom[0].pJS.particles.move.enable = true;
		pJSDom[0].pJS.fn.particlesRefresh();	
	}
}