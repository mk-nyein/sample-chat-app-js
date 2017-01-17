
// Initialize Firebase
	var config = {
		apiKey: "AIzaSyD1tT0NU17sQlPSEykZgGXdXYbwzsEN-Dc",
		authDomain: "sample-chat-app-98029.firebaseapp.com",
		databaseURL: "https://sample-chat-app-98029.firebaseio.com",
		storageBucket: "sample-chat-app-98029.appspot.com",
		messagingSenderId: "23844314392"
	};
	firebase.initializeApp(config);

	const auth = firebase.auth();
	const database = firebase.database();
	const storage = firebase.storage();
	  // Initiates Firebase auth and listen to auth state changes.
	
	// auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
	
	// Create DOM Elements
	var chat_room = document.getElementById('chat_room');
	var select_room = document.getElementById('select_room');

	var save_btn = document.getElementById('save_btn');
	var label = document.getElementById('label');

	var array = [];

	function save_room() {
		// body...
		// Save the text from the textbox to the array
		var room = chat_room.value;
		array.push(room);

		// Append the newly created chat room to the select list
		var option = document.createElement('option');
		option.innerHTML = room;
		select_room.append(option);

		// Clear the textbox
		chat_room.value = "";

		label.innerHTML = select_room.value;
	}

	select_room.onchange = function () {
		// body...
		label.innerHTML = select_room.value;
	}