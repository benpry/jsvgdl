var current_game_obj = {}

var get_game = function (game_name, callback) {
  $.ajax({
    type: "GET",
    url: `/edit/${game_name}`,
    success: callback,
  });
}

var delete_game = function (game_name, callback) {
  console.log(game_name);
  if (!(game_name)) {
    callback({success: false});
    return;
  }
  $.ajax({
    type: "DELETE",
    url: `/edit/${game_name}`,
    success: callback,
  });
}

var save_game = function (game_obj, callback) {
    if (!(game_obj.name)) {
      callback({success: false});
      return;
    }
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
var update_text_areas = function () {
  console.log(current_game_obj)
  $('#game_area').val(current_game_obj.game);
  $('#level_area').val(current_game_obj.levels[current_game_obj.level]);
  $('textarea').each(function () {
    $(this).attr('readonly', false);
  })
}

var update_nav_bar = function (game_name) {
  $('.side-bar ul li').each(function () {
    $(this).removeClass('active');
  })
  $('#new').remove();
  $('.side-bar ul').append(`<li class="game active" id="${game_name}">${game_name}</li><li id="new">+</li>`)
}

var update_game_obj = function (game_obj) {
  $('.level').remove()
  $('#add-level').remove()
  current_game_obj = game_obj;
  var i = 0;
  current_game_obj.levels.forEach(level => {
    $('#nav').append(`<li class="level button" id=${i}>${i}</li>`)
    i ++;
  })
  $('#nav').append('<li class="button" id="add-level">+</li>')
  $('#0').addClass('active');
  update_text_areas()
}

$(document).on("click", '.game',function() {
  $('.side-bar ul li').each(function () {
    $(this).removeClass('active');
  })
  $(this).addClass('active');
  var game_name = $(this).attr('id')
  $('textarea').each(function () {
    $(this).attr('readonly', true);
  })
  $('#game_area').val('loading...');
  $('#level_area').val('loading...');
  current_game_obj = {};
  get_game(game_name, update_game_obj)
})

$(document).on("click", '.level',function() {
  $('.level').each(function () {
    $(this).removeClass('active');
  })
  $(this).addClass('active');
  current_game_obj.level = parseInt($(this).attr('id'));
  update_text_areas();

  // var game_name = $(this).attr('id')
  // get_game(game_name, update_game_obj)
})

$(document).on("click", '#add-level',function() {
  $('.level').each(function () {
    $(this).removeClass('active');
  })
  current_game_obj.levels.push(['']);
  $('#add-level').remove();
  var new_level = current_game_obj.levels.length-1
  current_game_obj.level = new_level;
  $('#nav').append(`<li class="level active button" id=${new_level}>${new_level}</li><li class="button" id="add-level">+</li>`)
  update_text_areas();

  // var game_name = $(this).attr('id')
  // get_game(game_name, update_game_obj)
})

  $(document).on('click', '#new', function (e) {
    create_modal.style.display = 'block';
  })

$(document).ready(function () {

  $('#game_area').val('');
  $('#level_area').val('');

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

  $('#name-input').change(e => {
    console.log('updating');
  })

  $('#cancel').click(e => {
    create_modal.style.display = 'none';
  })

  $('#create').click(e => {
    $('.warning').remove()
    var name = $('input').val();
    var regexp = /^[a-zA-Z0-9-_]+$/
    if (name.search(regexp) != -1) {
      new_game_obj = {name: name, game: '', levels: [''], level: 0}
      add_game(new_game_obj, function (response) {
        if (response.success) {
          update_game_obj(new_game_obj);
          update_nav_bar(name);
          create_modal.style.display = 'none';
        } else {
          $('#modal-content').append('<p class="warning">Name already taken</p>')
        }
      })
    } else {
      $('#modal-content').append('<p class="warning">Invalid name</p>')
    }
  })



  // fix this code
  $('#play').click(function (e) {
    if (current_game_obj.name) {
      current_game_obj.game = $('#game_area').val();
      current_game_obj.levels[current_game_obj.level] = $('#level_area').val();
      save_game(current_game_obj, function (success) {
        if (success.success) {
          window.location.href = `/play/${current_game_obj.name}/level/${current_game_obj.level}`;
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
      console.log('deleting game');
      delete_game(current_game_obj.name, function () {
         $(`#${current_game_obj.name}`).remove();
         current_game_obj = {};
      })
     
    }
  })

  $('#experiments').click(function (e) {
    window.location.href = '/experiments';
  })

  $('#images').click(function (e) {
    window.location.href = '/images';
  })

  $('#home').click(function (e) {
    window.location.href = '/';
  })

})