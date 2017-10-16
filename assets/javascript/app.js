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

    const fresh = function fresh() {
        database.ref().child("Search").remove;
    }

    $("#infoSubmit").on("click", function (event) {
        event.preventDefault();
        fresh();
        console.log(fresh());


        var searchKeyword = $("#exampleInputEmail1").val();
        console.log(searchKeyword);
        var searchCity = $("#exampleInputPassword1").val();
        console.log(searchCity);
        var authKey = "c6Pfj5qgjtkvDTOAzxWf1bDTtr80wGVA";
        var queryURLBase = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + searchKeyword + "&city=" + searchCity + "&raduis=20&unit=miles&size=8&apikey=" +
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

            for (let i = 0; i < nameArray.length; i++) {
                console.log(childSnapshot.val().name[i]);
                var searchName = childSnapshot.val().name[i];
                var searchDate = childSnapshot.val().date[i];
                var searchVenue = childSnapshot.val().venue[i];
                var searchCity = childSnapshot.val().city[i];
                var searchState = childSnapshot.val().state[i];
                $("#cards").append(
                    "<div class='card' style='width: 20%; margin-left: 2%; margin-right: 2%; display: inline-block;' id='number" + i + "'>" +
                    "<div class='card-block'>" +
                    "<h2 class='card-title' id='searchName'>" + searchName + "</h2>" + "<hr>" +
                    "<h3 class='card-text' id='searchVenue'>" + searchVenue + "</h3>" + "</br>" +
                    "<h4 class='card-text' id='searchCity'>" + searchCity + "</h4>, " +
                    "<p class='card-text' id='searchState'>" + searchState + "</p>" + "</br>" +
                    "<p class='card-text' id='searchDate'>" + searchDate + "</p>" + "</br>" +
                    "<button class='btn btn-primary text-center' style='text-align: center' id='savebtn'> Save </button>" +
                    "</div>" +
                    "</div>"
                );

                // Add each train's data into the table

            };
            $("#cards button").on("click", function () {
                $(this.parentElement.parentElement).hide("slow");
                var resultName = $(this).siblings("#searchName").html();
                var resultVenue = $(this).siblings("#searchVenue").html();
                var resultCity = $(this).siblings("#searchCity").html();
                var resultState = $(this).siblings("#searchState").html();
                var resultDate = $(this).siblings("#searchDate").html();

                console.log(resultName);
                console.log(resultVenue);
                console.log(resultCity);
                console.log(resultState);
                console.log(resultDate);
                // var trainName = childSnapshot.val().name;
                // var trainDest = childSnapshot.val().destination;
                // var trainStart = childSnapshot.val().start;
                // var trainFreq = childSnapshot.val().frequency;
                // var trainArrival = childSnapshot.val().arrival;
                // var trainAway = childSnapshot.val().away;


                // // Add each train's data into the table
                // $("#train-table > tbody").append(
                //     "<tr><td>" + trainName +
                //     "</td><td>" + trainDest +
                //     "</td><td>" + trainFreq + " mins" +
                //     "</td><td>" + trainArrival +
                //     "</td><td>" + trainAway + " mins" +
                //     "</td></tr>");
            });
        });
    });

});