(function ($) {
  // Optimize mobile scaling
  $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">');

  // Do not cache page
  $('head').append('<meta http-equiv="cache-control" content="max-age=0"><meta http-equiv="cache-control" content="no-cache"><meta http-equiv="expires" content="0"><meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT"><meta http-equiv="pragma" content="no-cache">');

  // Font-Awesome 4.1.0
  $('head').append('<link href="//maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet">');

  // Responsive header toggle
  $('.header-toggle').click(function () {
    if ($('.header-links').is(':visible')) {
      // Hide the links and show toggle
      $('.header-links').slideUp(200, function () {
        $(this).removeClass('toggle-links');
        $(this).attr('style', ''); // Resets the display:none that jQuery sets
      });
      $('.header-toggle').removeClass('toggle-highlight');
    } else {
      // Show the links
      $('.header-links').addClass('toggle-links').slideDown(200);
      $('.header-toggle').addClass('toggle-highlight');
    }
  });

  // Display additional descriptive information for each category on hover
  $('#category-tiles .tile').mouseover(function () {
    $(this).find('.tile-description').show();
    $(this).find('.tile-label').hide();
  }).mouseleave(function () {
    $(this).find('.tile-description').hide();
    $(this).find('.tile-label').show();
  });

  // Autofocus searchbar container
  // Only do this on the home page, which is why we don't use the HTML5 autofocus attribute
  if (document.querySelector('body.home')) {
    document.getElementById('search-input').focus();
  }

}(jQuery));