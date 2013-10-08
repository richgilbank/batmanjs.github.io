
$(function() {
  var response = $.getJSON('/docs/api/search.json');
  response.success( initBindings );
});

var initBindings = function (index) {
  API_SEARCH.init( index );
};





var API_SEARCH = (function() {

  // == | PRIVATE ===============================

  var index = [];
  var query = "";
  var selectedResult = 0;

  var nonSearchKeycodes = [40, 38, 13];

  // keyboard navigation
  var resultSelector = function (e) {
    if (nonSearchKeycodes.indexOf(e.keyCode) < 0) return;

    var $selected = $('#api-search-results .selected');

    if (e.keyCode === 13) {

      window.location = $selected.children('a').eq(0).attr('href');
      $('.api-search-input').val('');
      resetSearch();

    } else {

      var $next = (e.keyCode === 40) ? $selected.next() : $selected.prev();

      if ($next.length) {
        $selected.removeClass('selected');
        $next.addClass('selected');
      }

    }

    return false;
  };

  var resetSearch = function () {
    $('#api-search-results').empty();
    selectedResult = 0;
  };

  var autocomplete = function (e) {
    if (nonSearchKeycodes.indexOf(e.keyCode) >= 0) return;

    query = $(this).val();
    resetSearch();
    if (!query) return;

    var results = index.filter( filterResults ).slice(0, 7);

    results.forEach(function(result) {
      var content = $('<a>')
        .addClass('result-link')
        .attr('href', result.link)
        .html(result.name);

      $('<li>').html(content).appendTo('#api-search-results');
    });

    $('#api-search-results').children().eq(0).addClass('selected');
  };

  var filterResults = function (item) {
    if (item !== null && typeof(item) !== 'undefined' && item.name.indexOf) {
      var indexable = item.name.toLowerCase();
      var searchTerm = query.toLowerCase();

      return indexable.indexOf(searchTerm) >= 0;
    } else {
      return false;
    }
  };


  // == | PUBLIC ===============================

  var init = function (searchIndex) {
    index = searchIndex;
    $('.api-search-input').on('keyup', autocomplete);
    $('.api-search-input').on('keydown', resultSelector);
  };

  return { init: init };

})();
