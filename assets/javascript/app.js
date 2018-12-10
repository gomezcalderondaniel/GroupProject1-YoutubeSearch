$('.btn grey').on('click', function() {
    var clientId = '7f7d8a472a82495cb135227ad7a595a1';
    var clientSecret = '23aba3d8f521463998673ac3ffbcb01c';
    var moodSelect = $("#channel-input").val().toLowerCase();
    var queryURL = 'https://api.spotify.com/v1/search?type=playlist&q=' + moodSelect + '&access_token=BQC2FS3HzkXjfzlWIunPeP00WkMxJujnhymqRL0RfQYvjNFaqEDQjJe8yoJzqLvcNYj9xULBH-NGupWZam1xF3NOA6F8M0KrUS91VpOMEvnM8d1QLDA1o6Y6zlcAMi7-44JgtGQ7djp-wUzzldbyWPKQ';

    
    
    $.ajax({
        url: queryURL,
        method:'GET'
    }).then(function(response){
        console.log("mood:" + moodSelect);
        console.log(response);
        var embedCode = '<iframe src="https://open.spotify.com/embed/playlist/' + response.playlists.items[0].id + '" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>';
        $('#playerIFrame').html(embedCode);
  })
    
})

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBq9g0wIZE9mw5II9BXZEouUvuKGOWbIK8",
    authDomain: "moodlist-6736e.firebaseapp.com",
    databaseURL: "https://moodlist-6736e.firebaseio.com",
    projectId: "moodlist-6736e",
    storageBucket: "moodlist-6736e.appspot.com",
    messagingSenderId: "224635158925"
  };
  firebase.initializeApp(config);
  var database = firebase.database();

