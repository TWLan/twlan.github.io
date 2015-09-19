var twlanWWW = angular.module('twlanWWW', []);

twlanWWW.controller('MainController', function ($sce, $scope, $window, langService) {
    $scope.version = '2.A3-r589';
    $scope.links = {};
    $scope.links.win32 = [
        {text: '32bit', files: [
            {name: '.7z', link: 'https://github.com/TWLan/twlan.github.io/releases/download/2.A3/TWLan-2.A3-win32.7z'}, 
            {name: '.zip', link: 'https://github.com/TWLan/twlan.github.io/releases/download/2.A3/TWLan-2.A3-win32.zip'}
        ]}
    ];
    $scope.links.linux = [
        {text: '32bit', files: [
            {name: '.tar.xz', link: 'https://github.com/TWLan/twlan.github.io/releases/download/2.A3/TWLan-2.A3-linux32.tar.xz'}, 
            {name: '.zip', link: 'https://github.com/TWLan/twlan.github.io/releases/download/2.A3/TWLan-2.A3-linux32.zip'}
        ]},
        {text: '64bit', files: [
            {name: '.tar.xz', link: 'https://github.com/TWLan/twlan.github.io/releases/download/2.A3/TWLan-2.A3-linux64.tar.xz'}, 
            {name: '.zip', link: 'https://github.com/TWLan/twlan.github.io/releases/download/2.A3/TWLan-2.A3-linux64.zip'}
        ]}
    ];
    $scope.links.mac   = [
        {text: '32bit', files: [
            {name: '.tar.xz', link: 'https://github.com/TWLan/twlan.github.io/releases/download/2.A3/TWLan-2.A3-mac32.tar.xz'}, 
            {name: '.zip', link: 'https://github.com/TWLan/twlan.github.io/releases/download/2.A3/TWLan-2.A3-mac32.zip'}
        ]},
        {text: '64bit', files: [
            {name: '.tar.xz', link: 'https://github.com/TWLan/twlan.github.io/releases/download/2.A3/TWLan-2.A3-mac64.tar.xz'}, 
            {name: '.zip', link: 'https://github.com/TWLan/twlan.github.io/releases/download/2.A3/TWLan-2.A3-mac64.zip'}
        ]}
    ];

    $scope.langService = langService;

    $scope.changeLang = function () {
        var l = langService.currentLang;
        if (!langService.lang.hasOwnProperty(l)) langService.load(l);
    };

    $scope.entry = function (k) {
        return $sce.trustAsHtml($scope.langService.get(k));
    };
});

twlanWWW.service('langService', function ($rootScope, $http) {
    this.lang = {};
    this.languages = {'de': 'Deutsch', 'en': 'English'};

    this.currentLang = null;
    this.load = function (lang) {
        var srv = this;
        var resourcePath = 'lang/' + lang + '.js';
        $http.get(resourcePath)
            .success(function(data) {
                srv.lang[lang] = data;
                srv.currentLang = lang;
                document.title = srv.get("title");
            });
    }
    
    this.get = function (k) {
        var langDict = this.lang[this.currentLang];
        if (!langDict) return "";
        if (k.indexOf("::") > -1)
        {
            var parts = k.split("::");
            return langDict[parts.splice(0, 1)[0]][parts[0]];
        }
        return langDict[k];
    };

    this.init = function () {
        var lang = window.navigator.userLanguage || window.navigator.language;
        if (lang && lang.length >= 2) {
            lang = lang.substring(0, 2); // Convert 'en-GB' to 'en'.
        }
        else {
            // Default to english, if invalid
            lang = 'en';
        }
        this.load(lang);
    };
    this.init();
});
