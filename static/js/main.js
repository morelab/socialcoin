window.onload = () => {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
  }
}

let $homeIcon = $('#sidebar');
$(window).resize(function () {
  if (window.innerWidth >= 1024) $homeIcon.removeClass('active');
});

function sidebarChange() {
  let win = $(this);
  if (win.width() >= 1024 && !$('sidebar').hasClass('active')) {
    $('#sidebar').removeClass('active');
    $('#sidebarCollapse').removeClass('active');
    $('main').removeClass('marginless');
  } else if (win.width() < 1024 && !$('sidebar').hasClass('active')) {
    $('#sidebar').addClass('active');
    $('#sidebarCollapse').addClass('active');
    $('main').addClass('marginless');
  }
}
$(document).ready(function () {
  $('#sidebarCollapse').on('click', function () {
    $('#sidebar').toggleClass('active');
    $('#sidebarCollapse').toggleClass('active');
    $('main').toggleClass('marginless');
  });
});
$(window).on('resize', sidebarChange);
$(window).on('scroll', sidebarChange);
$(document).on('click', function (e) {
  if (
    $(e.target).closest('#sidebar').length == 0 &&
    $(e.target).closest('#sidebarCollapse').length == 0 &&
    !$('#sidebar').hasClass('active') &&
    $(this).width() < 1024
  ) {
    $('#sidebar').toggleClass('active');
    $('#sidebarCollapse').toggleClass('active');
    $('main').toggleClass('marginless');
  }
});