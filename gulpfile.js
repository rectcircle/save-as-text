var gulp = require('gulp');
var fileinclude = require('gulp-file-include');


gulp.task('default', function () {
	// 将你的默认的任务代码放在这
	gulp.src('src/**')
		.pipe(fileinclude({
			prefix: '//@@',
			basepath: '@file'
		}))
		.pipe(gulp.dest('out/'));
});