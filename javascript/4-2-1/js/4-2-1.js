$(window).on('load',function() {
  //ロゴを1.2秒でフェードアウトする記述
  $("#splash-logo").delay(1200).fadeOut('slow')
  //ローディングエリア(splashエリア)を1.5秒でフェードアウトする記述
  $("#splash").delay(1500).fadeOut('slow',function(){
    $('body').addClass('appear');//フェードアウト後bodyにappearクラス付与
  });
  $('.splashbg').on('animationend', function() {
  //背景が伸びた後に動かしたいJavaScriptがある場合はこの中にJavaScriptを記載
  });
});