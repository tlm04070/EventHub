$(document).ready(function () {
    var nameArray = [];
    var dateArray = [];
    var localeArray = [];
    var authKey = "c6Pfj5qgjtkvDTOAzxWf1bDTtr80wGVA";
    var searchKeyword = "Panthers"
    var searchCity = "charlotte"
    var queryURLBase = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + searchKeyword + "&city=" + searchCity + "&raduis=20&unit=miles&apikey=" +
        authKey;

    $.ajax({
        url: queryURLBase,
        method: "GET"
    }).done(function (response) {
        console.log(response);
        var results = response;
        // console.log(results._embedded.events[0]);
        // console.log(results._embedded.events);

        for (var i = 0; i < results._embedded.events.length; i++) {
            var eventList = results._embedded.events[i];
            var eventName = eventList.name;
            var eventDate = eventList.dates.start.localDate;
            nameArray.push(results._embedded.events[i]);
            dateArray.push(eventDate);
            console.log(eventName);
            console.log(eventDate);


        };
        console.log(nameArray[0].name);
        console.log(nameArray[1].name);
        console.log(nameArray[2].name);
        console.log(nameArray[3].name);
        console.log(dateArray[0]);
        console.log(dateArray[1]);
        console.log(dateArray[2]);
        console.log(dateArray[3]);
    });


});