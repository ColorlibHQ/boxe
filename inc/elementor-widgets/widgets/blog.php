<?php
namespace Boxeelementor\Widgets;

use Elementor\Widget_Base;
use Elementor\Controls_Manager;
use Elementor\Scheme_Color;
use Elementor\Scheme_Typography;
use Elementor\Group_Control_Typography;
use Elementor\Group_Control_Text_Shadow;
use Elementor\Group_Control_Background;



// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


/**
 *
 * Boxe elementor few words section widget.
 *
 * @since 1.0
 */

class Boxe_Blog extends Widget_Base {

	public function get_name() {
		return 'boxe-blog';
	}

	public function get_title() {
		return __( 'Blog', 'boxe' );
	}

	public function get_icon() {
		return 'eicon-post-list';
	}

	public function get_categories() {
		return [ 'boxe-elements' ];
    }

	protected function _register_controls() {

        // Section Heading
        $this->start_controls_section(
            'section_heading',
            [
                'label' => __( 'Section Heading', 'boxe' ),
            ]
        );

        $this->add_control(
            'sec_heading',
            [
                'label'         => esc_html__( 'Heading Text', 'boxe' ),
                'type'          => Controls_Manager::TEXT,
                'default'       => __( 'Latest Blog', 'boxe' )
            ]
        );
        $this->end_controls_section(); 


        // Blog post settings
        $this->start_controls_section(
            'blog_post_sec',
            [
                'label' => __( 'Blog Post Settings', 'boxe' ),
            ]
        );
		$this->add_control(
			'post_num',
			[
				'label'         => esc_html__( 'Post Item', 'boxe' ),
				'type'          => Controls_Manager::NUMBER,
				'label_block'   => false,
                'default'       => absint(3),
                'min'           => 1,
                'max'           => 3,
			]
		);
		$this->add_control(
			'post_order',
			[
				'label'         => esc_html__( 'Post Order', 'boxe' ),
				'type'          => Controls_Manager::SWITCHER,
				'label_block'   => false,
				'label_on'      => 'ASC',
				'label_off'     => 'DESC',
                'default'       => 'yes',
                'options'       => [
                    'no'        => 'ASC',
                    'yes'       => 'DESC'
                ]
			]
        );
        $this->add_control(
			'post_excerpt',
			[
				'label'         => esc_html__( 'Post Excerpt', 'boxe' ),
				'type'          => Controls_Manager::NUMBER,
				'label_block'   => false,
                'default'       => absint(20),
                'min'           => 10,
                'max'           => 40,
			]
		);

        $this->end_controls_section(); // End few words content


        /**
         * Style Tab
         * ------------------------------ Background Style ------------------------------
         *
         */

        // Heading Style ==============================
        $this->start_controls_section(
            'color_sect', [
                'label' => __( 'Color Settings', 'boxe' ),
                'tab' => Controls_Manager::TAB_STYLE,
            ]
        );
        $this->add_control(
            'color_secttitle', [
                'label'     => __( 'Section Title Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .blog_part .blog_tittle h2' => 'color: {{VALUE}};',
                ],
            ]
        );  
        $this->add_control(
            'date_bg_color', [
                'label'     => __( 'Date BG Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .blog_part .single_blog .single_blog_img .date' => 'background-color: {{VALUE}};',
                ],
            ]
        );  
        $this->add_control(
            'blog_title_color', [
                'label'     => __( 'Blog Title Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .blog_part .single_blog .single_blog_text h3 a' => 'color: {{VALUE}};',
                ],
            ]
        );  
        $this->add_control(
            'blog_txt_color', [
                'label'     => __( 'Blog Text Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .blog_part .single_blog .single_blog_text p' => 'color: {{VALUE}};',
                ],
            ]
        );  
        $this->add_control(
            'blog_meta_color', [
                'label'     => __( 'Blog Meta Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .single_blog_text .sl-wrapper' => 'color: {{VALUE}};',
                    '{{WRAPPER}} .blog_part .single_blog .single_blog_text a' => 'color: {{VALUE}};',
                    '{{WRAPPER}} .blog_part .single_blog .single_blog_text' => 'border-color: {{VALUE}};',
                ],
            ]
        );  
        $this->add_control(
            'blog_more_anchor_color', [
                'label'     => __( 'Blog More Anchor Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .blog_part .single_blog .btn_3' => 'color: {{VALUE}};',
                ],
            ]
        );  
        $this->add_control(
            'blog_more_anchor_hvr_color', [
                'label'     => __( 'Blog More Anchor Hover Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .blog_part .single_blog .btn_3:hover' => 'color: {{VALUE}};',
                ],
            ]
        );  

        $this->end_controls_section();


        // Background Style ==============================
        $this->start_controls_section(
            'section_bg', [
                'label' => __( 'Style Background', 'boxe' ),
                'tab' => Controls_Manager::TAB_STYLE,
            ]
        );
        
        $this->add_control(
            'section_bgheading',
            [
                'label'     => __( 'Background Settings', 'boxe' ),
                'type'      => Controls_Manager::HEADING,
                'separator' => 'before',
            ]
        );
        $this->add_group_control(
            Group_Control_Background::get_type(),
            [
                'name' => 'sectionbg',
                'label' => __( 'Background', 'boxe' ),
                'types' => [ 'classic' ],
                'selector' => '{{WRAPPER}} .blog_part',
            ]
        );

        $this->end_controls_section();
	}

	protected function render() {
    $settings      = $this->get_settings();
    $sec_heading   = !empty( $settings['sec_heading'] ) ? $settings['sec_heading'] : '';
    $post_num      = !empty( $settings['post_num'] ) ? $settings['post_num'] : '';
    $excerpt_limit = !empty( $settings['post_excerpt'] ) ? $settings['post_excerpt'] : '';
    $post_order    = !empty( $settings['post_order'] ) ? $settings['post_order'] : '';
    $post_order    = $post_order == 'yes' ? 'DESC' : 'ASC';
    $dynamic_class = is_front_page() ? 'padding_bottom' : 'padding_top single_blog_page';
    ?>

    <!--::blog part start::-->
    <section class="blog_part <?php echo $dynamic_class?>">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="blog_tittle">
                        <h2><?php echo esc_html( $sec_heading )?></h2>
                    </div>
                </div>
                <?php
                    if( function_exists( 'boxe_latest_blog' ) ) {
                        boxe_latest_blog( $post_num, $post_order, $excerpt_limit );
                    }
                ?>
            </div>
        </div>
    </section>
    <!--::blog part end::-->
    <?php
    }
}