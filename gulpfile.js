var gulp = require('gulp');
var fileinclude = require('gulp-file-include'); //文件包含

gulp.task('default', function () {
	//处理源代码
	gulp.src('src/**')
		.pipe(fileinclude({
			prefix: '//@@',
			basepath: '@file'
		}))
		.pipe(gulp.dest('out/'));

	//处理图片
	gulp.src('images/**')
		.pipe(gulp.dest('out/chrome/images'));
});

gulp.task('watch', function () {
	gulp.watch('src/**', function () {
		gulp.run('default');
	});
})
