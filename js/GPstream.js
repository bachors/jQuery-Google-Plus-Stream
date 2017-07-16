/******************************************************
* #### jQuery-Google-Plus-Stream v2.0 ####
* Coded by Ican Bachors 2014.
* https://github.com/bachors/jQuery-Google-Plus-Stream
* Updates will be posted to this site.
******************************************************/

var GPstream = function(set) {
	
    feed('');

    function feed(g) {
        $.ajax({
            url: 'https://www.googleapis.com/plus/v1/people/' + set.user + '/activities/public?key=' + set.key + '&pageToken=' + g,
            crossDomain: true,
            dataType: 'jsonp'
        }).done(function(data) {
            var html = '',
				baseurl = '';
			$.each(data.items, function(i, a) {				
                var poto = '',
					title = '';
				if (data.items[i].object.attachments != '' && data.items[i].object.attachments != null && data.items[i].object.attachments != undefined) {
					if (data.items[i].object.attachments[0].objectType == 'video' && data.items[i].object.attachments[0].embed != null) {
						poto += '	<a href="#" class="googlevid" title="Play this videos" data-video="' + data.items[i].object.attachments[0].embed.url + '">';
						poto += '		<img src="' + data.items[i].object.attachments[0].image.url + '" class="feed_galeri"/>';
						poto += '	</a>';
					}else if (data.items[i].object.attachments[0].objectType == 'photo') {
						poto += '	<a href="' + data.items[i].url + '" target="_blank">';
						poto += '		<img src="' + data.items[i].object.attachments[0].fullImage.url + '"  class="feed_galeri"/>';
						poto += '	</a>';
					}else if (data.items[i].object.attachments[0].objectType == 'article') {
						if (data.items[i].object.attachments[0].image != null) {
							poto += '	<a href="' + data.items[i].url + '" target="_blank">';
							poto += '		<img src="' + data.items[i].object.attachments[0].image.url + '"  class="feed_galeri"/>';
							poto += '	</a>';
						}
					}
				}
                if (data.items[i].object.content != "" && data.items[i].object.content != null && data.items[i].object.content != undefined) {
                    title += (poto == '') ? '<div class="status-message quot"><i class="fa fa-quote-right"></i>' : '<div class="status-message">';					
					if (data.items[i].object.attachments != null && data.items[i].object.attachments[0].objectType == 'article') {
						title += '<a href="' + data.items[i].object.attachments[0].url + '" class="titles" target="_BLANK">' + data.items[i].object.attachments[0].displayName + '</a> ';
					}
					title += urltag(strip_tags(data.items[i].object.content).replace(/&#39;/ig, "'"));
					title += (poto == '') ? '<i class="fa fa-quote-left"></i>' : '';
					title += '</div>';
                }				
				
                html += '<div class="box">';
				html += poto + title;
                html += '	<div class="status-user">';
                html += '		<a href="' + data.items[i].actor.url + '" target="_BLANK" class="status-user-image">';
                html += '			<img src="' + data.items[i].actor.image.url + '">';
                html += '		</a>';
                html += '		<div class="status-user-name" title="' + data.items[i].actor.displayName + '">';
                html += '			<a href="' + data.items[i].actor.url + '" target="_BLANK">' + data.items[i].actor.displayName + '</a>';
                html += '		</div>';
                html += '		<a href="' + data.items[i].url + '" class="date" target="_blank">' + relative_time(data.items[i].published) + ' ago</a>';
                html += '		<div class="status-type" title="Google+"><i class="fa fa-google-plus"></i></div>';
                html += '	</div>';
				html += '	<div class="status-bottom tilu">';
				html += '		<a href="' + data.items[i].url + '" target="_BLANK" title="Plusone"><i class="fa fa-plus"></i> ' + koma(data.items[i].object.plusoners.totalItems) + '</a><a href="' + data.items[i].url + '" target="_BLANK" title="Reply"><i class="fa fa-share"></i> ' + koma(data.items[i].object.replies.totalItems) + '</a><a href="https://plus.google.com/share?url=' + data.items[i].url + '" target="_BLANK" title="Share"><i class="fa fa-share-alt"></i> ' + koma(data.items[i].object.resharers.totalItems) + '</a>';
				html += '	</div>';
                html += '</div>';
			});
			html += (data.nextPageToken != null && data.nextPageToken != undefined) ? '<a id="feed-more">Load More</a>' : "";
            $('#GPstream').append(html);
			$('.googlevid').click(function() {
				$(this).replaceWith('<iframe src="' + $(this).data("video").replace('https://www.youtube.com/v/', '//www.youtube.com/embed/') + '" allowfullscreen="" frameborder="0"></iframe>');
				return false
			});
            $('#feed-more').click(function() {
                feed(data.nextPageToken);
                $(this).remove();
                return false
            })
        })
    }

    function relative_time(a) {
        if (!a) {
            return
        }
        a = $.trim(a);
        a = a.replace(/\.\d\d\d+/, "");
        a = a.replace(/-/, "/").replace(/-/, "/");
        a = a.replace(/T/, " ").replace(/Z/, " UTC");
        a = a.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2");
        var b = new Date(a);
        var c = (arguments.length > 1) ? arguments[1] : new Date();
        var d = parseInt((c.getTime() - b) / 1000);
        d = (d < 2) ? 2 : d;
        var r = '';
        if (d < 60) {
            r = 'jst now'
        } else if (d < 120) {
            r = 'a min'
        } else if (d < (45 * 60)) {
            r = (parseInt(d / 60, 10)).toString() + ' mins'
        } else if (d < (2 * 60 * 60)) {
            r = 'an hr'
        } else if (d < (24 * 60 * 60)) {
            r = (parseInt(d / 3600, 10)).toString() + ' hrs'
        } else if (d < (48 * 60 * 60)) {
            r = 'a day'
        } else {
            dd = (parseInt(d / 86400, 10)).toString();
            if (dd <= 30) {
                r = dd + ' dys'
            } else {
                mm = (parseInt(dd / 30, 10)).toString();
                if (mm <= 12) {
                    r = mm + ' mon'
                } else {
                    r = (parseInt(mm / 12, 10)).toString() + ' yrs'
                }
            }
        }
        return r
    }
	
	function strip_tags(input, allowed) {
		allowed = (((allowed || '') + '')
		.toLowerCase()
		.match(/<[a-z][a-z0-9]*>/g) || [])
		.join('');
		var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
			commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
		return input.replace(commentsAndPhpTags, '')
		.replace(tags, function($0, $1) {
			return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
		});
	}
	
	function koma(a) {
        var b = parseInt(a, 10);
        if (b === null) {
            return 0
        }
        if (b >= 1000000000) {
            return (b / 1000000000).toFixed(1).replace(/\.0$/, "") + "G"
        }
        if (b >= 1000000) {
            return (b / 1000000).toFixed(1).replace(/\.0$/, "") + "M"
        }
        if (b >= 1000) {
            return (b / 1000).toFixed(1).replace(/\.0$/, "") + "K"
        }
        return b
    }

    function urltag(d, e) {
        var f = {
            link: {
                regex: /((^|)(https|http|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig,
                template: "<a href='$1' target='_BLANK' class='urls'>$1</a>"
            },
            hash: {
                regex: /(^|)#(\w+)/g,
                template: '$1<a target="_BLANK" class="tags" href="https://plus.google.com/s/%23$2">#$2</a>'
            },
            user: {
                regex: /(^|)\+([a-zA-Z0-9._-]+)/g,
                template: '$1<a target="_BLANK" class="tags" href="https://plus.google.com/+$2">+$2</a>'
            },
            email: {
                regex: /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi,
                template: '<a class="urls" href=\"mailto:$1\">$1</a>'
            }
        };
        var g = $.extend(f, e);
        $.each(g, function(a, b) {
            d = d.replace(b.regex, b.template)
        });
        return d
    }
}