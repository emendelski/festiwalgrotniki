import './scss/style.scss';

function onReady() {
  const $all = $('.choose-event');
  const $events = $('.events-each');

  $all.on('click', (e) => {
    const that = e.currentTarget;
    e.preventDefault();

    const $target = $($(that).data('target'));

    $all.not(that).addClass('inactive');
    $(that).removeClass('inactive');

    $events.removeClass('active');
    $target.addClass('active');

    $('document, html, body').animate({
      scrollTop: $target.offset().top,
    }, 1000);
  });

  $('.js-close').on('click', (e) => {
    e.preventDefault();

    $events.removeClass('active');
    $all.addClass('inactive');

    $('document, html, body').animate({
      scrollTop: 0,
    }, 1000);
  });
}

// INIT
$(document).ready(onReady);
