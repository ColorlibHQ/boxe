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
 * Boxe elementor Team Member section widget.
 *
 * @since 1.0
 */
class Boxe_Testimonial extends Widget_Base {

	public function get_name() {
		return 'boxe-testimonials';
	}

	public function get_title() {
		return __( 'Testimonial', 'boxe' );
	}

	public function get_icon() {
		return 'eicon-slides';
	}

	public function get_categories() {
		return [ 'boxe-elements' ];
	}

	protected function _register_controls() {
        
		// ----------------------------------------   Testimonial content ------------------------------
		$this->start_controls_section(
			'testimonial_block',
			[
				'label' => __( 'Testimonial', 'boxe' ),
			]
        );

        $this->add_control(
			'section_title', [
				'label'         => esc_html__( 'Section Title', 'boxe' ),
				'type'          => Controls_Manager::TEXT,
				'default'       => __( 'Happy Clients', 'boxe' )
			]
		);
        
		$this->add_control(
            'testimonials_content', [
                'label' => __( 'Create Testimonial Item', 'boxe' ),
                'type'  => Controls_Manager::REPEATER,
                'title_field' => '{{{ client_name }}}',
                'fields' => [
                    [
                        'name'  => 'client_img',
                        'label' => __( 'Client Image', 'boxe' ),
                        'type'  => Controls_Manager::MEDIA,
                        'label_block' => true
                    ],
                    [
                        'name'      => 'client_review',
                        'label'     => __( 'Client Review', 'boxe' ),
                        'type'      => Controls_Manager::TEXTAREA,
                        'default'   => __( 'Give dry stars form. Us called an won\'t winged had land cru abundantly land Midst', 'boxe' )
                    ],
                    [
                        'name'  => 'client_name',
                        'label' => __( 'Client Name', 'boxe' ),
                        'type'  => Controls_Manager::TEXT,
                        'label_block' => true,
                        'default' => __( 'Danyel Yarde', 'boxe' )
                    ],
                    [
                        'name'  => 'client_des',
                        'label' => __( 'Client Designation', 'boxe' ),
                        'type'  => Controls_Manager::TEXT,
                        'label_block' => true,
                        'default' => __( 'CEO & Founder', 'boxe' )
                    ],
                ],
            ]
        );

		$this->end_controls_section(); // End Testimonial content

        /**
         * Style Tab
         * ------------------------------ Style Tab Content ------------------------------
         *
         */

        // Single Testimonial Color Settings ==============================
        $this->start_controls_section(
            'del_color_sett', [
                'label' => __( 'Color Settings', 'boxe' ),
                'tab' => Controls_Manager::TAB_STYLE,
            ]
        );

        $this->add_control(
            'sec_title_color', [
                'label'     => __( 'Section Title Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .client_review .deliveries_tittle h2' => 'color: {{VALUE}};',
                ],
            ]
        ); 

        $this->add_control(
            'review_color', [
                'label'     => __( 'Client Review Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .client_review .single_deliveries_text_iner p' => 'color: {{VALUE}};',
                ],
            ]
        ); 

        $this->add_control(
            'client_name_color', [
                'label'     => __( 'Client Name Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .client_review .single_deliveries_text_iner h5' => 'color: {{VALUE}};',
                ],
            ]
        ); 

        $this->add_control(
            'client_des_color', [
                'label'     => __( 'Client Designation Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .client_review .single_deliveries_text_iner span' => 'color: {{VALUE}};',
                ],
            ]
        ); 

        $this->add_control(
            'item_bg_color', [
                'label'     => __( 'Item BG Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .client_review .single_deliveries .single_deliveries_text' => 'background-color: {{VALUE}};',
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
        $this->add_group_control(
            Group_Control_Background::get_type(),
            [
                'name' => 'sectionbg',
                'label' => __( 'Background', 'boxe' ),
                'types' => [ 'classic' ],
                'selector' => '{{WRAPPER}} .client_review',
            ]
        );
        $this->end_controls_section();

	}

	protected function render() {    
        
    // call load widget script
    $this->load_widget_script();

    $settings      = $this->get_settings();
    $section_title = !empty( $settings['section_title'] ) ? $settings['section_title'] : '';
    $testimonials    = !empty( $settings['testimonials_content'] ) ? $settings['testimonials_content'] : '';
    ?>

    <!--::resent testimonials start::-->
    <section class="client_review deliveries_part section_padding">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="deliveries_tittle">
                        <h2><?php echo esc_html( $section_title )?></h2>
                    </div>
                </div>
                <div class="col-lg-12">
                    <div class="deliveries_slider owl-carousel">
                        <?php
                        if( is_array( $testimonials ) && count( $testimonials ) > 0 ){ 
                            foreach ( $testimonials as $testimonial ) {
                                $client_img   = !empty( $testimonial['client_img']['id'] ) ? wp_get_attachment_image( $testimonial['client_img']['id'], 'boxe_widget_post_thumb', false, array( 'alt' => 'client image' ) ) : '';
                                $client_review  = !empty( $testimonial['client_review'] ) ? $testimonial['client_review'] : '';
                                $client_name = !empty( $testimonial['client_name'] ) ? $testimonial['client_name'] : '';
                                $client_des = !empty( $testimonial['client_des'] ) ? $testimonial['client_des'] : '';
                        ?>
                        <div class="single_deliveries">
                            <div class="single_deliveries_text">
                                <div class="single_deliveries_text_iner">
                                    <?php
                                        if( $client_img ){
                                            echo wp_kses_post( $client_img );
                                        }
                                    ?>
                                    <p><?php echo esc_html( $client_review )?></p>
                                    <h5><?php echo esc_html( $client_name )?></h5>
                                    <span><?php echo esc_html( $client_des )?></span>
                                </div>
                            </div>
                        </div>
                        <?php
                            }
                        }
                        ?>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!--::resent deliveries end::-->
    <?php
    }

    public function load_widget_script(){
        if( \Elementor\Plugin::$instance->editor->is_edit_mode() === true  ) {
        ?>
        <script>
        ( function( $ ){
            $(document).ready(function() {
                // delivery slide js code
                var deliveries = $('.deliveries_slider');
                if (deliveries.length) {
                deliveries.owlCarousel({
                    items: 3,
                    loop: true,
                    dots: false,
                    autoplay: true,
                    autoplayHoverPause: true,
                    autoplayTimeout: 5000,
                    nav: true,
                    smartSpeed: 2000,
                    margin: 30,
                    navText: [
                    '<i class="flaticon-left-arrow"></i>',
                    '<i class="flaticon-right-arrow"></i>'
                    ],
                    responsive: {
                    0: {
                        nav: false,
                        items: 1,
                    },
                    768: {
                        nav: true,
                        items: 2,
                    },
                    992: {
                        nav: true,
                        items: 3,
                    }
                    }
                });
                }
            });
        })(jQuery);
        </script>
        <?php 
        }
    }
}