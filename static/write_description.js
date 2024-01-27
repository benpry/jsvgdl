var post_message = function (exp_id, message, callback) {
  callback();
  // $.ajax({
  //   type: "POST",
  //   url: `/experiment/` + exp_id + "/message",
  //   data: {
  //     message: message,
  //   },
  //   success: function (status) {
  //     if (status.success) {
  //       console.log("Message sent to DB");
  //       callback();
  //     }
  //   },
  //   error: function (request, status, error) {
  //     console.log(error);
  //   },
  // });
};

var next_experiment = function (exp_id, callback) {
  console.log(exp_id);
  if (exp_id == "0") {
    callback();
    return;
  }
  $.ajax({
    type: "POST",
    url: "/experiment/" + exp_id + "/next",
    data: { state: "write_description" },
    success: function (status) {
      if (status.success) {
        callback();
      }
    },
  });
};

var update_state = function (exp_id) {
  // $.ajax({
  //   // UPDATE STATE (Continue to play)
  //   type: "POST",
  //   url: `/${condition}_experiment/` + exp_id + "/update_state",
  //   data: {
  //     state: "create_transmission",
  //   },
  //   success: function (status) {
  //     if (status.success) {
  //       Enable the button and reload the page
  //       $("#continue").attr("disabled", false);
  //       window.location.href = `/${condition}_experiment/${exp_id}`;
  //     }
  //   },
  //   error: function (request, status, error) {
  //     console.log(error);
  //   },
  // });

  $("#continue").attr("disabled", false);
  window.location.href = `/experiment/${exp_id}`;
};

var gamejs = require("gamejs");
var vgdl_parser = VGDLParser(gamejs);
var game = vgdl_parser.playGame(vgdl_game.game, vgdl_game.level, color_scheme);
game.paused = true;
game.ended = true;
gamejs.ready(game.run(() => {}));

$(document).ready(function () {
  $("#textbox").focus();

  $("#continue").click(function () {
    console.log("continue_clicked");

    // Get the text value and clear the textbox
    var message = $("#textbox").val();

    var confirmation_message =
      "Are you sure that you want to use this message as your description?\n\n" +
      message;

    // Don't let them submit an empty message
    if (message !== "") {
      if (confirm(confirmation_message)) {
        // Disable the button to prevent multiple submits
        $("#continue").attr("disabled", true);

        $("#textbox").val("");
        // Post message and update the state iff the message post was successful
        post_message(exp_id, message, function () {
          next_experiment(exp_id, function () {
            location.reload();
          });
        });
      }
    } else {
      // Change the placeholder text (make sure they write a message)
      $("#textbox").attr("placeholder", "You need to write a message here!");
    }
  });
});
