<?php 
/**
 * @Packge     : Boxe
 * @Version    : 1.0
 * @Author     : Colorlib
 * @Author URI : http://colorlib.com/wp/
 *
 * Customizer section fields
 *
 */

/***********************************
 * Theme Options Section Fields
 ***********************************/

 // Theme color field
Epsilon_Customizer::add_field(
    'boxe_theme_color',
    array(
        'type'        => 'epsilon-color-picker',
        'label'       => esc_html__( 'Theme Color', 'boxe' ),
        'description' => esc_html__( 'Select the theme color.', 'boxe' ),
        'sanitize_callback' => 'sanitize_text_field',
        'section'     => 'boxe_general_section',
        'default'     => '#6345fe',
    )
);

 // Secondary Theme color field
Epsilon_Customizer::add_field(
    'boxe_secondary_theme_color',
    array(
        'type'        => 'epsilon-color-picker',
        'label'       => esc_html__( 'Secondary Theme Color', 'boxe' ),
        'description' => esc_html__( 'Select the secondary theme color.', 'boxe' ),
        'sanitize_callback' => 'sanitize_text_field',
        'section'     => 'boxe_general_section',
        'default'     => '#f6a515',
    )
);
 
// Sticky Header background color field
Epsilon_Customizer::add_field(
    'boxe_header_bg_color',
    array(
        'type'        => 'epsilon-color-picker',
        'label'       => esc_html__( 'Sticky Header BG Color', 'boxe' ),
        'description' => esc_html__( 'Select the header background color.', 'boxe' ),
        'sanitize_callback' => 'sanitize_text_field',
        'section'     => 'boxe_header_section',
        'default'     => '#f6a515',
    )
);

// Header nav menu color field
Epsilon_Customizer::add_field(
    'boxe_header_menu_color',
    array(
        'type'        => 'epsilon-color-picker',
        'label'       => esc_html__( 'Header menu color', 'boxe' ),
        'sanitize_callback' => 'sanitize_text_field',
        'section'     => 'boxe_header_section',
        'default'     => '#fff',
    )
);

// Header nav menu hover color field
Epsilon_Customizer::add_field(
    'boxe_header_menu_hover_color',
    array(
        'type'        => 'epsilon-color-picker',
        'label'       => esc_html__( 'Header menu hover color', 'boxe' ),
        'sanitize_callback' => 'sanitize_text_field',
        'section'     => 'boxe_header_section',
        'default'     => '#f6a515',
    )
);

// Header nav menu hover color field
Epsilon_Customizer::add_field(
    'boxe_sticky_menu_hover_color',
    array(
        'type'        => 'epsilon-color-picker',
        'label'       => esc_html__( 'Sticky menu hover color', 'boxe' ),
        'sanitize_callback' => 'sanitize_text_field',
        'section'     => 'boxe_header_section',
        'default'     => '#6345fe',
    )
);
    

// Header nav menu hover color field
Epsilon_Customizer::add_field(
    'boxe_dropdown_menu_bg_color',
    array(
        'type'        => 'epsilon-color-picker',
        'label'       => esc_html__( 'Dropdown menu BG color', 'boxe' ),
        'sanitize_callback' => 'sanitize_text_field',
        'section'     => 'boxe_header_section',
        'default'     => '#6345fe',
    )
);

/***********************************
 * Blog Section Fields
 ***********************************/
 
// Post excerpt length field
Epsilon_Customizer::add_field(
    'boxe_excerpt_length',
    array(
        'type'        => 'text',
        'label'       => esc_html__( 'Set post excerpt length', 'boxe' ),
        'description' => esc_html__( 'Set post excerpt length.', 'boxe' ),
        'section'     => 'boxe_blog_section',
        'sanitize_callback' => 'sanitize_text_field',
        'default'     => '30',
    )
);

// Blog single page social share icon
Epsilon_Customizer::add_field(
    'boxe_blog_meta',
    array(
        'type'        => 'epsilon-toggle',
        'label'       => esc_html__( 'Blog page post meta show/hide', 'boxe' ),
        'section'     => 'boxe_blog_section',
        'default'     => true
    )
);
Epsilon_Customizer::add_field(
    'boxe_like_btn',
    array(
        'type'        => 'epsilon-toggle',
        'label'       => esc_html__( 'Blog Single Page Like Button show/hide', 'boxe' ),
        'section'     => 'boxe_blog_section',
        'default'     => true
    )
);
Epsilon_Customizer::add_field(
    'boxe_blog_share',
    array(
        'type'        => 'epsilon-toggle',
        'label'       => esc_html__( 'Blog Single Page Share show/hide', 'boxe' ),
        'section'     => 'boxe_blog_section',
        'default'     => true
    )
);


/***********************************
 * 404 Page Section Fields
 ***********************************/

// 404 text #1 field
Epsilon_Customizer::add_field(
    'boxe_fof_titleone',
    array(
        'type'              => 'text',
        'label'             => esc_html__( '404 Text #1', 'boxe' ),
        'section'           => 'boxe_fof_section',
        'sanitize_callback' => 'sanitize_text_field',
        'default'           => 'Say Hello.'
    )
);
// 404 text #2 field
Epsilon_Customizer::add_field(
    'boxe_fof_titletwo',
    array(
        'type'              => 'text',
        'label'             => esc_html__( '404 Text #2', 'boxe' ),
        'section'           => 'boxe_fof_section',
        'sanitize_callback' => 'sanitize_text_field',
        'default'           => 'Say Hello.'
    )
);
// 404 text #1 color field
Epsilon_Customizer::add_field(
    'boxe_fof_textone_color',
    array(
        'type'        => 'epsilon-color-picker',
        'label'       => esc_html__( '404 Text #1 Color', 'boxe' ),
        'sanitize_callback' => 'sanitize_text_field',
        'section'     => 'boxe_fof_section',
        'default'     => '#000000',
    )
);
// 404 text #2 color field
Epsilon_Customizer::add_field(
    'boxe_fof_texttwo_color',
    array(
        'type'        => 'epsilon-color-picker',
        'label'       => esc_html__( '404 Text #2 Color', 'boxe' ),
        'sanitize_callback' => 'sanitize_text_field',
        'section'     => 'boxe_fof_section',
        'default'     => '#656565',
    )
);
// 404 background color field
Epsilon_Customizer::add_field(
    'boxe_fof_bg_color',
    array(
        'type'        => 'epsilon-color-picker',
        'label'       => esc_html__( '404 Page Background Color', 'boxe' ),
        'sanitize_callback' => 'sanitize_text_field',
        'section'     => 'boxe_fof_section',
        'default'     => '#fff',
    )
);

/***********************************
 * Footer Section Fields
 ***********************************/

// Footer BG overlay color field
Epsilon_Customizer::add_field(
    'boxe_footer_bg_overlay_color',
    array(
        'type'        => 'epsilon-color-picker',
        'label'       => esc_html__( 'Footer BG Overlay color', 'boxe' ),
        'sanitize_callback' => 'sanitize_text_field',
        'section'     => 'boxe_footer_section',
        'default'     => '#000',
    )
);

// Footer Widget section
Epsilon_Customizer::add_field(
    'footer_widget_separator',
    array(
        'type'        => 'epsilon-separator',
        'label'       => esc_html__( 'Footer Widget Section', 'boxe' ),
        'section'     => 'boxe_footer_section',

    )
);

// Footer widget toggle field
Epsilon_Customizer::add_field(
    'boxe_footer_widget_toggle',
    array(
        'type'        => 'epsilon-toggle',
        'label'       => esc_html__( 'Footer widget show/hide', 'boxe' ),
        'description' => esc_html__( 'Toggle to display footer widgets.', 'boxe' ),
        'section'     => 'boxe_footer_section',
        'default'     => true,
    )
);

// Footer Copyright section
Epsilon_Customizer::add_field(
    'boxe_footer_copyright_separator',
    array(
        'type'        => 'epsilon-separator',
        'label'       => esc_html__( 'Footer Copyright Section', 'boxe' ),
        'section'     => 'boxe_footer_section',
        'default'     => true,

    )
);

// Footer copyright text field
$url = 'https://colorlib.com/';
$copyText = sprintf( __( 'Theme by %s colorlib %s Copyright &copy; %s  |  All rights reserved.', 'boxe' ), '<a target="_blank" href="' . esc_url( $url ) . '">', '</a>', date( 'Y' ) );
Epsilon_Customizer::add_field(
    'boxe_footer_copyright_text',
    array(
        'type'        => 'epsilon-text-editor',
        'label'       => esc_html__( 'Footer copyright text', 'boxe' ),
        'section'     => 'boxe_footer_section',
        'default'     => wp_kses_post( $copyText ),
    )
);


// Social Profile Separator
Epsilon_Customizer::add_field(
    'social_pro_separator',
    array(
        'type'        => 'epsilon-separator',
        'label'       => esc_html__( 'Social Profile', 'boxe' ),
        'section'     => 'boxe_footer_section',

    )
);

// Social Profile Show/Hide
Epsilon_Customizer::add_field(
    'boxe_social_profile_toggle',
    array(
        'type'        => 'epsilon-toggle',
        'label'       => esc_html__( 'Social Profile Show/Hide', 'boxe' ),
        'section'     => 'boxe_footer_section',
        'default'     => true,
    )
);

//Social Profile links
Epsilon_Customizer::add_field(
	'boxe_footer_social',
	array(
		'type'         => 'epsilon-repeater',
		'section'      => 'boxe_footer_section',
		'label'        => esc_html__( 'Social Profile Links', 'boxe' ),
		'button_label' => esc_html__( 'Add new social link', 'boxe' ),
		'row_label'    => array(
			'type'  => 'field',
			'field' => 'social_link_title',
		),
		'fields'       => array(
			'social_link_title'       => array(
				'label'             => esc_html__( 'Title', 'boxe' ),
				'type'              => 'text',
				'sanitize_callback' => 'wp_kses_post',
				'default'           => 'Twitter',
			),
			'social_url' => array(
				'label'             => esc_html__( 'Social URL', 'boxe' ),
				'type'              => 'text',
				'sanitize_callback' => 'sanitize_text_field',
				'default'           => 'https://twitter.com',
			),
			'social_icon'        => array(
				'label'   => esc_html__( 'Icon', 'boxe' ),
				'type'    => 'epsilon-icon-picker',
				'default' => 'fa fa-twitter',
			),
			
		),
	)
);


// Footer widget text color field
Epsilon_Customizer::add_field(
    'boxe_footer_widget_text_color',
    array(
        'type'        => 'epsilon-color-picker',
        'label'       => esc_html__( 'Footer Text Color', 'boxe' ),
        'sanitize_callback' => 'sanitize_text_field',
        'section'     => 'boxe_footer_section',
        'default'     => '#e8e8e8',
    )
);

// Footer widget title color field
Epsilon_Customizer::add_field(
    'boxe_footer_widget_title_color',
    array(
        'type'        => 'epsilon-color-picker',
        'label'       => esc_html__( 'Footer Widget Title Color', 'boxe' ),
        'sanitize_callback' => 'sanitize_text_field',
        'section'     => 'boxe_footer_section',
        'default'     => '#ffffff',
    )
);

// Footer widget anchor color field
Epsilon_Customizer::add_field(
    'boxe_footer_widget_anchor_color',
    array(
        'type'        => 'epsilon-color-picker',
        'label'       => esc_html__( 'Footer Anchor Color', 'boxe' ),
        'sanitize_callback' => 'sanitize_text_field',
        'section'     => 'boxe_footer_section',
        'default'     => '#6345fe',
    )
);

// Footer widget anchor hover color field
Epsilon_Customizer::add_field(
    'boxe_footer_widget_anchor_hover_color',
    array(
        'type'        => 'epsilon-color-picker',
        'label'       => esc_html__( 'Footer Anchor Hover Color', 'boxe' ),
        'sanitize_callback' => 'sanitize_text_field',
        'section'     => 'boxe_footer_section',
        'default'     => '#6345fe',
    )
);

