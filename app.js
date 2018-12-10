function tplawesome(e, t) { res = e; for (var n = 0; n < t.length; n++) { res = res.replace(/\{\{(.*?)\}\}/g, function (e, r) { return t[n][r] }) } return res }

$(function() {
    $("form").on("submit", function(e) {
       e.preventDefault();
       // prepare the request
        console.log($("#search").val());
        
       var request = gapi.client.youtube.search.list({
            part: "snippet",
            type: "video",
            q: encodeURIComponent($("#search").val()).replace(/%20/g, "+"),
            maxResults: 3,
            order: "viewCount",
            publishedAfter: "2017-01-01T00:00:00Z"
       });
        console.log(request)
       // execute the request
       request.execute(function(response) {
          var results = response.result;
          console.log(results);
          $("#vidResults").html("");
          $.each(results.items, function(index, item) {
            $.get("item.html", function(data) {
                $("#vidResults").append(tplawesome(data, [{"title":item.snippet.title, "videoid":item.id.videoId}]));
            });
          });
          resetVideoHeight();
       });
    });
    
    $(window).on("resize", resetVideoHeight);
});

function resetVideoHeight() {
    $(".video").css("height", $("#vidResults").width() * 9/16);
}

function init() {
    gapi.client.setApiKey("AIzaSyA9kFe0UNEDwyN0XRhozQf-78VIB5qjD7g");
    gapi.client.load("youtube", "v3", function() {
        // yt api is ready
    });
}
