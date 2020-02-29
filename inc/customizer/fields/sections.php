<?php 
/**
 * @Packge     : Boxe
 * @Version    : 1.0
 * @Author     : Colorlib
 * @Author URI : http://colorlib.com/wp/
 *
 * Customizer panels and sections
 *
 */

/***********************************
 * Register customizer panels
 ***********************************/

$panels = array(
    /**
     * Theme Options Panel
     */
    array(
        'id'   => 'boxe_theme_options_panel',
        'args' => array(
            'priority'       => 0,
            'capability'     => 'edit_theme_options',
            'theme_supports' => '',
            'title'          => esc_html__( 'Theme Options', 'boxe' ),
        ),
    )
);


/***********************************
 * Register customizer sections
 ***********************************/


$sections = array(

    /**
     * General Section
     */
    array(
        'id'   => 'boxe_general_section',
        'args' => array(
            'title'    => esc_html__( 'General', 'boxe' ),
            'panel'    => 'boxe_theme_options_panel',
            'priority' => 1,
        ),
    ),
    
    /**
     * Header Section
     */
    array(
        'id'   => 'boxe_header_section',
        'args' => array(
            'title'    => esc_html__( 'Header', 'boxe' ),
            'panel'    => 'boxe_theme_options_panel',
            'priority' => 2,
        ),
    ),

    /**
     * Blog Section
     */
    array(
        'id'   => 'boxe_blog_section',
        'args' => array(
            'title'    => esc_html__( 'Blog', 'boxe' ),
            'panel'    => 'boxe_theme_options_panel',
            'priority' => 3,
        ),
    ),


    /**
     * 404 Page Section
     */
    array(
        'id'   => 'boxe_fof_section',
        'args' => array(
            'title'    => esc_html__( '404 Page', 'boxe' ),
            'panel'    => 'boxe_theme_options_panel',
            'priority' => 6,
        ),
    ),

    /**
     * Footer Section
     */
    array(
        'id'   => 'boxe_footer_section',
        'args' => array(
            'title'    => esc_html__( 'Footer Page', 'boxe' ),
            'panel'    => 'boxe_theme_options_panel',
            'priority' => 7,
        ),
    ),



);


/***********************************
 * Add customizer elements
 ***********************************/
$collection = array(
    'panel'   => $panels,
    'section' => $sections,
);

Epsilon_Customizer::add_multiple( $collection );

?>