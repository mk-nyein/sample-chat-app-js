
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
// Initialize Firebase 

// Create DOM Elements
	var anonymous_btn = document.getElementById('anonymous_btn');
	var sign_in_btn = document.getElementById('sign_in_btn');
	var sign_up_btn = document.getElementById('sign_up_btn');
	var log_out_btn = document.getElementById('log_out_btn');
	var google_btn = document.getElementById('google_btn');

	var chat_room = document.getElementById('chat_room');
	var select_room = document.getElementById('select_room');
	var save_btn = document.getElementById('save_btn');
	var label = document.getElementById('label');

	var message_list = document.getElementById('message_box');
	var display_msg = document.getElementById('display_msg');
	var text_msg = document.getElementById('text_msg');
	var send_msg = document.getElementById('send_msg');
// Create DOM Elements

// Custom variables
	var array = [];
	var guser = '';
	var messagesRef = database.ref();
// Custom variables

// Create State change
	auth.onAuthStateChanged(function (user) {
		// body...
		if(user){
			guser = user;
	console.log('on auth state change '+ guser);
			log_out_btn.removeAttribute('hidden');
			sign_in_btn.setAttribute('hidden', 'true');
			sign_up_btn.setAttribute('hidden', 'true');
			anonymous_btn.setAttribute('hidden', 'true');
			google_btn.setAttribute('hidden', 'true');

	        loadMessages();
		} else {
			guser = '';
			log_out_btn.setAttribute('hidden', 'true');
			sign_in_btn.removeAttribute('hidden');
			sign_up_btn.removeAttribute('hidden');
			anonymous_btn.removeAttribute('hidden');
			google_btn.removeAttribute('hidden');
		}
	});

	auth.checkSignedInWithMessage = function  () {
		// body...
	console.log('check sign in msg '+ guser);
		if (guser) {
		    return true;
		}
		var data = {
	        message: 'You must sign-in first',
	        timeout: 2000
	    };
    	return false;
	};

// User authentication functions
	anonymous_btn.onclick = function () {
		// body...
		console.log('sign in');
		auth.signInAnonymously();

	}
	log_out_btn.onclick = function  () {
		// body...
		console.log('log out');
		auth.signOut();
	}
	google_btn.onclick = function  () {
		// body...
		console.log('login with google');
		// Sign in Firebase using popup auth and Google as the identity provider.
	    var provider = new firebase.auth.GoogleAuthProvider();
	    auth.signInWithPopup(provider);
	};
// User authentication functions

	// Create the chatroom add function
	function save_room() {
		// body...
		console.log('...');
		if(chat_room.value && auth.currentUser){
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
		} else {
			alert('enter something or login first');
		}
	}

	// Create for the chatroom change
	select_room.onchange = function () {
		// body...
		label.innerHTML = select_room.value;

		if(guser){
			console.log('display some msg');
			display_msg.innerHTML = "";
			loadMessages();
		} else {
			alert('login first');
		}
	};

	send_msg.onclick = function  () {
		// body...
		if(auth.checkSignedInWithMessage()){

			console.log('user exist');
			var currentUser = guser;
	        // Add a new message entry to the Firebase Database.
	        messagesRef.push({
	            text: text_msg.value
	        }).then(function() {
	            // Clear message text field and SEND button state.
	            resetMaterialTextfield(text_msg);
	            toggleButton();
	        }.bind(this)).catch(function(error) {
	            console.error('Error writing new message to Firebase Database', error);
	        });
		} else {
			console.log('login first');
		}
	};


	function loadMessages() {
		// body...
        messagesRef = database.ref().child(select_room.value);
        console.log('current db '+ messagesRef);
	    // Make sure we remove all previous listeners.
	    messagesRef.off();

	    // Loads the last 12 messages and listen for new ones.
	    var setMessage = function(data) {
	        var val = data.val();
	        displayMessage(data.key, val.name, val.text, val.photoUrl, val.imageUrl);
	    }.bind(this);
	    messagesRef.limitToLast(12).on('child_added', setMessage);
	    messagesRef.limitToLast(12).on('child_removed', setMessage);
	    messagesRef.limitToLast(12).on('child_changed', setMessage);
	}


	// Template for messages.
	MESSAGE_TEMPLATE =
	'<div class="message-container">' +
	'<div class="message"></div>' +
	'</div>';

	// A loading image URL.
	LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';

	// Displays a Message in the UI.
	function displayMessage (key, name, text, picUrl, imageUri) {
	    console.log('display message'+ " and the database ref is "+ this.messagesRef);
	    var div = document.getElementById(key);
	    // If an element for that message does not exists yet we create it.
	    if (!div) {
	        var container = document.createElement('div');
	        container.innerHTML = MESSAGE_TEMPLATE;

	        div = container.firstChild;
	        div.setAttribute('id', key);
	        var db = messagesRef.child(key);

	        //delete btn 
	        var delbtn = document.createElement('button');
	        delbtn.innerHTML = 'delete';
	        delbtn.id = key+'del';
	        delbtn.onclick = function(){
	            db.remove();
	            document.getElementById(key).remove();
	        }

	        //update btn 
	        var updbtn = document.createElement('button');
	        updbtn.innerHTML = 'update';
	        updbtn.id = key+'upd';
	        updbtn.onclick = function(){
	            var x = document.createElement("FORM");
	            x.setAttribute("id", "myForm");
	            div.appendChild(x);

	            var y = document.createElement("INPUT");
	            y.setAttribute("type", "text");
	            y.id = key+ "text";

	            var submitbtn = document.createElement("button");
	            submitbtn.innerHTML = 'submit';
	            submitbtn.id = key+"sub";
	            var cancelbtn = document.createElement("button");
	            cancelbtn.innerHTML = 'cancel';
	            cancelbtn.id = key+"can";


	            db.on("value", function(snapshot) {
	                y.setAttribute("value", snapshot.val().text);
	                console.log(snapshot.val());
	            }, function (error) {
	                console.log("Error: " + error.code);
	            });

	            document.getElementById(key+'msg').style.visibility = "hidden";
	            document.getElementById(key+'upd').style.visibility = "hidden";
	            document.getElementById(key+'del').style.visibility = "hidden";

	            cancelbtn.onclick = function () {
	                // body...
	                alert('cancel');
	                document.getElementById('myForm').style.visibility = "hidden";
	                document.getElementById(key+'text').style.visibility = "hidden";
	                document.getElementById(key+'sub').style.visibility = "hidden";
	                document.getElementById(key+'can').style.visibility = "hidden";

	                document.getElementById(key+'msg').style.visibility = "visible";
	                document.getElementById(key+'upd').style.visibility = "visible";
	                document.getElementById(key+'del').style.visibility = "visible";
	            }//cancelbtn function end

	            submitbtn.onclick = function () {
	            // body...
	                alert('submit');
	                var updtext = {
	                    text: document.getElementById(key+'text').value
	                };
	                db.update(updtext);

	                document.getElementById('myForm').style.visibility = "hidden";
	                document.getElementById(key+'text').style.visibility = "hidden";
	                document.getElementById(key+'sub').style.visibility = "hidden";
	                document.getElementById(key+'can').style.visibility = "hidden";

	                document.getElementById(key+'msg').style.visibility = "visible";
	                document.getElementById(key+'upd').style.visibility = "visible";
	                document.getElementById(key+'del').style.visibility = "visible";
	            }//submitbtn function end

	            document.getElementById("myForm").appendChild(y);
	            document.getElementById("myForm").appendChild(submitbtn);
	            document.getElementById("myForm").appendChild(cancelbtn);
	        }//update btn function end

	        div.appendChild(updbtn);
	        div.appendChild(delbtn);
	        display_msg.appendChild(div);
	    }//div function end

	    // div.querySelector('.name').textContent = name;
	    var messageElement = div.querySelector('.message');
	    
	    if (text) { // If the message is text.
	        messageElement.id = key+'msg';
	        messageElement.textContent = text;
	        // Replace all line breaks by <br>.
	        messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
	    } 
	    // else if (imageUri) { // If the message is an image.
	    //     var image = document.createElement('img');
	    //     image.addEventListener('load', function() {
	    //         this.messageList.scrollTop = this.messageList.scrollHeight;
	    //     }.bind(this));
	    //     this.setImageUrl(imageUri, image);
	    //     messageElement.innerHTML = '';
	    //     messageElement.appendChild(image);
	    // }//text else if


	    // Show the card fading-in.
	    setTimeout(function() {div.classList.add('visible')}, 1);
	    display_msg.scrollTop = display_msg.scrollHeight;
	    text_msg.focus();
	};//display message function



	// Create for textbox is empty or not
	$(text_msg).keyup(function() {
		toggleButton();
	});






	// Resets the given MaterialTextField.
	resetMaterialTextfield = function(element) {
		element.value = '';
	};//resetMaterialTextfield function end

	// Enables or disables the submit button depending on the values of the input
	// fields.
	function toggleButton() {
	    if (text_msg.value) {
	        send_msg.removeAttribute('disabled');
	    } else {
	        send_msg.setAttribute('disabled', 'true');
	    }
	};//toggleButton end
