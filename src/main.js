import '../scss/style.scss';

/* debouncedresize */
function on_resize(c,t){onresize=function(){clearTimeout(t);t=setTimeout(c,100);}; return c;}

/* inspect userAgent - check if mobile, what browser, etc */
var ua = window.navigator.userAgent.toLowerCase();
var mobile = /mobile|android|kindle|silk|midp|phone|(windows .+arm|touch)/.test(ua);

// http://www.zytrax.com/tech/web/browser_ids.htm
// http://www.zytrax.com/tech/web/mobile_ids.html
ua = /(chrome|firefox)[ \/]([\w.]+)/.exec(ua) || // Chrome & Firefox
    /(iphone|ipad|ipod)(?:.*version)?[ \/]([\w.]+)/.exec(ua) || // Mobile IOS
    /(android)(?:.*version)?[ \/]([\w.]+)/.exec(ua) || // Mobile Webkit
    /(webkit|opera)(?:.*version)?[ \/]([\w.]+)/.exec(ua) || // Safari & Opera
    /(msie) ([\w.]+)/.exec(ua) ||
    /(trident).+rv:(\w.)+/.exec(ua) || [];

var browser = ua[1];
var version = parseFloat(ua[2]);

var $body = $('body');
var FGR = {
      v: "v1.0.0",
      DEBUG: true,
      _: function(){
        FGR.DEBUG && window.console && console.log.apply(console, arguments);
      },
      onReady: function(){

        FGR._("JS initiated. ", FGR.v, "\nBrowser informations:", browser, version);

        var $all = $('.choose-event');
        var $events = $('.events-each');

        $all.on('click', function(e){
          e.preventDefault();

          var $target = $($(this).data('target'));

          $all.not(this).addClass('inactive');
          $(this).removeClass('inactive');

          $events.removeClass('active');
          $target.addClass('active');

          $('document, html, body').animate({
            scrollTop: $target.offset().top
          }, 1000);
        });

        $('.js-close').on('click', function(e){
          e.preventDefault();

          $events.removeClass('active');
          $all.addClass('inactive');

          $('document, html, body').animate({
            scrollTop: 0
          }, 1000);
        });
      }, // onReady
      onResize: function(){

      } // onResize
    }; // FGR declarations

// INIT
on_resize(FGR.onResize)();
$(document).ready(FGR.onReady);