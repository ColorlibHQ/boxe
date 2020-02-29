<?php
namespace Boxeelementor\Widgets;

use Elementor\Widget_Base;
use Elementor\Controls_Manager;
use Elementor\Utils;
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
 * Boxe elementor section widget.
 *
 * @since 1.0
 */
class Boxe_About extends Widget_Base {

	public function get_name() {
		return 'boxe-about';
	}

	public function get_title() {
		return __( 'About', 'boxe' );
	}

	public function get_icon() {
		return 'eicon-thumbnails-half';
	}

	public function get_categories() {
		return [ 'boxe-elements' ];
	}

	protected function _register_controls() {

        
		// ----------------------------------------  About content ------------------------------
		$this->start_controls_section(
			'about_content',
			[
				'label' => __( 'About Section', 'boxe' ),
			]
        );
        
        $this->add_control(
            'about_title',
            [
                'label'         => esc_html__( 'Title', 'boxe' ),
                'type'          => Controls_Manager::TEXT,
                'label_block'   => true,
                'default'       => esc_html__( 'About Us', 'boxe' )
            ]
        );

        $this->add_control(
            'content',
            [
                'label'         => esc_html__( 'About Text', 'boxe' ),
                'description'   => esc_html__('Use <br> tag for line break', 'boxe'),
                'type'          => Controls_Manager::WYSIWYG,
                'label_block'   => true,
                'default'       => __( '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra Lorem ipsum dolor sit amet, consectetur adipiscing</p><p>sedeiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra Lorem ipsum dolor sit amet, </p>', 'boxe' )
            ]
        );

        $this->add_control(
			'img_right',
			[
				'label'         => esc_html__( 'Image Right', 'boxe' ),
                'type'          => Controls_Manager::MEDIA,
                'default'       => [
                    'url'       => Utils::get_placeholder_image_src(),
                ]
			]
        );
        
        $this->end_controls_section(); // End about content
        

        /**
         * Style Tab
         * ------------------------------ About Settings ------------------------------
         *
         */

        // Color Settings ==============================
        $this->start_controls_section(
            'color_sect', [
                'label' => __( 'Color Settings', 'boxe' ),
                'tab' => Controls_Manager::TAB_STYLE,
            ]
        );
		$this->add_control(
			'title_color', [
				'label'     => __( 'Title Color', 'boxe' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .about_part .about_part_img h2' => 'color: {{VALUE}};',
				],
			]
		);
		$this->add_control(
			'text_bg_holder_color', [
				'label'     => __( 'Text BG Holder Color', 'boxe' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .about_part .about_part_text' => 'background-color: {{VALUE}};',
				],
			]
		);
		$this->add_control(
			'text_color', [
				'label'     => __( 'Text Color', 'boxe' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .about_part .about_part_text .about_text_iner p' => 'color: {{VALUE}};',
				],
			]
		);
		
        $this->end_controls_section();
        

        /**
         * Style Tab
         * ------------------------------ Background Style ------------------------------
         *
         */
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
                'selector' => '{{WRAPPER}} .about_part:after',
            ]
        );

        $this->end_controls_section();


	}

	protected function render() {
        $settings      = $this->get_settings();
        $title         = !empty( $settings['about_title'] ) ? $settings['about_title'] : '';		
        $content       = !empty( $settings['content'] ) ? $settings['content'] : '';
        $right_img     = !empty( $settings['img_right']['id'] ) ? wp_get_attachment_image( $settings['img_right']['id'], 'boxe_about_img_877x678', false, array( 'alt' => 'about image right' ) ) : '';
        $dynamic_class = is_front_page() ? 'section_padding' : 'single_about_padding';
        ?>

    <!-- about part start-->
    <section class="about_part <?php echo $dynamic_class?>">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="about_part_img">
                        <h2><?php echo esc_html( $title )?></h2>
                        <?php
                            if( $right_img ){
                                echo wp_kses_post( $right_img );
                            }
                        ?>
                    </div>
                </div>
                <div class="col-lg-7">
                    <div class="about_part_text">
                        <div class="about_text_iner">
                            <?php
                                //Content ==============
                                if( $content ){
                                    echo wp_kses_post( wpautop( $content ) );
                                }
                            ?>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
    <!-- about part end-->
    <?php

    }

}
