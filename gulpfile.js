"use strict";

var _ = require("underscore");
var browserify = require("browserify");
var buffer = require("vinyl-buffer");
var cache = require("gulp-cached");
var exec = require("child_process").exec;
var gulp = require("gulp");
var gulpif = require("gulp-if");
var gutil = require("gulp-util");
var jest = false;
try {
    jest = require("gulp-jest");
} catch(e) {
    gutil.log(gutil.colors.yellow("Jest not found. Disabling test tasks"));
}
var jshint = require("gulp-jshint");
var less = require("gulp-less");
var merge = require("merge-stream");
var path = require("path");
var phplint = require("phplint").lint;
var Promise = require("es6-promise").Promise;
var reactify = require("reactify");
var source = require("vinyl-source-stream");
var uglify = require("gulp-uglify");
var watchify = require("watchify");
var argv = require('yargs').argv;

var isProduction = (process.env.NODE_ENV === "production");
gutil.log("Environment set to", gutil.colors.magenta(isProduction ? "PRODUCTION" : "DEVELOPMENT"));

var productionApp = "fabule-bom";
var stagingApp = "staging-fabule-bom";

var destination = "./module/Application/assets/";
var sourceDir = "webapp/src";

var jsDest = path.join(destination, "js");
var jsSources = path.join(sourceDir, "js/**/*.@(js|jsx)");

var lessDest = path.join(destination, "css");
var lessSources = path.join(sourceDir, "less/**/*.less");

var fontDest = path.join(destination, "fonts");
var fontSources = path.join(sourceDir, "fonts/*");

var flashDest = path.join(destination, "flash");

var external = [
    "babyparse",
    "backbone",
    "backbone.cocktail",
    "backbone-react-component",
    "backbone-validation",
    "bootstrap",
    "es5-shim",
    "es6-promise",
    "filesize",
    "flux",
    "jquery",
    "jquery-mousewheel",
    "jquery-nicescroll",
    "keymirror",
    "md5",
    "moment",
    "mousetrap",
    "react",
    "react-bootstrap",
    "react-router",
    "react-toggle",
    "react-tools",
    "underscore",
    "underscore.inflection",
    "underscore.string",
    "validator",
    "zeroclipboard"
];

function processSource(b, name) {
  return b.bundle()
    .on("error", swallowError)
    .pipe(source(name))
    .pipe(buffer())
    .pipe(gulpif(isProduction, uglify()))
    .on("error", swallowError)
    .pipe(gulp.dest(jsDest));
}

function buildJS(file) {
    // set up the browserify instance on a task basis
    var opts = {
        entries: "./" + sourceDir + "/js/" + file,
        debug: isProduction,
        paths: ["./node_modules", "./webapp/src/js"],
        transform: [reactify]
    };

    var b = browserify(opts);

    external.forEach(function (dep) {
        b.external(dep);
    });

    return processSource(b, file);
}

function watchJS(file) {
    // set up the browserify instance on a task basis
    var opts = _.extend({}, watchify.args, {
        entries: "./" + sourceDir + "/js/" + file,
        debug: isProduction,
        paths: ["./node_modules", "./webapp/src/js"],
        transform: [reactify]
    });

    var b = watchify(browserify(opts));

    external.forEach(function (dep) {
        b.external(dep);
    });

    return processSource(b, file);
}

function captureHerokuBackup(app) {
    return new Promise(function(resolve, reject) {
        // Backup the production DB
        exec("heroku pg:backups capture --app "+app, function(err, stdout/*, stderr*/) {
            var regex;
            var result;

            if (err) { return reject(err); }

            regex = /---backup--->\s(b\d{3})/ig;
            result = regex.exec(stdout);
            if (!result || !result[1]) {
                return reject(new Error("Failed to find backup id"));
            }

            // TODO check if the backup failed

            gutil.log("Capture "+app+" DB backup:", gutil.colors.magenta(result[1]));
            resolve(result[1]);
        });
    });
}

function getHerokuBackupUrl(app, backupId) {
    return new Promise(function(resolve, reject) {
        exec("heroku pg:backups public-url "+backupId+" --app "+app, function(err, stdout/*, stderr*/) {
            var backupUrl;

            if (err) { return reject(err); }

            backupUrl = stdout.replace(/^\s+|\s+$/gm,"");
            if (!backupUrl || !backupUrl[1]) {
                return reject(new Error("Failed to get backup url"));
            }

            gutil.log("Generate backup S3 url:", gutil.colors.magenta(backupUrl));
            resolve(backupUrl);
        });
    });
}

function resetHerokuDb(app) {
    return new Promise(function(resolve, reject) {
        exec("heroku pg:reset DATABASE_URL --confirm "+app+" --app "+app, function(err/*, stdout, stderr*/) {
            if (err) { return reject(err); }

            gutil.log("Reset staging DB:", gutil.colors.magenta("OK"));
            resolve();
        });
    });
}

function restoreHerokuDb(app, url) {
    return new Promise(function(resolve, reject) {
        exec("heroku pg:backups restore \""+url+"\" DATABASE_URL --confirm "+app+" --app "+app, function(err/*, stdout, stderr*/) {
            if (err) { return reject(err); }

            gutil.log("Restore backup into staging DB:", gutil.colors.magenta("OK"));
            resolve();
        });
    });
}

function updateOAuthClient(app) {
    var oauthClientSql = "UPDATE oauth_clients " +
      "SET redirect_uri = 'https://"+app+".herokuapp.com' " +
      "WHERE client_id = 'fabule';";

    return new Promise(function(resolve, reject) {
        exec("echo "+ oauthClientSql +" | heroku pg:psql --app "+app, function(err/*, stdout, stderr*/) {
            if (err) { return reject(err); }

            gutil.log("Update test oauth client of staging app:", gutil.colors.magenta("OK"));
            resolve();
        });
    });
}

function migrateHerokuDbAndClearCache(app) {
    return new Promise(function(resolve, reject) {
        exec("heroku run --exit-code \"composer run migrate-db && composer run clear-doctrine-cache\" --app "+app, function(err/*, stdout, stderr*/) {
            if (err) { return reject(err); }

            gutil.log("Migrate staging DB and clear doctrine cache:", gutil.colors.magenta("OK"));
            resolve();
        });
    });
}

function verifyActiveBranch(branch) {
    return new Promise(function(resolve, reject) {
        // Get the active branch
        exec("git rev-parse --abbrev-ref HEAD", function(err, stdout/*, stderr*/) {
            var activeBranch;

            if (err) { return reject(err); }

            activeBranch = stdout.replace(/^\s+|\s+$/gm,"");
            if (activeBranch !== branch) {
                return reject(new Error("Active branch MUST be \""+branch+"\""));
            }

            resolve();
        });
    });
}

function setHerokuMaintenance(app, enable) {
    return new Promise(function(resolve, reject) {
        exec("heroku maintenance:"+(enable?"on":"off")+" --app "+app, function(err/*, stdout, stderr*/) {
            if (err) { return reject(err); }

            gutil.log("Maintenance mode:", gutil.colors.magenta((enable?"ON":"OFF")));
            resolve();
        });
    });
}

function scaleDyno(app, dyno) {
    return new Promise(function(resolve, reject) {
        exec("heroku ps:scale " + dyno + " --app "+app, function(err/*, stdout, stderr*/) {
            if (err) { return reject(err); }

            gutil.log("Scale dyno:", gutil.colors.magenta(dyno));
            resolve();
        });
    });
}

function pushBranchToHeroku(branch, remote) {
    return new Promise(function(resolve, reject) {
        exec("git push "+remote+" master", function(err/*, stdout, stderr*/) {
            if (err) { return reject(err); }

            gutil.log("Push \""+branch+"\" branch to \""+remote+"\" remote:", gutil.colors.magenta("OK"));
            resolve();
        });
    });
}

function stage(stagingApp, productionApp) {
    gutil.log("Staging:", gutil.colors.magenta(productionApp+" --> "+stagingApp));

    return captureHerokuBackup(productionApp).then(function(backupId) {
        return getHerokuBackupUrl(productionApp, backupId);
    }).then(function(backupUrl) {
        return resetHerokuDb(stagingApp).then(function() {
            return restoreHerokuDb(stagingApp, backupUrl);
        });
    }).then(function() {
        return updateOAuthClient(stagingApp);
    }).then(function() {
        return migrateHerokuDbAndClearCache(stagingApp);
    });
}

function deploy(branch, remote, app) {
    gutil.log("About to deploy:", gutil.colors.magenta(branch+" --> "+remote+" ("+app+")"));

    // TODO check that remote exists
    return verifyActiveBranch(branch).then(function() {
        return captureHerokuBackup(app);
     }).then(function() {
        return setHerokuMaintenance(app, true);
     }).then(function() {
        return scaleDyno(app, "worker=0");
     }).then(function() {
        return pushBranchToHeroku(branch, remote);
    }).then(function() {
        return migrateHerokuDbAndClearCache(app);
     }).then(function() {
        return scaleDyno(app, "worker=1");
     }).then(function() {
        return setHerokuMaintenance(app, false);
    });
}

function swallowError (error) {
    gutil.log(gutil.colors.red(error.toString()));
    this.emit('end');
}

/*
 Runnable tasks
 */
gulp.task("default", [
  "build-vendors",
  "build-js",
  "lint",
  "less",
  "fonts",
  "flash"]);

gulp.task("build-vendors", function () {
  // set up the browserify instance on a task basis
  var opts = {
    debug: isProduction
  };
  var b = browserify(opts);

  external.forEach(function (dep) {
    b.require(dep);
  });

  return processSource(b, "vendors.js");
});

gulp.task("build-js", function () {
    return merge(
        buildJS("bom.js"),
        buildJS("invite.js")
    );
});

gulp.task("watch-js", function () {
    return merge(
        watchJS("bom.js"),
        watchJS("invite.js")
    );
});

gulp.task("lint", function() {
  return gulp.src(jsSources)
    .pipe(cache("lint"))
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish"));
});

gulp.task("lint-php", function (cb) {
  phplint(["module/**/*.php"], {
        limit: 10
    },
    function (error) {
        if(error) {
            gutil.log(gutil.colors.red(error.toString()));
        }
        cb();
    });
});

gulp.task("less", function () {
  return gulp.src("webapp/src/less/@(bom|auth).less")
    .pipe(less())
    .pipe(gulp.dest(lessDest));
});

gulp.task("fonts", function () {
  return gulp.src(fontSources)
    .pipe(gulp.dest(fontDest));
});

gulp.task("flash", function () {
  return gulp.src("node_modules/zeroclipboard/dist/ZeroClipboard.swf") // Hack for now because we need the swf for ZeroClipboard
    .pipe(gulp.dest(flashDest));
});

gulp.task("watch", ["default"], function() {
    var jsTasks = ["lint", "watch-js"];
    if(jest && !argv.notest) {
        jsTasks.push("test");
    }

    gulp.watch(jsSources, jsTasks);
    gulp.watch(lessSources, ["less"]);
    gulp.watch(fontSources, ["fonts"]);
});

gulp.task("stage", function(done) {
    stage(stagingApp, productionApp).then(function() {
        return done();
    }, function(error) {
        return done(error);
    });
});

gulp.task("deploy", function(done) {
    var branch = "master";
    var remote = "heroku-prod";
    var app = productionApp;

    deploy(branch, remote, app).then(function() {
        return done();
    }, function(error) {
        return done(error);
    });
});

if(jest) {
    //Force the node path for Jest to properly use require
    process.env.NODE_PATH = "webapp/src/js" + path.delimiter + "node_modules" + path.delimiter + process.env.NODE_PATH;

    gulp.task("test", function () {
        return gulp
            .src(".")
            .pipe(jest({
                scriptPreprocessor: "./webapp/src/js/preprocessor.js",
                unmockedModulePathPatterns: [
                    "backbone",
                    "es6-promise",
                    "jquery",
                    "jquery-mockjax",
                    "keymirror",
                    "react",
                    "react-bootstrap",
                    "react-router",
                    "underscore",
                    "backbone.cocktail"
                ],
                collectCoverage: false,
                testFileExtensions: [
                    "js",
                    "jsx"
                ],
                testPathDirs: ["webapp/src/js"]
            }))
            .on("error", swallowError);
    });
}
