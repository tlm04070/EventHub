$(document).ready(function () {

    var config = {
        apiKey: "AIzaSyAqvI_ClOC4GsGp582OWw7d7PzFi_pT8sQ",
        authDomain: "recent-name.firebaseapp.com",
        databaseURL: "https://recent-name.firebaseio.com",
        projectId: "recent-name",
        storageBucket: "recent-name.appspot.com",
        messagingSenderId: "126583712962"
    };
    firebase.initializeApp(config);

    var database = firebase.database();
    var nameArray = [];
    var dateArray = [];
    var localeArray = [];
    var cityArray = [];
    var stateArray = [];

    $("#infoSubmit").on("click", function () {


        var searchKeyword = $("#exampleInputEmail1").val().trim();
        var searchCity = $("#exampleInputPassword1").val().trim();
        var authKey = "c6Pfj5qgjtkvDTOAzxWf1bDTtr80wGVA";
        var queryURLBase = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + searchKeyword + "&city=" + searchCity + "&raduis=20&unit=miles&apikey=" +
            authKey;


        $.ajax({
            url: queryURLBase,
            method: "GET"
        }).done(function (response) {
            console.log(response);
            var results = response;

            for (var i = 0; i < results._embedded.events.length; i++) {
                var eventList = results._embedded.events[i];
                var eventName = eventList.name;
                var eventDate = eventList.dates.start.localDate;
                var eventLocale = eventList._embedded.venues[0].name;
                var eventCity = eventList._embedded.venues[0].city.name;
                var eventState = eventList._embedded.venues[0].state.name;

                nameArray.push(results._embedded.events[i].name);
                dateArray.push(eventDate);
                localeArray.push(eventLocale);
                cityArray.push(eventCity);
                stateArray.push(eventState);

            };

            database.ref().child("Search").set({
                name: nameArray,
                date: dateArray,
                venue: localeArray,
                city: cityArray,
                state: stateArray,

            });

        });
        database.ref().on("child_added", function (childSnapshot, prevChildKey) {

            console.log(childSnapshot.val().name);

            // Store everything into a variable.
            var searchName = childSnapshot.val().name;
            var searchDate = childSnapshot.val().date;
            var searchVenue = childSnapshot.val().venue;
            var searchCity = childSnapshot.val().city;
            var searchState = childSnapshot.val().state;



            // Add each train's data into the table
            $("#cards").append(
                "<div class='card' style='width: 20rem;'>" +
                "<div class='card-block'>" +
                "<h4 class='card-title'>" + searchName + "</h4>" + "<hr>" +
                "<p class='card-text'>" + searchDate + "</p>" + "</br>" +
                "<p class='card-text'>" + searchVenue + "</p>" + "</br>" +
                "<p class='card-text'>" + searchCity + "</p>" + "</br>" +
                "<p class='card-text'>" + searchState + "</p>" + "</br>" +
                "<a href='#' class='btn btn-primary'> Save </a>" +
                "</div>" +
                "</div>"
            );

        });
    });

});