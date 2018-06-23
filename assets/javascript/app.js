$(document).ready(function() {
  const dataRemove = database.ref().child("Search");
  dataRemove.remove();
});

const config = {
  apiKey: "AIzaSyAqvI_ClOC4GsGp582OWw7d7PzFi_pT8sQ",
  authDomain: "recent-name.firebaseapp.com",
  databaseURL: "https://recent-name.firebaseio.com",
  projectId: "recent-name",
  storageBucket: "recent-name.appspot.com",
  messagingSenderId: "126583712962"
};

firebase.initializeApp(config);

const provider = new firebase.auth.GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/plus.login");

$("#logSubmit").on("click", function signIn() {
  console.log("Sign IN");
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function(result) {
      //this gives you a google access token. you can use it to access the google api.
      const token = result.credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      console.log(user.displayName);
      firebase
        .auth()
        .onAuthStateChanged(user => {
          if (user) {
            window.location = "https://tlm04070.github.io/project-1/app.html"; //After successful login, user will be redirected to home.html
          }
        })
        .catch(function(error) {
          //handle errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          //the email of the user's account used
          const email = error.email;
          // the firebase.auth.AuthCredential type that was used.
          const credential = error.credential;
        });
    });
});

const database = firebase.database();
const nameArray = [];
const dateArray = [];
const localeArray = [];
const cityArray = [];
const stateArray = [];
const ticketArray = [];

const emptyArray = function() {
  (nameArray = []),
    (dateArray = []),
    (localeArray = []),
    (cityArray = []),
    (stateArray = []);
};

$("#infoSubmit").on("click", function(event) {
  event.preventDefault();
  const dataRemove = database.ref().child("Search");
  dataRemove.remove();
  emptyArray();
  $("#cards").empty();
  console.log(nameArray);

  const searchKeyword = $("#exampleInputEmail1").val();
  console.log(searchKeyword);
  const searchCity = $("#exampleInputPassword1").val();
  console.log(searchCity);
  const authKey = "c6Pfj5qgjtkvDTOAzxWf1bDTtr80wGVA";
  const queryURLBase =
    "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" +
    searchKeyword +
    "&city=" +
    searchCity +
    "&raduis=20&unit=miles&size=8&apikey=" +
    authKey;

  $.ajax({
    url: queryURLBase,
    method: "GET"
  }).done(function(response) {
    console.log(response.page.totalElements);
    if (response.page.totalElements === 0) {
      $("#cards").append(
        "<div class='card' style='width: 20%; margin-left: 2%; margin-right: 2%; display: inline-block;' id='no-results-card'>" +
          "<div class='card-block'>" +
          "<center><h2 class='card-title' id='errorCard'>No results found</h2></center>" +
          "<hr>" +
          "<h4 class='card-text'>Try searching something else</h4>" +
          "</div>" +
          "</div>"
      );
    } else {
      console.log(response);

      let results = response;

      for (let i = 0; i < results._embedded.events.length; i++) {
        let eventList = results._embedded.events[i];
        let eventName = eventList.name;
        let eventDate = eventList.dates.start.localDate;
        let eventLocale = eventList._embedded.venues[0].name;
        let eventCity = eventList._embedded.venues[0].city.name;
        let eventState = eventList._embedded.venues[0].state.name;
        let eventTickets = eventList.url;

        nameArray.push(results._embedded.events[i].name);
        dateArray.push(eventDate);
        localeArray.push(eventLocale);
        cityArray.push(eventCity);
        stateArray.push(eventState);
        ticketArray.push(eventTickets);
      }

      database
        .ref()
        .child("Search")
        .set({
          name: nameArray,
          date: dateArray,
          venue: localeArray,
          city: cityArray,
          state: stateArray,
          tickets: ticketArray
        });
    }
  });
});

database.ref().on("child_added", function(childSnapshot) {
  counter = 0;
  for (let i = counter; i < nameArray.length; i++) {
    console.log(childSnapshot.val().name[i]);
    let searchName = childSnapshot.val().name[i];
    let searchDate = childSnapshot.val().date[i];
    let searchVenue = childSnapshot.val().venue[i];
    let searchCity = childSnapshot.val().city[i];
    let searchState = childSnapshot.val().state[i];
    let searchTickets = childSnapshot.val().tickets[i];

    $("#cards").append(
      "<div class='card' style='width: 20%; margin-left: 2%; margin-right: 2%; display: inline-block;' id='card-result'>" +
        "<div class='card-block'>" +
        "<h2 class='card-title' id='searchName'>" +
        searchName +
        "</h2>" +
        "<hr>" +
        "<h3 class='card-text' id='searchVenue'>" +
        searchVenue +
        "</h3>" +
        "</br>" +
        "<h4 class='card-text' id='searchCity'>" +
        searchCity +
        "</h4>, " +
        "<p class='card-text' id='searchState'>" +
        searchState +
        "</p>" +
        "</br>" +
        "<p class='card-text' id='searchDate'>" +
        searchDate +
        "</p>" +
        "</br>" +
        "<button class='btn btn-primary text-center' style='text-align: center' id='savebtn'> Save </button>" +
        "<a href= '" +
        searchTickets +
        "' id='ticketBtn'><button class='btn btn-secondary text-center' style='text-align: center'></button></a>" +
        "</div>" +
        "</div>"
    );
    console.log(ticketArray);
    console.log($("#cards h2")[i]);
    if ($("#cards h2")[i].val == undefined) {
    }

    // Add each train's data into the table
  }
  $("#cards button").on("click", function() {
    $(this.parentElement.parentElement).hide("slow");
    let resultName = $(this)
      .siblings("#searchName")
      .html();
    let resultVenue = $(this)
      .siblings("#searchVenue")
      .html();
    let resultCity = $(this)
      .siblings("#searchCity")
      .html();
    let resultState = $(this)
      .siblings("#searchState")
      .html();
    let resultDate = $(this)
      .siblings("#searchDate")
      .html();
    let resultTicket = $(this)
      .siblings("#ticketBtn")
      .attr("href");
    let ticketButton = $("<button>");

    $(document).on("click", "#ticketButton", function() {
      window.open(resultTicket);
    });
    $(document).on("click", "#deleteButton", function() {
      $("#map").empty();
      $(this.parentElement.parentElement).remove();
    });
    $(document).on("click", "#mapButton", function iframe() {
      $("#map").empty();
      console.log("clicked");
      let iframe = $(
        "<iframe width = '100%'" +
          "height = '350'" +
          "frameborder = '0'" +
          "style = 'border:0'" +
          "src = 'https://www.google.com/maps/embed/v1/place?q=" +
          resultVenue +
          "%20" +
          resultCity +
          "&key=AIzaSyA-7z8l4lKh-zR9LvQqO-43vRrF8gPNtpc'" +
          "allowfullscreen></iframe>"
      );
      $("#map").append(iframe);
    });
    database
      .ref()
      .child("Saved")
      .set({
        name: resultName,
        venue: resultVenue,
        city: resultCity,
        state: resultState,
        date: resultDate
      });

    database
      .ref()
      .child("Saved")
      .push({
        name: resultName,
        venue: resultVenue,
        city: resultCity,
        state: resultState,
        date: resultDate
      });

    // Add each train's data into the table
    $("#results-table > tbody").append(
      "<tr><td>" +
        resultName +
        "</td><td>" +
        resultVenue +
        "</td><td>" +
        resultCity +
        "</td><td>" +
        resultState +
        "</td><td>" +
        resultDate +
        "</td><td><button class='btn btn-secondary' id='ticketButton'>Buy Tickets</button>" +
        "</td><td><button class = 'fa fa-map-o fa-lg' aria - hiden = 'true' id = 'mapButton'></button>" +
        "</td><td><button class='fa fa-minus-square-o fa-lg' aria-hidden= 'true' id='deleteButton'></button>" +
        "</td></tr>"
    );
  });
});
