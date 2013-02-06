define(['jquery', 'bootstrap'], function ($, bootstrap) {

    return new function () {

        var artists = {};

        $('#typeahead').typeahead({
            items: 10,

            source: function (search, typeahead) {
                /*var artist = {
                 query: {
                 multi_match: {
                 query: search.toLowerCase(),
                 fields: [
                 'name^4',
                 'tracks.title^2',
                 'tracks.release'
                 ]
                 }
                 }
                 }*/
                var artist = {
                    'query': {
                        'fuzzy': {
                            'name': search.toLowerCase()
                        }
                    }
                }


                return $.post('http://ec2-54-246-72-133.eu-west-1.compute.amazonaws.com:9200/_search/', JSON.stringify(artist), function (data) {
                    var i = 0,
                        terms = [];
                    for (i = 0; i < data.hits.hits.length; i++) {
                        var artist = data.hits.hits[i]._source;
                        artists[artist.name] = artist;
                        terms.push(artist.name);
                    }


                    return typeahead(terms);
                });
            },

            updater: function (item) {

                up(item)
            }

        });


        var up = function (item) {
            $('#typeahead').val(item);

            var artist = artists[item];
            $('#artists').show();
            $.ajax({
                url: 'http://ajax.googleapis.com/ajax/services/search/images?v=1.0&imgsz=small&imgtype=face&q=' + artist.name,
                success: function (data) {
                    $('#artist_photo').attr('src', data.responseData.results[0].url);
                },
                crossDomain: true,
                type: 'GET',
                dataType: 'jsonp'

            });

            $('#artist_name').text(artist.name);
            $('#artist_id').text(artist.artist_id);
            $('#similarity_id').text(artist.similarity_id);
            $('#artist_style').text(artist.mbtag);
            var albums = {}
            $.each(artist.tracks, function () {
                if (albums[this.release] == undefined) {
                    albums[this.release] = this.release
                }

            })
            var als = '';

            var i = 0;
            $.each(albums, function () {
                i++;
                als = als + "<img style='width:64px;height:64px;' src='' id='alb_" + i + "'/> &nbsp;";
                als = als + this + '<br/>';
                var idx = i
                $.ajax({
                    url: 'http://ajax.googleapis.com/ajax/services/search/images?v=1.0&imgsz=icon&q=' + ' ' + this,
                    success: function (data) {
                        $('#alb_' + idx).attr('src', data.responseData.results[0].url);
                    },
                    crossDomain: true,
                    type: 'GET',
                    dataType: 'jsonp'

                });

            });

            $('#artists_album').html(als);
            $('#artists_similaire').html('<a href="" onclick="return false" class="simlink">' + artist.similarity + '</a>');
            $('.simlink').click(function () {
                var artistreq = {
                    'query': {
                        'match': {
                            'artist_id': $('#similarity_id').text()
                        }
                    }
                }
                $.post('http://ec2-54-246-72-133.eu-west-1.compute.amazonaws.com:9200/_search/', JSON.stringify(artistreq), function (data2) {
                    var artist = data2.hits.hits[0]._source;
                    artists[artist.name] = artist;
                    up(artist.name)
                })
            });
        }


        this.searchArtist = function (id) {

            var artist = {
                query: {
                    match: {
                        artist_id: id
                    }
                }
            }

            $.post('http://ec2-54-246-72-133.eu-west-1.compute.amazonaws.com:9200/_search', JSON.stringify(artist), function (data) {
                var artist = data.hits.hits[0]._source;
                artists[artist.name] = artist;
                up(artist.name);
            });
        }


    };

});
