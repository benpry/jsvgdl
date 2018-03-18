var play_game = function (game_name, desc, level) {
  window.location.href = `/play/${game_name}/level/${level}/desc/${desc}`;
}

$(document).ready(function () {
  $(".game").click(e => {
    play_game(e.target.id, 0, 0);
  })
})