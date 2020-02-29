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
class Boxe_Delivery_Process extends Widget_Base {

	public function get_name() {
		return 'boxe-delivery-process';
	}

	public function get_title() {
		return __( 'Delivery Process', 'boxe' );
	}

	public function get_icon() {
		return 'eicon-sign-out';
	}

	public function get_categories() {
		return [ 'boxe-elements' ];
	}

	protected function _register_controls() {
        
		// ----------------------------------------   Delivery Process content ------------------------------
		$this->start_controls_section(
			'delivery_process_block',
			[
				'label' => __( 'Delivery Process', 'boxe' ),
			]
        );

        $this->add_control(
			'section_title_first', [
				'label'         => esc_html__( 'Section Title First', 'boxe' ),
				'type'          => Controls_Manager::TEXT,
				'default'       => __( 'World Wide', 'boxe' )
			]
		);
        $this->add_control(
			'section_title_sec', [
				'label'         => esc_html__( 'Section Title Second', 'boxe' ),
				'type'          => Controls_Manager::TEXT,
				'default'       => __( 'Deliveries Process', 'boxe' )
			]
        );
        $this->add_control(
            'short_txt',
            [
                'label'         => esc_html__( 'Short Text', 'boxe' ),
                'description'   => esc_html__('Use <br> tag for line break', 'boxe'),
                'type'          => Controls_Manager::TEXTAREA,
                'label_block'   => true,
                'default'       => __( 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed', 'boxe' )
            ]
        );
        
		$this->add_control(
            'delivery_content', [
                'label' => __( 'Create New Item', 'boxe' ),
                'type'  => Controls_Manager::REPEATER,
                'title_field' => '{{{ del_title }}}',
                'fields' => [
                    [
                        'name'  => 'del_icon',
                        'label' => __( 'Delivery Icon', 'boxe' ),
                        'type'  => Controls_Manager::SELECT,
                        'label_block' => true,
                        'default' => 'delivery_icon1',
                        'options' => [
                            'delivery_icon1' => __( 'Delivery Icon 1', 'boxe' ),
                            'delivery_icon2' => __( 'Delivery Icon 2', 'boxe' ),
                            'delivery_icon3' => __( 'Delivery Icon 3', 'boxe' ),
                            'delivery_icon4' => __( 'Delivery Icon 4', 'boxe' ),
                        ]
                    ],
                    [
                        'name'  => 'del_title',
                        'label' => __( 'Delivery Title', 'boxe' ),
                        'type'  => Controls_Manager::TEXT,
                        'label_block' => true,
                        'default' => __( 'Trucks 50%', 'boxe' )
                    ],
                    [
                        'name'      => 'del_desc',
                        'label'     => __( 'Delivery Text', 'boxe' ),
                        'type'      => Controls_Manager::TEXTAREA,
                        'default'   => __( 'lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore', 'boxe' )
                    ]
                ],
            ]
        );

		$this->end_controls_section(); // End Deliverys content

        /**
         * Style Tab
         * ------------------------------ Style Tab Content ------------------------------
         *
         */

        // Single Delivery Color Settings ==============================
        $this->start_controls_section(
            'del_color_sett', [
                'label' => __( 'Delivery Color Settings', 'boxe' ),
                'tab' => Controls_Manager::TAB_STYLE,
            ]
        );

        $this->add_control(
            'sec_title_color', [
                'label'     => __( 'Section Title Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .deliverie_process .section_tittle h2' => 'color: {{VALUE}};',
                ],
            ]
        ); 

        $this->add_control(
            'sec_txt_color', [
                'label'     => __( 'Section Text Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .deliverie_process .section_tittle p' => 'color: {{VALUE}};',
                ],
            ]
        ); 

        $this->add_control(
            'sing_item_icon_color', [
                'label'     => __( 'Single Item Icon Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .single_deliverie_process svg path' => 'fill: {{VALUE}};',
                ],
            ]
        ); 

        $this->add_control(
            'sing_item_title_color', [
                'label'     => __( 'Single Item Title Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .single_deliverie_process h4' => 'color: {{VALUE}};',
                ],
            ]
        ); 

        $this->add_control(
            'sing_item_txt_color', [
                'label'     => __( 'Single Item Text Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .single_deliverie_process p' => 'color: {{VALUE}};',
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
                'selector' => '{{WRAPPER}} .deliverie_process',
            ]
        );
        $this->end_controls_section();

	}

	protected function render() {    
    $settings            = $this->get_settings();
    $section_title_first = !empty( $settings['section_title_first'] ) ? $settings['section_title_first'] : '';
    $section_title_sec   = !empty( $settings['section_title_sec'] ) ? $settings['section_title_sec'] : '';
    $short_txt           = !empty( $settings['short_txt'] ) ? $settings['short_txt'] : '';
    $deliveries          = !empty( $settings['delivery_content'] ) ? $settings['delivery_content'] : '';
    ?>

    <!-- deliverie_process part start-->
    <section class="deliverie_process section_padding">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-7 col-sm-10">
                    <div class="section_tittle">
                        <h2>
                            <?php 
                                if ( $section_title_first ) {
                                    echo esc_html( $section_title_first );
                                }
                                if ( $section_title_sec ) {
                                    echo '<br>';
                                    echo '<span>' . esc_html( $section_title_sec ) . '</span>';
                                }
                            ?>
                        </h2>
                        <p><?php echo esc_html( $short_txt )?></p>
                    </div>
                </div>
            </div>
            <div class="row">
                <?php
                if( is_array( $deliveries ) && count( $deliveries ) > 0 ){
                    foreach ( $deliveries as $delivery ) {
                        $del_icon  = !empty( $delivery['del_icon'] ) ? $delivery['del_icon'] : '';
                        $del_title = !empty( $delivery['del_title'] ) ? $delivery['del_title'] : '';
                        $del_desc  = !empty( $delivery['del_desc'] ) ? $delivery['del_desc'] : '';
                ?>
                <div class="col-lg-3 col-sm-6">
                    <div class="single_deliverie_process">
                        <?php echo get_boxe_svg_icon( $del_icon )?>
                        <h4><?php echo esc_html( $del_title )?></h4>
                        <p><?php echo esc_html( $del_desc )?></p>
                    </div>
                </div>
                <?php
                    }
                }
                ?>
            </div>
        </div>
    </section>
    <!-- deliverie_process part end-->
    <?php
    }
}


