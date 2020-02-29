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
class Boxe_Cta_Part extends Widget_Base {

	public function get_name() {
		return 'boxe-cta-part';
	}

	public function get_title() {
		return __( 'CTA Part', 'boxe' );
	}

	public function get_icon() {
		return 'eicon-image-rollover';
	}

	public function get_categories() {
		return [ 'boxe-elements' ];
	}

	protected function _register_controls() {

        
		// ----------------------------------------  CTA content ------------------------------
		$this->start_controls_section(
			'cta_content',
			[
				'label' => __( 'CTA Section', 'boxe' ),
			]
        );
        
        $this->add_control(
            'cta_title',
            [
                'label'         => esc_html__( 'Section Title', 'boxe' ),
                'type'          => Controls_Manager::TEXT,
                'label_block'   => true,
                'default'       => esc_html__( 'International Truck Freight', 'boxe' )
            ]
        );

        $this->add_control(
            'cta_txt',
            [
                'label'         => esc_html__( 'Section Text', 'boxe' ),
                'type'          => Controls_Manager::TEXTAREA,
                'label_block'   => true,
                'default'       => esc_html__( 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'boxe' )
            ]
        );

        $this->add_control(
            'cta_btn_txt',
            [
                'label'         => esc_html__( 'Button Text', 'boxe' ),
                'type'          => Controls_Manager::TEXT,
                'label_block'   => true,
                'default'       => esc_html__( 'view all', 'boxe' )
            ]
        );

        $this->add_control(
            'cta_btn_url',
            [
                'label'         => esc_html__( 'Button URL', 'boxe' ),
                'type'          => Controls_Manager::URL,
                'label_block'   => true,
                'default'       => [
                    'url'       => '#'
                ]
            ]
        );
        
        $this->end_controls_section(); // End cta content
        

        /**
         * Style Tab
         * ------------------------------ CTA Style Settings ------------------------------
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
					'{{WRAPPER}} .cta_area h2' => 'color: {{VALUE}};',
				],
			]
		);
		$this->add_control(
			'text_color', [
				'label'     => __( 'Text Color', 'boxe' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .cta_area p' => 'color: {{VALUE}};',
				],
			]
		);
		
        $this->end_controls_section();

        
        // Button Style ==============================
        $this->start_controls_section(
            'button_styles', [
                'label' => __( 'Style Button', 'boxe' ),
                'tab' => Controls_Manager::TAB_STYLE,
            ]
        );
        $this->add_control(
            'btn_bg_color', [
                'label'     => __( 'Button BG Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .cta_area .cta_btn' => 'background-color: {{VALUE}};',
                ],
            ]
        ); 
        $this->add_control(
            'btn_txt_color', [
                'label'     => __( 'Button Text Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .cta_area .cta_btn' => 'color: {{VALUE}};',
                ],
            ]
        ); 
        $this->add_control(
            'btn_hvr_bg_color', [
                'label'     => __( 'Button Hover BG Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .cta_area .cta_btn:hover' => 'background-color: {{VALUE}};',
                ],
            ]
        ); 
        $this->add_control(
            'btn_hvr_txt_color', [
                'label'     => __( 'Button Hover Text Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .cta_area .cta_btn:hover' => 'color: {{VALUE}};',
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
                'selector' => '{{WRAPPER}} .cta_area',
            ]
        );

        $this->end_controls_section();


	}

	protected function render() {
        $settings     = $this->get_settings();
        $title        = !empty( $settings['cta_title'] ) ? $settings['cta_title'] : '';		
        $cta_txt      = !empty( $settings['cta_txt'] ) ? $settings['cta_txt'] : '';
        $cta_btn_txt  = !empty( $settings['cta_btn_txt'] ) ? $settings['cta_btn_txt'] : '';
        $cta_btn_url  = !empty( $settings['cta_btn_url']['url'] ) ? $settings['cta_btn_url']['url'] : '';
        ?>

    <!-- cta_part part start-->
    <section class="cta_area">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-7 col-md-8">
                    <div class="cta_text">
                        <h2><?php echo esc_html( $title )?></h2>
                        <p><?php echo esc_html( $cta_txt )?></p>
                        <a href="<?php echo esc_html( $cta_btn_url )?>" class="cta_btn btn_1"><?php echo esc_html( $cta_btn_txt )?></a>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- cta_part part end-->
    <?php

    }

}
