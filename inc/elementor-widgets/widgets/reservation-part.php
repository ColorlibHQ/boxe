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
class Boxe_Reservation_Part extends Widget_Base {

	public function get_name() {
		return 'boxe-reservation-part';
	}

	public function get_title() {
		return __( 'Reservation Part', 'boxe' );
	}

	public function get_icon() {
		return 'eicon-calendar';
	}

	public function get_categories() {
		return [ 'boxe-elements' ];
	}

	protected function _register_controls() {

        
		// ----------------------------------------  Reservation content ------------------------------
		$this->start_controls_section(
			'reservation_content',
			[
				'label' => __( 'Reservation Section', 'boxe' ),
			]
        );
        
        $this->add_control(
            'sec_left_title',
            [
                'label'         => esc_html__( 'Section Left Title', 'boxe' ),
                'type'          => Controls_Manager::TEXT,
                'label_block'   => true,
                'default'       => esc_html__( 'Get A Quote', 'boxe' )
            ]
        );
        
        $this->add_control(
            'quote_shortcode',
            [
                'label'         => esc_html__( 'Quote Shortcode', 'boxe' ),
                'type'          => Controls_Manager::TEXT,
                'label_block'   => true,
                'placeholder'   => '[contact-form-7 id="308" title="Get A Quote"]'
            ]
        );

        $this->end_controls_section(); // End Reservation content

        // Right section
        $this->start_controls_section(
			'right_content',
			[
				'label' => __( 'Right Section', 'boxe' ),
			]
        );

        $this->add_control(
            'sec_right_title',
            [
                'label'         => esc_html__( 'Section Right Title', 'boxe' ),
                'type'          => Controls_Manager::TEXT,
                'label_block'   => true,
                'default'       => esc_html__( 'Are You A Sender?', 'boxe' )
            ]
        );

        $this->add_control(
            'right_txt',
            [
                'label'         => esc_html__( 'Section Right Text', 'boxe' ),
                'type'          => Controls_Manager::TEXTAREA,
                'label_block'   => true,
                'default'       => esc_html__( 'abore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip. Labore et dolore magna aliqua.', 'boxe' )
            ]
        );

        $this->add_control(
            'right_btn_txt',
            [
                'label'         => esc_html__( 'Right Button Text', 'boxe' ),
                'type'          => Controls_Manager::TEXT,
                'label_block'   => true,
                'default'       => esc_html__( 'check now', 'boxe' )
            ]
        );

        $this->add_control(
            'right_btn_url',
            [
                'label'         => esc_html__( 'Right Button URL', 'boxe' ),
                'type'          => Controls_Manager::URL,
                'label_block'   => true,
                'default'       => [
                    'url'       => '#'
                ]
            ]
        );
        
        $this->end_controls_section(); // End Right section content
        

        /**
         * Style Tab
         * ------------------------------ Reservation Style Settings ------------------------------
         *
         */

        // Color Settings ==============================
        $this->start_controls_section(
            'color_sect', [
                'label' => __( 'Left Color Settings', 'boxe' ),
                'tab' => Controls_Manager::TAB_STYLE,
            ]
        );
		$this->add_control(
			'left_title_color', [
				'label'     => __( 'Left Section Title Color', 'boxe' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .regervation_part .regervation_part_iner h2' => 'color: {{VALUE}};',
				],
			]
		);
		$this->add_control(
			'left_bg_color', [
				'label'     => __( 'Left BG Color', 'boxe' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .regervation_part' => 'background-color: {{VALUE}};',
				],
			]
		);
		
        $this->end_controls_section();

        // Right Section Color Settings ==============================
        $this->start_controls_section(
            'right_color_sect', [
                'label' => __( 'Right Section Color Settings', 'boxe' ),
                'tab' => Controls_Manager::TAB_STYLE,
            ]
        );
		$this->add_control(
			'right_title_color', [
				'label'     => __( 'Right Section Title Color', 'boxe' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .regervation_part .reservation_text h2' => 'color: {{VALUE}};',
				],
			]
		);
		$this->add_control(
			'right_txt_color', [
				'label'     => __( 'Right Text Color', 'boxe' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .regervation_part .reservation_text p' => 'color: {{VALUE}};',
				],
			]
		);
		
        $this->end_controls_section();

        
        // Left Button Style ==============================
        $this->start_controls_section(
            'button_styles', [
                'label' => __( 'Left Button Style', 'boxe' ),
                'tab' => Controls_Manager::TAB_STYLE,
            ]
        );
        $this->add_control(
            'btn_bg_color', [
                'label'     => __( 'Button BG Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .regervation_part .regervation_part_iner .btn_1' => 'background-color: {{VALUE}};',
                ],
            ]
        ); 
        $this->add_control(
            'btn_txt_color', [
                'label'     => __( 'Button Text Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .regervation_part .regervation_part_iner .btn_1' => 'color: {{VALUE}}!important;',
                ],
            ]
        ); 
        $this->add_control(
            'btn_hvr_bg_color', [
                'label'     => __( 'Button Hover BG Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .regervation_part .regervation_part_iner .btn_1:hover' => 'background-color: {{VALUE}};',
                ],
            ]
        ); 
        $this->add_control(
            'btn_hvr_txt_color', [
                'label'     => __( 'Button Hover Text Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .regervation_part .regervation_part_iner .btn_1:hover' => 'color: {{VALUE}}!important;',
                ],
            ]
        ); 
        $this->end_controls_section();
        
        // Right Button Style ==============================
        $this->start_controls_section(
            'right_button_styles', [
                'label' => __( 'Right Button Style', 'boxe' ),
                'tab' => Controls_Manager::TAB_STYLE,
            ]
        );
        $this->add_control(
            'right_btn_bg_color', [
                'label'     => __( 'Button BG Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .regervation_part .reservation_text .btn_1' => 'background-color: {{VALUE}};',
                ],
            ]
        ); 
        $this->add_control(
            'right_btn_txt_color', [
                'label'     => __( 'Button Text Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .regervation_part .reservation_text .btn_1' => 'color: {{VALUE}};',
                ],
            ]
        ); 
        $this->add_control(
            'right_btn_hvr_bg_color', [
                'label'     => __( 'Button Hover BG Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .regervation_part .reservation_text .btn_1:hover' => 'background-color: {{VALUE}};',
                ],
            ]
        ); 
        $this->add_control(
            'right_btn_hvr_txt_color', [
                'label'     => __( 'Button Hover Text Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .regervation_part .reservation_text .btn_1:hover' => 'color: {{VALUE}};',
                ],
            ]
        ); 
        $this->end_controls_section();
        

        /**
         * Style Tab
         * ------------------------------ Right Background Style ------------------------------
         *
         */
        $this->start_controls_section(
            'section_bg', [
                'label' => __( 'Style Background Right', 'boxe' ),
                'tab' => Controls_Manager::TAB_STYLE,
            ]
        );
        
        $this->add_control(
            'section_bgheading',
            [
                'label'     => __( 'Right Background Settings', 'boxe' ),
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
                'selector' => '{{WRAPPER}} .regervation_part:after',
            ]
        );

        $this->end_controls_section();


	}

	protected function render() {
        $settings        = $this->get_settings();
        $sec_left_title  = !empty( $settings['sec_left_title'] ) ? $settings['sec_left_title'] : '';		
        $quote_shortcode = !empty( $settings['quote_shortcode'] ) ? $settings['quote_shortcode'] : '';		
        $sec_right_title = !empty( $settings['sec_right_title'] ) ? $settings['sec_right_title'] : '';
        $right_txt       = !empty( $settings['right_txt'] ) ? $settings['right_txt'] : '';
        $right_btn_txt   = !empty( $settings['right_btn_txt'] ) ? $settings['right_btn_txt'] : '';
        $right_btn_url   = !empty( $settings['right_btn_url']['url'] ) ? $settings['right_btn_url']['url'] : '';
        ?>

    <!--::regervation_part start::-->
    <section class="regervation_part section_padding">
        <div class="container">
            <div class="row d-flex align-items-center justify-content-between">
                <div class="col-lg-5 col-md-6">
                    <div class="regervation_part_iner">
                        <h2><?php echo esc_html( $sec_left_title )?></h2>
                        <?php echo do_shortcode( $quote_shortcode )?>
                    </div>
                </div>
                <div class="col-lg-6 col-md-6">
                    <div class="reservation_text">
                        <h2><?php echo esc_html( $sec_right_title )?></h2>
                        <p><?php echo esc_html( $right_txt )?></p>
                        <a href="<?php echo esc_url( $right_btn_url )?>" class="btn_1"><?php echo esc_html( $right_btn_txt )?></a>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!--::regervation_part end::-->
    <?php

    }

}
