
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyARv2XEK86CUndI_opuC2ptoUI1ZVgiQeI",
    authDomain: "train-time-f13f3.firebaseapp.com",
    databaseURL: "https://train-time-f13f3.firebaseio.com",
    projectId: "train-time-f13f3",
    storageBucket: "",
    messagingSenderId: "869273218046"
  };
  
  firebase.initializeApp(config);

  //Create variable to reference the database
  var database = firebase.database(); 

  //Capture Button Click
  $("#submitBtn").on("click", function(){

  	//Don't refresh the page 
  	event.preventDefault();

  	//fetch the values input
  	var varTrainName = $("#trainName").val().trim(); 
  	var varDestination = $("#destination").val().trim(); 
  	var varFirstTrainTime = $("#firstTrainTime").val().trim(); 
  	var varFrequency = $("#frequency").val();  

  	var newTrain = {

      name: varTrainName,
      destination: varDestination,
      firstTrain: varFirstTrainTime,
      frequency: varFrequency
    };

    // Uploads train data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrain);
    console.log(newTrain.frequency);

    // Alert
    alert("Train successfully added");

    // Clears all of the text-boxes
    $("#trainName").val("");
    $("#destination").val("");
    $("#firstTrainTime").val("");
    $("#frequency").val("");

    // Determine when the next train arrives.
    return false;
  	
  })


  database.ref().on("child_added", function(childSnapshot, prevChildKey) {

      console.log(childSnapshot.val());

      // Store everything into a variable.
      var tName = childSnapshot.val().name;
      var tDestination = childSnapshot.val().destination;
      var tFrequency = childSnapshot.val().frequency;
      var tFirstTrain = childSnapshot.val().firstTrain;

      var timeArr = tFirstTrain.split(":");
      var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
      var maxMoment = moment.max(moment(), trainTime);
      var tMinutes;
      var tArrival;
      
      //If the first train is later than the current time, sent arrival to the first train time
      if (maxMoment === trainTime) {
        tArrival = trainTime.format("hh:mm A");
        tMinutes = trainTime.diff(moment(), "minutes");
      } else {

        // Calculate the minutes until arrival using hardcore math
        // To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time
        // and find the modulus between the difference and the frequency.
        var differenceTimes = moment().diff(trainTime, "minutes");
        var tRemainder = differenceTimes % tFrequency;
        tMinutes = tFrequency - tRemainder;
        // To calculate the arrival time, add the tMinutes to the currrent time
        tArrival = moment().add(tMinutes, "m").format("hh:mm A");
      }
        console.log("tMinutes:", tMinutes);
        console.log("tArrival:", tArrival);

        // Add each train's data into the table
        $("#train-table > tbody").append("<tr><td>" + tName + "</td><td>" + tDestination + "</td><td>" +
          tFrequency + "</td><td>" + tArrival + "</td><td>" + tMinutes + "</td></tr>");
      });
