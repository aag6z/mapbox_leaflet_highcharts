 var gulp = require('gulp');

// Load all Gulp plugins
var autoprefix    = require('gulp-autoprefixer'),
    cache         = require('gulp-cache'),
    concat        = require('gulp-concat'),
    cssimport     = require('gulp-cssimport'),
    debug         = require('gulp-debug'),
    imagemin      = require('gulp-imagemin'),
    insert        = require('gulp-insert'),
    minifyCSS     = require('gulp-minify-css'),
    mustache      = require('gulp-mustache'),
    order         = require('gulp-order'),
    rename        = require('gulp-rename'),
    replace       = require('gulp-replace'),
    sass          = require('gulp-sass'),
    entityconvert = require('gulp-entity-convert');

// other plugins used for localization
var fs = require('fs');
var yaml = require('js-yaml');
var default_locale = 'en';

// Default task
// Then runs tasks concurrently
gulp.task('default', function () {
    // place code for your default task here
    gulp.start('css', 'js', 'misc', 'pages', 'assets', 'strings');
});

// Custom CSS.
// Generates a CSS from Sass (SCSS),
// uses autoprefix to automatically create vendor prefixes for browser-compatibility (see https://github.com/ai/autoprefixer)
// inlines imported CSS from external vendors, (note that this should after auto-prefix because we presume that vendors have already prefixed their CSS)
// then minifies it
gulp.task('css', function () {
  gulp.src('./src/stylesheets/styles.scss')
    .pipe(sass(), { errLogToConsole: true })
    .pipe(autoprefix('last 2 versions', 'Explorer > 8'))
    .pipe(cssimport())
    // .pipe(minifyCSS({ keepSpecialComments: 0 }))
    .pipe(debug({ verbose: false }))
    .pipe(insert.prepend('\n\n\n/*\n *\n *\n *\n * This file was automatically generated from /src by Gulp.\n * Do not edit directly unless Gulp is removed from this repository!\n *\n *\n *\n */\n\n\n\n\n'))
    .pipe(gulp.dest('./css'));
});

// Javascripts
gulp.task('js', function () {
  var dataset_id = yaml.load(fs.readFileSync('./src/partials/dataset_id.yml', 'utf8'));
  // Package Javascripts in a specified order
  gulp.src('./src/js/**/*.js')
    .pipe(mustache(dataset_id))
    .pipe(order([
      'polyfills/**/*.js',
      'libs/**/*.js',
      '*.js'
      ]))
    .pipe(concat('package.js'))
    .pipe(insert.prepend('\n\n\n/*\n *\n *\n *\n * This file was automatically generated from /src by Gulp.\n * Do not edit directly unless Gulp is removed from this repository!\n *\n *\n *\n */\n\n\n\n\n'))
    .pipe(gulp.dest('./js'));
});

// Create headers/footers specific for DataSlate use
gulp.task('misc', function () {
  // do not append two-letter locale to file name for default locale
  var template_name = function(locale) {
    return 'templates_v2b' + ((locale == default_locale) ? '' : '.' + locale);
  };

  // load localization text assets from a YAML file
  var views = yaml.load(fs.readFileSync('./src/partials/views.yml', 'utf8'));
  var locales = Object.keys(views);
  var localization = yaml.load(fs.readFileSync('./src/partials/localize.yml', 'utf8'));

  if (localization) {
    locales.forEach(function(locale) {
      gulp.src('./src/partials/socrata/site-footer.html')
        .pipe(mustache(views[locale]))
        .pipe(entityconvert())
        .pipe(rename({
          basename: template_name(locale),
          extname: '.footer'
        }))
        .pipe(gulp.dest('./config'))
        .pipe(rename({
          extname: '.footer_full'
        }))
        .pipe(gulp.dest('./config'));
      gulp.src('./src/partials/socrata/site-header_localized.html')
        .pipe(mustache(views[locale]))
        .pipe(entityconvert())
        .pipe(rename({
          basename: template_name(locale),
          extname: '.header'
        }))
        .pipe(gulp.dest('./config'))
        .pipe(rename({
          extname: '.header_full'
        }))
        .pipe(gulp.dest('./config'));
    });
  } else {
    gulp.src('./src/partials/socrata/site-footer.html')
      .pipe(mustache(views['en']))
      .pipe(entityconvert())
      .pipe(rename({
        basename: 'templates_v2b',
        extname: '.footer'
      }))
      .pipe(gulp.dest('./config'))
      .pipe(rename({
        extname: '.footer_full'
      }))
      .pipe(gulp.dest('./config'));
    gulp.src('./src/partials/socrata/site-header.html')
      .pipe(mustache(views['en']))
      .pipe(entityconvert())
      .pipe(rename({
        basename: 'templates_v2b',
        extname: '.header'
      }))
      .pipe(gulp.dest('./config'))
      .pipe(rename({
        extname: '.header_full'
      }))
      .pipe(gulp.dest('./config'));
  }
});

// Create pages specific for DataSlate use
gulp.task('pages', function () {
  // load localization text assets from a YAML file
  var dataset_id = yaml.load(fs.readFileSync('./src/partials/dataset_id.yml', 'utf8'));
  var localization = yaml.load(fs.readFileSync('./src/partials/localize.yml', 'utf8'));
  var file_location = './src/partials/pages/index.yml';
  if (localization) {
    file_location = './src/partials/pages/index_localized.yml';
  }
  gulp.src(file_location)
    .pipe(mustache(dataset_id))
    .pipe(rename({
      basename: 'index',
      extname: '.yml'
    }))
    .pipe(gulp.dest('./pages'));
});

// Assets
gulp.task('assets', function () {
  gulp.src('./src/assets/**/*')
    .pipe(cache(imagemin({
      progressive: true // JPG only
    })))
    .pipe(gulp.dest('./assets'))
  // ischanged?
  // if image: imagemin
  // upload to Dataslate Assets
  // Respond with JSON string with Asset ID
  // replace inside templates/partials that
});

// Create string assets
gulp.task('strings', function () {
  // do not append two-letter locale to file name for default locale
  var template_name = function(locale) {
    return 'strings' + ((locale == default_locale) ? '' : '.' + locale);
  };

  // load localization text assets from a YAML file
  var strings = yaml.load(fs.readFileSync('./src/partials/strings.yml', 'utf8'));
  var locales = Object.keys(strings);

  locales.forEach(function(locale) {
    var assets = Object.keys(strings[locale]);
    assets.forEach(function(asset) {
      gulp.src('./src/partials/strings.txt')
        .pipe(mustache({text: strings[locale][asset]}))
        // skip entityConvert because DataSlate double-encodes &#000; characters for strings.* props,
        // however BitBucket will still throw an error (as of 7/24) so they must be manually updated in /internal
        //.pipe(entityconvert())
        .pipe(rename({
          basename: template_name(locale),
          extname: '.' + asset
        }))
        .pipe(gulp.dest('./config'));
    });
  });
});

gulp.task('dashboards', function () {
  var dataset_id = yaml.load(fs.readFileSync('./src/partials/dataset_id.yml', 'utf8'));
  var dashboards_config = yaml.load(fs.readFileSync('./src/partials/dashboards_config.yml', 'utf8'));
  var dashboards = Object.keys(dashboards_config);
  var file_location = './src/partials/pages/dashboards.yml';

  dashboards.forEach(function(dashboard) {
    var dashboard_config = dashboards_config[dashboard];
    gulp.src(file_location)
      .pipe(mustache(dashboard_config))
      .pipe(rename({
        basename: dashboard_config.url,
        extname: '.yml'
      }))
      .pipe(gulp.dest('./pages/dashboards'));
  });
});