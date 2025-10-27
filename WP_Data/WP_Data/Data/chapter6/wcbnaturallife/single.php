<?php get_header(); ?>

    <main class="main-contents wrapper">
        <div class="post-list">
            <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
            <article class="post-item">
                <?php if(has_post_thumbnail()): ?>
                    <?php the_post_thumbnail('medium_large'); ?>
                <?php endif; ?>
                <header class="post-header">
                    <h1 class="post-title">
                        <?php the_title(); ?>
                    </h1>
                    <time class="post-date" datetime="<?php echo get_the_date('Y-m-d'); ?>"><?php the_date(); ?></time>
                    <?php the_category(); ?>
                </header>
                <div class="post-content wrapper">
                    <?php the_content(); ?>                             
                </div>
                <footer class="post-footer wrapper">
                    <?php the_tags('<div class="tags-links"><ul><li>', '</li><li>', '</ul></div>'); ?>
                </footer>
            </article>
            <?php endwhile; else : ?>
                <p>記事はありません。</p>
            <?php endif; ?>
        </div>
    </main>

<?php get_footer(); ?>