

module.exports = function(grunt) {
     "use strict"; //To pass jshint specifications
  // Project configuration. One property per task
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"), //Load the contents of package.json file into
                                              //Gruntfile.js to give access to project details
                                              //such as name, version, description,...
   
    closurecompiler: {

       minify: {
            files: {
                // Carpeta o archivo de destino: Carpeta o archivo de origen
               "dist/js/perfmatters.min.js": ["src/js/*.js"],
               "dist/views/js/main.min.js":["src/views/js/*.js"]
            },

            options: {
                // Any options supported by Closure Compiler, for example:
                "compilation_level": "SIMPLE_OPTIMIZATIONS",

                // Plus a simultaneous processes limit
                "max_processes": 5,

                // And an option to add a banner, license or similar on top
                "banner": '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                
            }
        }
    },

     cssmin: {

      target: {

        files: [{
         expand: true,
         cwd: "src/css",
         src: ["*.css"],
         dest: "dist/css",
         ext: ".min.css"

        }]
      }

     },

     htmlmin: {
      dist: {

        options: {

          removeComments: true,
          collapseWhitespace: true
        },

      files: {

          "dist/views/pizza.html": "src/views/pizza.html",
          "dist/index.html": "src/index.html",
          "dist/project-2048.html": "src/project-2048.html",
          "dist/project-mobile.html": "src/project-mobile.html",
          "dist/project-webperf.html": "src/project-webperf.html"

          }

  
        }

     }

    
  });

  // Load the plugin that provides the tasks.
   grunt.loadNpmTasks("grunt-closurecompiler");
   grunt.loadNpmTasks("grunt-contrib-cssmin");
   grunt.loadNpmTasks("grunt-contrib-htmlmin");




  // Default task(s) in form of Array
  grunt.registerTask("default", ["closurecompiler:minify", "cssmin", "htmlmin"]);

  };

