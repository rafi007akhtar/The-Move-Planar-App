
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
    $body.css("background-size", "cover")
    
    // set up NYT API articles
    
    /* the JSON function uses three parameters:
        * URL of the server in string
        * [data sent to the server]
        * [success function(data retrieved from the server)]
    [] means this is optional
    */
    var nyurl = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + street + "&sort=newest&api-key=736806e5c4ff4b85887dc530591812f5";
    //var nyurl = "https://random-quote-generator.herokuapp.com/api/quotes/random";
    $.getJSON(nyurl, function(data) {
        console.log(data);
        var articles = data.response.docs;
        var l = articles.length;
        for(var i = 0; i < l; i++) {
            var obj = articles[i];
            $nytElem.append(
                "<li> <h4> <a href = '" + obj.web_url + "' target='_blank'>" + obj.headline.print_headline + " </a></h4> <p>" + obj.snippet + "</p> </li>"
            )            
                .attr("type", "none");
            
        }
    })
    .fail(function() {
        $nytHeaderElem.html("New York Times Articles Could Not Be Loaded")
                
    });
    
    // finally, set up Wikipedia links
    
    /* 
    The AJAX function has the following parameters
        * the URL of the site to which the API request is sent
        * [the settings property]
    The settings parameter has many properties, including
        success: function(data) {
        // your code goes here
        }
        dataType: // eg json or jsonp
    */
    // set up the URL
    var wikiurl = "";
    var strArray = street.split("");
    for(var i = 0; i < strArray.length; i++) {
        if(strArray[i] == " ")
            wikiurl += "%20";
        else if(strArray[i] == ".")
            wikiurl += "%2E";
        else 
            wikiurl += strArray[i];
    }
    //console.log(wikiurl);
    wikiurl = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+wikiurl+"&format=json&callback=wikiCallback";
    // set a timeout to handle errors
    var timeout = setTimeout(function() {
        $("#wikipedia-header").text("Failed to load wikipedia articles")
    }, 10000);
    // now call the AJAX function properly
    $.ajax({
        url: wikiurl,
        dataType: "jsonp",
        success: function(data) {
            console.log(data);
            var titles = data[1];
            var links = data[3];
            var l = titles.length;
            for(var i = 0; i < l; i++) {
                $wikiElem.append(
                    "<li> <a href='" +links[i] +"' target='_blank'>" + titles[i] + "</a></li>"
                )
                    .attr("style", "line-height: 1.5em;")
                    .attr("type", "none");
            }
            clearTimeout(timeout);
        }
    });
    
    return false;
};

$('#form-container').submit(loadData);
