var current_game_obj = {}

var get_game = function (game_name, callback) {
  $.ajax({
    type: "GET",
    url: `/edit/${game_name}`,
    success: callback,
  });
}

var delete_game = function (game_name, callback) {
  $.ajax({
    type: "DELETE",
    url: `/edit/${game_name}`,
    success: callback,
  });
}

var save_game = function (game_obj, callback) {
    $.ajax({
    type: "PUT",
    url: `/edit/${game_obj.name}`,
    data: current_game_obj,
    success: callback,
  });  
}

var add_game = function (game_obj, callback) {
    $.ajax({
    type: "POST",
    url: `/edit/${game_obj.name}`,
    data: game_obj,
    success: callback,
  });  
}
var update_text_areas = function (game_text, level_text) {
  $('#game_area').val(game_text);
  $('#level_area').val(level_text);
}

var update_nav_bar = function (game_name) {
  $('.side-bar ul li').each(function () {
    $(this).removeClass('active');
  })
  $('#new').remove();
  $('.side-bar ul').append(`<li class="game active" id="${game_name}">${game_name}</li><li id="new">Create New Game</li>`)
}

var update_game_obj = function (game_obj) {
  current_game_obj = game_obj;
  update_text_areas(current_game_obj.game, current_game_obj.levels[0])
}

$(document).ready(function () {

  var create_modal = $('#create_modal')[0];
  console.log(create_modal)

  $('.textbox').keydown(function(e) {
    var keyCode = e.keyCode || e.which;

    // 9 is tab key, presumably. 
    if (keyCode == 9) {
      e.preventDefault();
      var start = $(this).get(0).selectionStart;
      var end = $(this).get(0).selectionEnd;

      // set textarea value to: text before caret + tab + text after caret
      $(this).val($(this).val().substring(0, start)
                  + "\t"
                  + $(this).val().substring(end));

      // put caret at right position again
      $(this).get(0).selectionStart =
      $(this).get(0).selectionEnd = start + 1;
    } 
  });


  $('.game').click(function (e) {
    $('.side-bar ul li').each(function () {
      $(this).removeClass('active');
    })
    $(this).addClass('active');
    var game_name = $(this).attr('id')
    get_game(game_name, update_game_obj)
  })

  $('#cancel').click(e => {
    create_modal.style.display = 'none';
  })

  $('#create').click(e => {
    var name = $('input').val();
    if (name) {
      new_game_obj = {name: name, game: '', levels: [''], level: 0}
      add_game(new_game_obj, function () {
        console.log('added game')
      })
      update_game_obj(new_game_obj);
      update_nav_bar(name);
      create_modal.style.display = 'none';
    }
  })

  $('#new').click(function (e) {
    create_modal.style.display = 'block';
  })

  // fix this code
  $('#play').click(function (e) {
    if (current_game_obj.name) {
      current_game_obj.game = $('#game_area').val();
      current_game_obj.levels[current_game_obj.level] = $('#level_area').val();
      save_game(current_game_obj, function (success) {
        if (success.success) {
          window.location.replace(`/play/${current_game_obj.name}`);
        }
      })
    }
  })

  $('#save').click(function (e) {
    console.log(`save pressed: ${current_game_obj.name}`)
    if (current_game_obj.name) {
      current_game_obj.game = $('#game_area').val();
      current_game_obj.levels[current_game_obj.level] = $('#level_area').val();
      save_game(current_game_obj, function (success) {
        if (success.success) {

        } else {
          console.log('error saving')
        }
      })
    }
  })

  $('#delete').click(e => {
    if (current_game_obj.name) {
      delete_game(current_game_obj.name, function () {})
      $(`#${current_game_obj.name}`).remove();
    }
  })

  $('#experiments').click(function (e) {
    window.location.replace('/experiments');
  })

  $('#home').click(function (e) {
    window.location.replace('/');
  })

})