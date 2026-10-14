<?php
/**
 * WordPress theme template fragment — PHP 8.
 * Displays search results with pagination (?page=) and [ad] placeholders.
 */

$paged = max(1, (int) ($_GET['page'] ?? 1));
$search = isset($_GET['s']) ? sanitize_text_field(wp_unslash($_GET['s'])) : '';

$query_args = [
    'posts_per_page' => 10,
    'paged'          => $paged,
];

if ($search !== '') {
    $query_args['s'] = $search;
}

$q = new WP_Query($query_args);
$pages = (int) $q->max_num_pages;
?>
<h1>
    Page <?= (int) $paged ?> of <?= max(1, $pages) ?>
    <?php if ($search !== '') : ?>
        : Search for <?= esc_html($search) ?>
    <?php endif; ?>
</h1>
<?php
if (!$q->have_posts()) :
    ?>
    <p><?php echo esc_html($search !== '' ? 'No posts matched your search.' : 'No posts found.'); ?></p>
    <?php
else :
    while ($q->have_posts()) {
        $q->the_post();
        $content = get_the_content();
        $content = preg_replace_callback(
            '#\[ad\]#',
            static function () {
                return '<div class="ad"></div>';
            },
            $content
        );
        ?>
        <h2><?= esc_html(get_the_title()) ?></h2>
        <p><?php echo wp_kses_post($content); ?></p>
        <?php
    }
endif;

wp_reset_postdata();
