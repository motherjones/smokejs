module.exports = function() {
  var dust = require("dustjs-linkedin");
  // asset/asset_image.dust
  (function() {
    dust.register("asset/asset_image", body_0);

    function body_0(chk, ctx) {
      return chk.reference(ctx._get(false, ["keyword"]), ctx, "h").write("<img class=\"asset\" id=\"slug_").reference(ctx._get(false, ["slug"]), ctx, "h").write("\" src=\"").reference(ctx._get(false, ["media_base"]), ctx, "h").reference(ctx._get(false, ["data_url"]), ctx, "h").write("\"></img>");
    }
    return body_0;
  })();
  // asset/asset_image.edit.dust
  (function() {
    dust.register("asset/asset_image.edit", body_0);

    function body_0(chk, ctx) {
      return chk.write("<form><img class=\"asset preview\" id=\"slug_").reference(ctx._get(false, ["slug"]), ctx, "h").write("\" src=\"").reference(ctx._get(false, ["media_base"]), ctx, "h").reference(ctx._get(false, ["data_url"]), ctx, "h").write("\"></img><label for=\"file_upload_").reference(ctx._get(false, ["slug"]), ctx, "h").write("\"><input class=\"editable\" type=\"file\" name=\"file_upload_").reference(ctx._get(false, ["slug"]), ctx, "h").write("\" accept=\"image/*\" /><input type=\"submit\" /></form>");
    }
    return body_0;
  })();
  // asset/asset_text.dust
  (function() {
    dust.register("asset/asset_text", body_0);

    function body_0(chk, ctx) {
      return chk.write("    ").reference(ctx._get(false, ["data"]), ctx, "h", ["s"]);
    }
    return body_0;
  })();
  // asset/asset_text.edit.dust
  (function() {
    dust.register("asset/asset_text.edit", body_0);

    function body_0(chk, ctx) {
      return chk.write("<form><textarea  class=\"editable\" name=\"text_edit_").reference(ctx._get(false, ["slug"]), ctx, "h").write("\">").reference(ctx._get(false, ["data"]), ctx, "h", ["s"]).write("</textarea><input type=\"submit\" /></form>");
    }
    return body_0;
  })();
  // content/full_page.dust
  (function() {
    dust.register("content/full_page", body_0);

    function body_0(chk, ctx) {
      return chk.write("<div class=\"row full_page_content\" id=\"main_content\">").reference(ctx._get(false, ["content"]), ctx, "h").write("</div>");
    }
    return body_0;
  })();
  // content/main_article.dust
  (function() {
    dust.register("content/main_article", body_0);

    function body_0(chk, ctx) {
      return chk.write("<p>slug: ").reference(ctx._get(false, ["slug"]), ctx, "h").write("</p><p> url: ").reference(ctx._get(false, ["resource_uri"]), ctx, "h").write("</p><p>content type:").reference(ctx._get(false, ["spec"]), ctx, "h").write("</p>").section(ctx._get(false, ["attributes", "master"]), ctx, {
        "block": body_1
      }, null).section(ctx._get(false, ["members"]), ctx, {
        "block": body_2
      }, null);
    }

    function body_1(chk, ctx) {
      return chk.write("<div class=\"master\" id=\"asset_").reference(ctx._get(false, ["slug"]), ctx, "h").write("\">").reference(ctx._get(false, ["load_asset"]), ctx, "h").write("</div>");
    }

    function body_2(chk, ctx) {
      return chk.write("<div class=\"asset\" id=\"asset_").reference(ctx._get(false, ["slug"]), ctx, "h").write("\">").reference(ctx._get(false, ["load_asset"]), ctx, "h").write("</div>");
    }
    return body_0;
  })();
  // content/main_article.edit.dust
  (function() {
    dust.register("content/main_article.edit", body_0);

    function body_0(chk, ctx) {
      return chk.write("<form name=\"article\" id=\"content_").reference(ctx._get(false, ["id"]), ctx, "h").write("\"><label for=\"slug\">Slug:</label><input class=\"editable\" name=\"slug\" value=\"").reference(ctx._get(false, ["slug"]), ctx, "h").write("\"></input><formset name=\"metadata\"><label for=\"title\">Title:</label><input class=\"editable\" name=\"metadata.title\" value=\"").reference(ctx._get(false, ["metadata", "title"]), ctx, "h").write("\"></input><label for=\"dek\">Dek:</label><input class=\"editable\" name=\"metadata.dek\" value=\"").reference(ctx._get(false, ["metadata", "dek"]), ctx, "h").write("\"></input></formset><input type=\"submit\"></input></form><form><label for=\"master\">Master Image</label>").section(ctx._get(false, ["attributes", "master"]), ctx, {
        "block": body_1
      }, null).write("<formfield name=\"members\">").section(ctx._get(false, ["members"]), ctx, {
        "block": body_2
      }, null).write("</formfield></form>");
    }

    function body_1(chk, ctx) {
      return chk.reference(ctx._get(false, ["load_asset"]), ctx, "h");
    }

    function body_2(chk, ctx) {
      return chk.write("<label>page ").reference(ctx._get(false, ["order"]), ctx, "h").write(" </label>").reference(ctx._get(false, ["load_asset"]), ctx, "h");
    }
    return body_0;
  })();
  // list/site_nav.dust
  (function() {
    dust.register("list/site_nav", body_0);

    function body_0(chk, ctx) {
      return chk.write("<nav id=\"nav\" class=\"row\"></nav><ul id=\"ticker\" class=\"row\">//ticker goes here</ul>");
    }
    return body_0;
  })();
  // nameplate.dust
  (function() {
    dust.register("nameplate", body_0);

    function body_0(chk, ctx) {
      return chk.write("<a class=\"eight columns\" id=\"site-name\" title=\"Home\" rel=\"home\">Mother Jones</a><div class=\"eight columns\">Ad or subscription or whatever stuff here</div>");
    }
    return body_0;
  })();
  // single_column_layout.dust
  (function() {
    dust.register("single_column_layout", body_0);

    function body_0(chk, ctx) {
      return chk.write("<div id=\"main-content\" class=\"sixteen columns one-column-layout mojo-column-layout\">I am within a full width layout</div>");
    }
    return body_0;
  })();
  // site_structure.dust
  (function() {
    dust.register("site_structure", body_0);

    function body_0(chk, ctx) {
      return chk.write("<div class=\"container\"><header id=\"main-header\"><div id=\"nameplate\" class=\"row\"></div><div id=\"site-nav\"></div></header><div id=\"content\" class=\"row\"><a href=\"#/asset/fakeidgoeshere\">CLICK ME I GO OT FAKEASSETA</a></div><footer id=\"main-footer\" class=\"row\"></footer></div>");
    }
    return body_0;
  })();
  // three_column_layout.dust
  (function() {
    dust.register("three_column_layout", body_0);

    function body_0(chk, ctx) {
      return chk.write("<div id=\"main-content\" class=\"eight columns three-column-layout mojo-column-layout\">left column ihn a three column layouteventually this will be a homepage, but for now,<a href=\"http://localhost:9001/#/article/3\">check this out</a></div><div id=\"middle-column\" class=\"three columns three-column-layout mojo-column-layout\">middle column in a three column layout</div><div id=\"right-column\" class=\"five columns three-column-layout mojo-column-layout\">right column in  athre column layout</div>");
    }
    return body_0;
  })();
  // two_column_layout.dust
  (function() {
    dust.register("two_column_layout", body_0);

    function body_0(chk, ctx) {
      return chk.write("<div id=\"main-content\" class=\"eleven columns two-column-layout mojo-column-layout\">left column in a two column layout</div><div id=\"right-column\" class=\"five columns two-column-layout mojo-column-layout\">right column in a two column layout</div>");
    }
    return body_0;
  })();
  // Returning object for nodejs
  return dust;
};