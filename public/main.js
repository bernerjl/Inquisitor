if (location.hash == '#more') {
	alert("C'mon, you gotta confess more than that!");
	location.hash='#';
} else if (location.hash == '#flood') {
	alert("Sorry, but there are just too many sinners trying to confess right now.\n Try again in a bit");
	location.hash='#';
}
