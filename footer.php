<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package
 */

    $url = 'https://colorlib.com/';
    $copyText = sprintf( __( 'Theme by %s colorlib %s Copyright &copy; %s  |  All rights reserved.', 'boxe' ), '<a target="_blank" href="' . esc_url( $url ) . '">', '</a>', date( 'Y' ) );
    $copyRight = !empty( boxe_opt( 'boxe_footer_copyright_text' ) ) ? boxe_opt( 'boxe_footer_copyright_text' ) : $copyText;
    $no_widget_class = boxe_opt( 'boxe_footer_widget_toggle' ) != 1 ? ' no_widget' : '';

    $footer_bg = get_theme_mod( 'footer_bg' );
    $footer_bg_src = wp_get_attachment_image_src( $footer_bg, 'full' );
    $footer_bg_path = boxe_inline_bg_img( $footer_bg_src[0] );
    ?>

    <!-- footer part start-->
    
    <footer class="footer-area<?php echo $no_widget_class?>" <?php echo $footer_bg_path?>>
        <?php
            if( boxe_opt( 'boxe_footer_widget_toggle' ) == 1 ) {
        ?>
        <div class="container">
            <div class="row">
                <?php
                    // Footer Widget 1
                    if ( is_active_sidebar( 'footer-1' ) ) {
                        dynamic_sidebar( 'footer-1' );
                    }

                    // Footer Widget 2
                    if ( is_active_sidebar( 'footer-2' ) ) {
                        dynamic_sidebar( 'footer-2' );
                    }

                    // Footer Widget 3
                    if ( is_active_sidebar( 'footer-3' ) ) {
                        dynamic_sidebar( 'footer-3' );
                    }

                    // Footer Widget 4
                    if ( is_active_sidebar( 'footer-4' ) ) {
                        dynamic_sidebar( 'footer-4' );
                    }
                ?>
            </div>
        </div>
        <?php
            } 
        ?>

    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                <div class="copyright_part_text">
                    <div class="container">
                        <div class="row">
                            <div class="col-lg-8">
                                <p class="footer-text m-0"><?php echo wp_kses_post( $copyRight ); ?></p>
                            </div>

                            <?php
                                $social_profile = boxe_opt( 'boxe_social_profile_toggle' );
                                if( $social_profile == 1 ) {
                                    $social_icons = boxe_opt( 'boxe_footer_social' );
                            ?> 
                            <div class="col-lg-4">
                                <div class="social_icon">
                                    <?php
                                        for ( $i = 0; $i < count($social_icons); $i++ ) {
                                            $social_icon = $social_icons[$i]['social_icon'];
                                            ?>
                                            <a href="<?php echo esc_url($social_icons[$i]['social_url']);?>"><i class="<?php echo esc_html( boxe_social_icon_overwrite_by_themefy_icon( $social_icon ) );?>"></i></a>
                                        <?php
                                        }
                                    ?>
                                </div>
                            </div>
                            <?php } ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>

    <?php wp_footer(); ?>
    </body>
</html>