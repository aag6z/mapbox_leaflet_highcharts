(function($) {
  $(function() {
    if ($('body').hasClass('home')) {
      $('.featured-tiles .tile a').each(function(i, link) {
        var $link = $(link);
        var href = $link.attr('href');
        // regex to test if string starts with /ca, /es, or /en
        // change this depending on your locales if needed
        var rx = /^\/((ca|es|en))/;
        if (rx.test(href)) {
          // We're in a locale, continue.
          // Locale paths make up the first 3 characters, e.g. "/en"
          var locale = href.substring(0, 3);
          var realhref = href.substring(3, href.length);
          var domain = "https://" + blist.configuration.env.domain;
          if (realhref.startsWith(domain)) {
            // This should be a relative link but someone done fucked up.
            // Create the new relative link by adding the locale to the path
            $link.attr('href', locale + realhref.substring(domain.length, realhref.length));
          } else if (!realhref.startsWith('/')) {
            // This isn't a relative link, so we just need to replace it without the locale.
            $link.attr('href', realhref);
          }
        };
      });
    }
  });
})(jQuery);