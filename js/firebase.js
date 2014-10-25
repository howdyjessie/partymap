var fb = new Firebase("https://blinding-torch-598.firebaseio.com/");

function addParty() {
	fb.push({
		name: "Sigma Nu Rumble",
		location: {
			street: "803 W. 30th St. Apt. 15",
			city: "Los Angeles",
			state: "California",
			zip: 90007

		},
		cost: 5,
		status: true
	});
}