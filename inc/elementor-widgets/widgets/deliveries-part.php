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
class Boxe_Deliveries_Part extends Widget_Base {

	public function get_name() {
		return 'boxe-deliveries';
	}

	public function get_title() {
		return __( 'Deliveries', 'boxe' );
	}

	public function get_icon() {
		return 'eicon-arrow-right';
	}

	public function get_categories() {
		return [ 'boxe-elements' ];
	}

	protected function _register_controls() {
        
		// ----------------------------------------   Deliveries content ------------------------------
		$this->start_controls_section(
			'deliveries_block',
			[
				'label' => __( 'Deliveries', 'boxe' ),
			]
        );

        $this->add_control(
			'section_title', [
				'label'         => esc_html__( 'Section Title', 'boxe' ),
				'type'          => Controls_Manager::TEXT,
				'default'       => __( 'Recent Deliveries', 'boxe' )
			]
		);
        
		$this->add_control(
            'deliveries_content', [
                'label' => __( 'Create Delivery Item', 'boxe' ),
                'type'  => Controls_Manager::REPEATER,
                'title_field' => '{{{ del_title }}}',
                'fields' => [
                    [
                        'name'  => 'del_title',
                        'label' => __( 'Delivery Title', 'boxe' ),
                        'type'  => Controls_Manager::TEXT,
                        'label_block' => true,
                        'default' => __( 'World Corgo', 'boxe' )
                    ],
                    [
                        'name'  => 'del_img',
                        'label' => __( 'Delivery Image', 'boxe' ),
                        'type'  => Controls_Manager::MEDIA,
                        'label_block' => true
                    ],
                    [
                        'name'      => 'del_desc',
                        'label'     => __( 'Delivery Text', 'boxe' ),
                        'type'      => Controls_Manager::WYSIWYG,
                        'default'   => __( '<p>324 King Heaven tower, House no
                        Melbourne ,VIC-222, Australia</p>
                    <p>324 King Heaven tower, House no
                        Melbourne ,VIC-222, Australia</p>', 'boxe' )
                    ]
                ],
            ]
        );

		$this->end_controls_section(); // End Deliveries content

        /**
         * Style Tab
         * ------------------------------ Style Tab Content ------------------------------
         *
         */

        // Single Delivery Color Settings ==============================
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
                    '{{WRAPPER}} .deliveries_part .deliveries_tittle h2' => 'color: {{VALUE}};',
                ],
            ]
        ); 

        $this->add_control(
            'sing_item_title_color', [
                'label'     => __( 'Single Item Title Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .deliveries_part .single_deliveries .single_deliveries_text h3' => 'color: {{VALUE}};',
                ],
            ]
        ); 

        $this->add_control(
            'sing_item_txt_color', [
                'label'     => __( 'Single Item Text Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .deliveries_part .single_deliveries .single_deliveries_text .single_deliveries_text_iner p' => 'color: {{VALUE}};',
                ],
            ]
        ); 

        $this->add_control(
            'sing_item_bg_color', [
                'label'     => __( 'Single Item BG Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .deliveries_part .single_deliveries .single_deliveries_text' => 'background-color: {{VALUE}};',
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
                'selector' => '{{WRAPPER}} .deliveries_part',
            ]
        );
        $this->end_controls_section();

	}

	protected function render() {    
        
    // call load widget script
    $this->load_widget_script();

    $settings      = $this->get_settings();
    $section_title = !empty( $settings['section_title'] ) ? $settings['section_title'] : '';
    $deliveries    = !empty( $settings['deliveries_content'] ) ? $settings['deliveries_content'] : '';
    $del_pin_img   = BOXE_DIR_ASSETS_URI . 'img/deliveries_img.png';
    $dynamic_class = is_front_page() ? 'section_padding' : 'padding_top';
    ?>

    <!--::resent deliveries start::-->
    <section class="deliveries_part <?php echo $dynamic_class?>">
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
                        if( is_array( $deliveries ) && count( $deliveries ) > 0 ){
                            $count = 0;
                            foreach ( $deliveries as $delivery ) {
                                $del_title = !empty( $delivery['del_title'] ) ? $delivery['del_title'] : '';
                                $del_img   = !empty( $delivery['del_img']['id'] ) ? wp_get_attachment_image( $delivery['del_img']['id'], 'boxe_delivery_img_360x241', false, array( 'alt' => 'delivery image' ) ) : '';
                                $del_desc  = !empty( $delivery['del_desc'] ) ? $delivery['del_desc'] : '';
                        ?>
                        <div class="single_deliveries">
                            <?php
                                echo $del_img;
                            ?>
                            <div class="single_deliveries_text">
                                <h3><?php echo esc_html( $del_title )?></h3>
                                <div class="single_deliveries_text_iner">
                                    <?php echo '<img src="' . $del_pin_img . '" alt="delivery pin image">';?>
                                    <p><?php echo wp_kses_post( wpautop( $del_desc ) )?></p>
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