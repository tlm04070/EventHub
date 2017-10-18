$(document).ready(function () {
    var dataRemove = database.ref().child("Search");
    dataRemove.remove();
});

var config = {
    apiKey: "AIzaSyAqvI_ClOC4GsGp582OWw7d7PzFi_pT8sQ",
    authDomain: "recent-name.firebaseapp.com",
    databaseURL: "https://recent-name.firebaseio.com",
    projectId: "recent-name",
    storageBucket: "recent-name.appspot.com",
    messagingSenderId: "126583712962"
};

firebase.initializeApp(config);

var provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/plus.login');

$("#logSubmit").on("click", function signIn() {
    console.log("Sign IN");
    firebase.auth().signInWithPopup(provider).then(function (result) {
        //this gives you a google access token. you can use it to access the google api.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log(user.displayName);
        firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    window.location = "src='../../login.html'"; //After successful login, user will be redirected to home.html
                }
            })
            .catch(function (error) {
                //handle errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                //the email of the user's account used
                var email = error.email;
                // the firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
            });
    });
});


var database = firebase.database();
var nameArray = [];
var dateArray = [];
var localeArray = [];
var cityArray = [];
var stateArray = [];
var ticketArray = [];

var emptyArray = function () {
    nameArray = [],
        dateArray = [],
        localeArray = [],
        cityArray = [],
        stateArray = [];
};

$("#infoSubmit").on("click", function (event) {

    event.preventDefault();
    var dataRemove = database.ref().child("Search");
    dataRemove.remove();
    emptyArray();
    $("#cards").empty();
    console.log(nameArray);


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
        console.log(response.page.totalElements);
        if (response.page.totalElements == 0) {
            $("#cards").append(
                "<div class='card' style='width: 20%; margin-left: 2%; margin-right: 2%; display: inline-block;' id='no-results-card'>" +
                "<div class='card-block'>" +
                "<center><h2 class='card-title' id='errorCard'>No results found</h2></center>" + "<hr>" +
                "<h4 class='card-text'>Try searching something else</h4>" +
                "</div>" +
                "</div>"
            );
        } else {
            console.log(response);

            var results = response;

            for (var i = 0; i < results._embedded.events.length; i++) {
                var eventList = results._embedded.events[i];
                var eventName = eventList.name;
                var eventDate = eventList.dates.start.localDate;
                var eventLocale = eventList._embedded.venues[0].name;
                var eventCity = eventList._embedded.venues[0].city.name;
                var eventState = eventList._embedded.venues[0].state.name;
                var eventTickets = eventList.url;


                nameArray.push(results._embedded.events[i].name);
                dateArray.push(eventDate);
                localeArray.push(eventLocale);
                cityArray.push(eventCity);
                stateArray.push(eventState);
                ticketArray.push(eventTickets);

            };

            database.ref().child("Search").set({
                name: nameArray,
                date: dateArray,
                venue: localeArray,
                city: cityArray,
                state: stateArray,
                tickets: ticketArray,

            });


        }
    });
});
database.ref().on("child_added", function (childSnapshot) {
    counter = 0;
    for (let i = counter; i < 8; i++) {
        console.log(childSnapshot.val().name[i]);
        var searchName = childSnapshot.val().name[i];
        var searchDate = childSnapshot.val().date[i];
        var searchVenue = childSnapshot.val().venue[i];
        var searchCity = childSnapshot.val().city[i];
        var searchState = childSnapshot.val().state[i];
        var searchTickets = childSnapshot.val().tickets[i];
        console.log(searchTickets);

        $("#cards").append(
            "<div class='card' style='width: 20%; margin-left: 2%; margin-right: 2%; display: inline-block;' id='card-result'>" +
            "<div class='card-block'>" +
            "<h2 class='card-title' id='searchName'>" + searchName + "</h2>" + "<hr>" +
            "<h3 class='card-text' id='searchVenue'>" + searchVenue + "</h3>" + "</br>" +
            "<h4 class='card-text' id='searchCity'>" + searchCity + "</h4>, " +
            "<p class='card-text' id='searchState'>" + searchState + "</p>" + "</br>" +
            "<p class='card-text' id='searchDate'>" + searchDate + "</p>" + "</br>" +
            "<button class='btn btn-primary text-center' style='text-align: center' id='savebtn'> Save </button>" +
            "<a href= '" + searchTickets + "' id='ticketBtn'><button class='btn btn-secondary text-center' style='text-align: center'></button></a>" +
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
        var resultTicket = $(this).siblings("#ticketBtn").attr("href");

        console.log(resultName);
        console.log(resultVenue);
        console.log(resultCity);
        console.log(resultState);
        console.log(resultDate);
        console.log(resultTicket);

        var ticketButton = $("<button>");
        // ticketButton.attr("id", "ticketButton");
        // ticketButton.addClass("btn btn-secondary");
        // ticketButton.text("Buy Here");
        $(document).on("click", "#ticketButton", function () {
            window.open(resultTicket);
        });
        $(document).on("click", "#deleteButton", function () {
            $(this.parentElement.parentElement).remove();
        })
        console.log(ticketButton);

        // Add each train's data into the table
        $("#results-table > tbody").append(
            "<tr><td>" + resultName +
            "</td><td>" + resultVenue +
            "</td><td>" + resultCity +
            "</td><td>" + resultState +
            "</td><td>" + resultDate +
            "</td><td><button class='btn btn-secondary' id='ticketButton'>Buy Tickets</button>" +
            "</td><td><button class='fa fa - minus - square - o' aria-hidden= 'true' id='deleteButton'></button>" +
            "</td></tr>");
    });
});