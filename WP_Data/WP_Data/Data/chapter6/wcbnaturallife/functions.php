<?php
// ファイルの読み込み
function add_files() {
    // リセットCSS
    wp_enqueue_style('reset-style', 'https://unpkg.com/destyle.css@2.0.2/destyle.css');
    // Google Fonts
    wp_enqueue_style('google-fonts', 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap');
    // メインのCSSファイル
    wp_enqueue_style('main-style', get_stylesheet_uri());
    // JavaScriptファイル
    wp_enqueue_script('main-script', get_theme_file_uri().'/js/script.js', array(), '', true);
}
add_action('wp_enqueue_scripts', 'add_files');

// テーマ設定
function theme_setup(){
    // titleタグ
    add_theme_support('title-tag');

    // アイキャッチ画像
    add_theme_support('post-thumbnails');

    // メニュー
    register_nav_menus(
        array(
            'main-menu' => 'メインメニュー',
        )
    );
}
add_action('after_setup_theme', 'theme_setup');