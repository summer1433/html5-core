var org = {};
org.xiha = {};
org.xiha.html5 = {};
org.xiha.html5.Bootstrap = function() {

	this.ps = new Array();// packages

	this.path = '';
};

var bootstrap = new org.xiha.html5.Bootstrap;

(

function() {

	var scripts = document.getElementsByTagName('script'),

	i, ln, scriptSrc, match;

	for (i = 0, ln = scripts.length; i < ln; i++) {
		scriptSrc = scripts[i].src;

		match = scriptSrc.match(/org\.xiha\.html5\.bootstrap\.js$/);

		if (match) {
			bootstrap.path = scriptSrc.substring(0, scriptSrc.length
					- match[0].length);
			break;
		}
	}

})();

request = function(p) {
	var exist = false;
	for ( var m = 0; m < bootstrap.ps.length; m++) {
		if (bootstrap.ps[m] == p) {
			exist = true;
			break;
		}

	}
	if (!exist) {
		bootstrap.ps.push(p);
		document.write('<script type="text/javascript" src="' + bootstrap.path
				+ p + '.js"></script>');

	}

};