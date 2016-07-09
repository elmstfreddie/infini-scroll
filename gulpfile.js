var gulp = require("gulp");
var ts = require("gulp-typescript");
var merge = require('merge2');

var tsProject = ts.createProject({
    declaration: true,

});

gulp.task("watch", function() {
    gulp.watch("src/**/*.ts", ["scripts"]);
});

gulp.task("scripts", function() {
    var tsResult = gulp.src("src/**/*.ts")
        .pipe(ts(tsProject));

    return merge([ 
        tsResult.dts.pipe(gulp.dest("build/definitions")),
        tsResult.js.pipe(gulp.dest("build/js"))
    ]);
});