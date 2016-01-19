/**
 * detect the current path and modify the locale switch links
 * so that users are not always kicked back to the home page
 */
(function($) {
  $(function() {

    // strip the leading slash and locale path from the current path
    // modify regex based on locales that are available on the site
    var path = window.location.pathname.replace(/^\/((en|es)\/)?/, '');
    // adjust when localized home page was retrieved without the trailing slash
    path = path.replace(/^(en|es)$/, '');

    // check for query string
    var queryString = '';
    var pos = window.location.href.indexOf('?');
    if (pos > 0) {
      queryString = window.location.href.substring(pos);
    }

    // append path to switch locale link href
    $('a.switch-locale').each(function() {
      $(this).attr('href', $(this).attr('href') + path + queryString);
    });

  });
})(jQuery);
