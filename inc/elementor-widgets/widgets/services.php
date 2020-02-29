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
class Boxe_Services extends Widget_Base {

	public function get_name() {
		return 'boxe-services';
	}

	public function get_title() {
		return __( 'Services', 'boxe' );
	}

	public function get_icon() {
		return 'eicon-info-box';
	}

	public function get_categories() {
		return [ 'boxe-elements' ];
	}

	protected function _register_controls() {
        
		// ----------------------------------------   Services content ------------------------------
		$this->start_controls_section(
			'services_block',
			[
				'label' => __( 'Services', 'boxe' ),
			]
        );

        $this->add_control(
			'section_title_first', [
				'label'         => esc_html__( 'Section Title First', 'boxe' ),
				'type'          => Controls_Manager::TEXT,
				'default'       => __( 'Boxe Best', 'boxe' )
			]
		);
        $this->add_control(
			'section_title_sec', [
				'label'         => esc_html__( 'Section Title Second', 'boxe' ),
				'type'          => Controls_Manager::TEXT,
				'default'       => __( 'Deliverie Services', 'boxe' )
			]
        );
        $this->add_control(
            'content',
            [
                'label'         => esc_html__( 'Service Text', 'boxe' ),
                'description'   => esc_html__('Use <br> tag for line break', 'boxe'),
                'type'          => Controls_Manager::WYSIWYG,
                'label_block'   => true,
                'default'       => __( '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra Lorem ipsum dolor sit amet, consectetur adipiscing</p><p>sedeiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra Lorem ipsum dolor sit amet, </p>', 'boxe' )
            ]
        );
        $this->add_control(
            'btn_txt',
            [
                'label'         => esc_html__( 'Button text', 'boxe' ),
                'type'          => Controls_Manager::TEXT,
                'default'       => __( 'learn more', 'boxe' )
            ]
        );
        
        $this->add_control(
            'btn_url',
            [
                'label'         => esc_html__( 'Button URL', 'boxe' ),
                'type'          => Controls_Manager::URL,
                'default'       => [
                    'url'       => '#'
                ]
            ]
        );
        
		$this->add_control(
            'services_content', [
                'label' => __( 'Create Service Item', 'boxe' ),
                'type'  => Controls_Manager::REPEATER,
                'title_field' => '{{{ serv_title }}}',
                'fields' => [
                    [
                        'name'  => 'serv_icon',
                        'label' => __( 'Service Icon', 'boxe' ),
                        'type'  => Controls_Manager::SELECT,
                        'label_block' => true,
                        'default' => 'service_icon1',
                        'options' => [
                            'service_icon1' => __('Service Icon 1', 'boxe'),
                            'service_icon2' => __('Service Icon 2', 'boxe'),
                            'service_icon3' => __('Service Icon 3', 'boxe'),
                            'service_icon4' => __('Service Icon 4', 'boxe'),
                        ]
                    ],
                    [
                        'name'  => 'serv_title',
                        'label' => __( 'Service Title', 'boxe' ),
                        'type'  => Controls_Manager::TEXT,
                        'label_block' => true,
                        'default' => __( 'Planning', 'boxe' )
                    ],
                    [
                        'name'      => 'serv_desc',
                        'label'     => __( 'Service Text', 'boxe' ),
                        'type'      => Controls_Manager::TEXTAREA,
                        'default'   => __( 'lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore', 'boxe' )
                    ]
                ],
            ]
        );

		$this->end_controls_section(); // End Services content

        /**
         * Style Tab
         * ------------------------------ Style Tab Content ------------------------------
         *
         */

        // Single Service Color Settings ==============================
        $this->start_controls_section(
            'serv_color_sett', [
                'label' => __( 'Service Color Settings', 'boxe' ),
                'tab' => Controls_Manager::TAB_STYLE,
            ]
        );

        $this->add_control(
            'sec_title_color', [
                'label'     => __( 'Section Title Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .service_part .service_text h2' => 'color: {{VALUE}};',
                ],
            ]
        ); 

        $this->add_control(
            'sec_txt_color', [
                'label'     => __( 'Section Text Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .service_part .service_text p' => 'color: {{VALUE}};',
                ],
            ]
        ); 

        $this->add_control(
            'sing_item_icon_color', [
                'label'     => __( 'Single Item Icon Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .service_part .single_service_text svg path' => 'fill: {{VALUE}};',
                ],
            ]
        ); 

        $this->add_control(
            'sing_item_title_color', [
                'label'     => __( 'Single Item Title Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .service_part .single_service_text h4' => 'color: {{VALUE}};',
                ],
            ]
        ); 

        $this->add_control(
            'sing_item_txt_color', [
                'label'     => __( 'Single Item Text Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .service_part .single_service_text p' => 'color: {{VALUE}};',
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
                    '{{WRAPPER}} .service_part .service_text .btn_1' => 'background-color: {{VALUE}};',
                ],
            ]
        ); 
        $this->add_control(
            'btn_txt_color', [
                'label'     => __( 'Button Text Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .service_part .service_text .btn_1' => 'color: {{VALUE}};',
                ],
            ]
        ); 
        $this->add_control(
            'btn_hvr_bg_color', [
                'label'     => __( 'Button Hover BG Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .service_part .service_text .btn_1:hover' => 'background-color: {{VALUE}};',
                ],
            ]
        ); 
        $this->add_control(
            'btn_hvr_txt_color', [
                'label'     => __( 'Button Hover Text Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .service_part .service_text .btn_1:hover' => 'color: {{VALUE}};',
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
                'selector' => '{{WRAPPER}} .service_part',
            ]
        );
        $this->end_controls_section();

	}

	protected function render() {    
    $settings            = $this->get_settings();
    $section_title_first = !empty( $settings['section_title_first'] ) ? $settings['section_title_first'] : '';
    $section_title_sec   = !empty( $settings['section_title_sec'] ) ? $settings['section_title_sec'] : '';
    $content             = !empty( $settings['content'] ) ? $settings['content'] : '';
    $btn_txt             = !empty( $settings['btn_txt'] ) ? $settings['btn_txt'] : '';
    $btn_url             = !empty( $settings['btn_url']['url'] ) ? $settings['btn_url']['url'] : '';
    $services            = !empty( $settings['services_content'] ) ? $settings['services_content'] : '';
    $dynamic_class       = is_front_page() ? '' : ' single_page_service';
    ?>

    <!-- Service part start-->
    <section class="service_part<?php echo $dynamic_class?>">
        <div class="container">
            <div class="row justify-content-between">
                <div class="col-lg-5">
                    <div class="service_text">
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

                        <?php 
                            if ( $content ) {
                                echo wp_kses_post( wpautop( $content ) );
                            }
                            if ( $btn_txt ) {
                                echo '<a href="'. esc_url( $btn_url ) .'" class="btn_1">'. esc_html( $btn_txt ) .'</a>';
                            }
                        ?>
                    </div>
                </div>
                <div class="col-lg-6">
                    <?php
                    if( is_array( $services ) && count( $services ) > 0 ){
                        $count = 0;
                        foreach ( $services as $service ) {
                            $service_icon  = !empty( $service['serv_icon'] ) ? $service['serv_icon'] : '';
                            $service_title = !empty( $service['serv_title'] ) ? $service['serv_title'] : '';
                            $service_desc  = !empty( $service['serv_desc'] ) ? $service['serv_desc'] : '';
                    ?>
                    <div class="single_service_text">
                        <?php echo get_boxe_svg_icon( $service_icon )?>
                        <h4><?php echo esc_html( $service_title )?></h4>
                        <p><?php echo esc_html( $service_desc )?></p>
                    </div>
                    <?php
                        }
                    }
                    ?>
                </div>
            </div>
        </div>
    </section>
    <!-- Service part end-->
    <?php
    }
}


