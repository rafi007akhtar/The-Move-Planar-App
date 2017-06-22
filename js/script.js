
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
    
    $nytHeaderElem.attr("style", "text-decoration: underline");

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // collect the address and city
    var street = $("#street").val();
    var city = $("#city").val();
    // put up the location and URL
    var loc = street + ", " + city;
    // set up the size
    var width = screen.width * 2;
    var height = screen.height;
    // location
    var url = "http://maps.googleapis.com/maps/api/streetview?size=" + width + "x" + height + "&location=" + loc;
    // add an image tag to the body, and set it up
    //$body.append('<img class="bgmig" src="' + url + '">');
    //$(".bgmig").attr("src", url);
    var style = "background-image: url(" + url + ");"
    $body.attr("background", url);
    
    // set up NYT API articles
    
    /* the JSON function uses three parameters:
        * URL of the server in string
        * [data sent to the server]
        * [success function(data retrieved from the server)]
    [] means this is optional
    */
    var nyurl = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + street + "&sort=newest&api-key=736806e5c4ff4b85887dc530591812f5";
    $.getJSON(nyurl, function(data) {
        var articles = data.response.docs;
        var l = articles.length;
        for(var i = 0; i < l; i++) {
            var obj = articles[i];
            $nytElem.append(
                "<li> <h4> <a href = '" + obj.web_url + "' target='_blank'>" + obj.headline.print_headline + " </a></h4> <p>" + obj.snippet + "</p> </li>"
            )            
                .attr("type", "none");
            
        }
        console.log(data);
    })
    .fail(function() {
        $nytHeaderElem.html("New York Times Articles Could Not Be Loaded")
                
    });
    
    // finally, set up Wikipedia links
    
    /* 
    The AJAX function has the following parameters
        * the URL of the site to which the API request is sent
        * [the settings property]
    The settings parameter has many properties, one of which is success
        success: function(data) {
        // your code goes here
        }
    
    */
    
    return false;
};

$('#form-container').submit(loadData);
