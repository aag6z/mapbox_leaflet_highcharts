// Inject dataset urls onto admin panel
// https://sites.google.com/a/socrata.com/client-services/2-editing-an-open-data-site/adding-dataslate-dataset-url-s-to-the-admin-panel
$(function(){
  if ($("body").hasClass("action_administration_home")) {

    /* Add your customer's dataset urls to this array */
    var datasetIds = [{
      id: '{{{wallpaper_banner}}}',
      name: 'Home Page Wallpaper'
    }, {
      id: '{{{category_tiles}}}',
      name: 'Category Tiles'
    }, {
      id: '{{{featured_stories}}}',
      name: 'Home Page Featured Datasets'
    }];


    var newBox = document.createElement("div");
    $(newBox).addClass("contentBox withLeftNavigation admin-dataset-links");
    var header = $("<h2>DataSlate Content Datasets</h2>");
    var list = document.createElement("ol");
    for (i in datasetIds) {
      var li = document.createElement("li");
      $(li).html("<a href='/d/" + datasetIds[i].id + "' style='font-size:10pt; line-height:1.3em;'>" + datasetIds[i].name + "</a>");
      $(list).append(li);
    }

    $(newBox).append(header);
    $(newBox).append(list);
    $(newBox).insertAfter(".homeManagement");

    // Hide other admin areas
    $('.contentBox:not(.admin-dataset-links):not(.homeManagement):not(.layoutConfig)').hide();
  }
});
