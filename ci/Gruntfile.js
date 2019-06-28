module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
    	project_name: '<%= pkg.name.replace(/-/g, "_") %>',
    	archive_name: '<%= pkg.name%>-<%= pkg.version %>.zip',
		artifact_name: 'current.zip',		// `current.zip` by default. (optional)
		release: {
	    	options: {
		        commit: false,
		        tag: false,
		        push: false,
		        pushTags: false,
		        npm: false,
			    additionalFiles: ['../package.json']
		      }
	    },
		redmart_builder: {
			options: {
				archivePath: '../',	// path to your `archive` file (optional)
				triggerChef: false,
				// clean: { },		// if anything needs to be cleaned before compression
				compress: {
					main1: {
						options: {
							archive: '../<%= archive_name %>'
						},
						files: [
              {src: ['**'], cwd: '../dist/', dest: '/', expand: true}
						]
					},
					main2: {
						options: {
							archive: '../<%= artifact_name %>'
						},
						files: [
              {src: ['**'], cwd: '../dist/', dest: '/', expand: true}
						]
					}
				}

			}
		}
	});

	grunt.loadNpmTasks('semvar-ghflow-grunt-redmart-builder');
  	grunt.loadNpmTasks('grunt-release');
	grunt.registerTask('default', 'redmart_builder');
};
