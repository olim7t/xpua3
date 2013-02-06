require.config({
    baseUrl: 'js',
    
    paths: {
        'jquery': [
            'http://cdnjs.cloudflare.com/ajax/libs/jquery/1.9.0/jquery.min',
            'vendor/jquery-1.9.1.min'
        ],

        'cookie': 'vendor/jquery.cookie',

        'pubsub': 'vendor/pubsub',

        'handlebars': [
            'http://cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.0.rc.2/handlebars.min',
            'vendor/handlebars'
        ],

        'underscore': [
            'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min',
            'vendor/underscore'
        ],

        'bootstrap': 'vendor/bootstrap.min',

        'text': 'vendor/text',

        'async': 'vendor/async'
    },

    shim: {
        'pubsub': {
            exports: 'PubSub'
        },

        'handlebars': {
            exports: 'Handlebars'
        },

        'underscore': {
            exports: '_'
        },

        'cookie': ['jquery'],

        'bootstrap': ['jquery']

    },
    
    waitSeconds: 15
});

require(['jquery', 'cookie', 'maps', 'search'], function($, cookien, maps, search) {
    var COOKIE_NAME = "XPUA_3";

    var COOKIE_OPTIONS = {
        duration: null, // set null to delete cookie after browser has been closed - in days
        path: '/',
        domain: '',
        secure: false
    };

    var mapCanvas = $('#map_canvas').get(0);

    function configureLoginButton (user) {
        var $favorites = $('#artist-favorites');

        $favorites.empty();

        for (var i = 0; i < user.artists.length; i++) {
            $favorites.append('<li><a href="#artists" id="' + user.artists[i].id + '" class="artist"><i class="icon-star"></i>' + user.artists[i].name +'</a></li>');
        }

        var $artist = $('.artist');
        if ($artist) {
            $artist.click(function () {
                search.searchArtist($(this).attr('id'));
            });
        }

        $('#artists-list').show();


        maps.addMapToCanvas(mapCanvas, user.latitude, user.longitude);
        maps.addMarker(user.latitude, user.longitude);

        $('#map_canvas').show();

        $('#loginModal').modal('hide');
        $('#loginModalBtn').text(user.login + ' ');
        $('#loginModalBtn').append('<i class="icon-off icon-white"></i>');
        $('#loginModalBtn').unbind('click');
        $('#loginModalBtn').click(function () {
            console.log('Déconnexion');
            $.cookie(COOKIE_NAME, null, COOKIE_OPTIONS);
            configureLogoutButton();
        });
    }

    function configureLogoutButton () {
        $('#artists-list').hide();

        $('#artists').hide();

        $('#map_canvas').hide();

        $('#loginModalBtn').text('Se connecter');
        $('#loginModalBtn').unbind('click');
        $('#loginModalBtn').click(function(){
            $('#loginModal').modal();
        });
    }

    var cookieContent = $.cookie(COOKIE_NAME);
    if (cookieContent) {
        var user = JSON.parse(cookieContent);
        configureLoginButton(user);
    } else {
        configureLogoutButton();
    }


    $('#loginBtn').click(function () {
        var $email = $('#email').val(),
            $city = $('#city').val();

        $.post('/resources/users/login', {login: $email, city:$city}, function (data) {
            console.log(data);
            var user = JSON.stringify(data);
            $.cookie(COOKIE_NAME, user, COOKIE_OPTIONS);
            configureLoginButton(data);
        });

    });

    $('#artistAddFollowing').click(function () {
        var $email = $('#email').val(),
            $artist_id = $('#artist_id').val(),
            $artist_name = $('#artist_name').val();

        $.post('/resources/users/artist/' + $artist_name + '/' + $artist_id, {login: $email}, function (data) {
            console.log(data);
            var user = JSON.stringify(data);
            $.cookie(COOKIE_NAME, user, COOKIE_OPTIONS);
            configureLoginButton(data);
        });

    });

});
