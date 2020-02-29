<?php
namespace Boxeelementor\Widgets;

use Elementor\Widget_Base;
use Elementor\Controls_Manager;
use Elementor\Group_Control_Typography;
use Elementor\Group_Control_Background;
use Elementor\Utils;



// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;  
}


/**
 *
 * Boxe elementor about us section widget.
 *
 * @since 1.0
 */
class Boxe_Banner extends Widget_Base {

	public function get_name() {
		return 'boxe-banner';
	}

	public function get_title() {
		return __( 'Banner', 'boxe' );
	}

	public function get_icon() {
		return 'eicon-banner';
	}

	public function get_categories() {
		return [ 'boxe-elements' ];
	}

	protected function _register_controls() {

        // ----------------------------------------  content ------------------------------
        $this->start_controls_section(
			'banner_contents',
			[
				'label' => __( 'Banner Contents', 'boxe' ),
			]
        );
        
        $this->add_control(
            'sec_heading',
            [
                'label'         => esc_html__( 'Heading Text', 'boxe' ),
                'type'          => Controls_Manager::WYSIWYG,
                'default'       => __( '<h1>Run on the <br>rocky streets</h1><p>Fast landing delivery <br>for your goods business </p>', 'boxe' )
            ]
        );
        
        $this->add_control(
            'int_phone',
            [
                'label'         => esc_html__( 'CF7 Shortcode for Phone Number', 'boxe' ),
                'type'          => Controls_Manager::TEXT,
                'label_block'   => true,
                'description'   => esc_html__( 'Please input the Contact Form7 Shortcode here.', 'boxe' ),
                'placeholder'   => '[contact-form-7 id="256" title="Banner Phone Number"]'
            ]
        );
        
        $this->add_control(
            'pickup_txt',
            [
                'label'         => esc_html__( 'Pickup text', 'boxe' ),
                'type'          => Controls_Manager::WYSIWYG,
                'default'       => __( '<p>Logistics World 2019</p><h3>Get Pick up Hear</h3>', 'boxe' )
            ]
        );
        
        $this->add_control(
            'pickup_url',
            [
                'label'         => esc_html__( 'Pickup URL', 'boxe' ),
                'type'          => Controls_Manager::URL,
                'default'       => [
                    'url'       => '#'
                ]
            ]
        );

		$this->end_controls_section(); // End Case Study content


        /**
         * Style Tab
         * ------------------------------ Banner Style ------------------------------
         *
         */

        // Heading Style ==============================
        $this->start_controls_section(
            'color_sect', [
                'label' => __( 'Banner Styles', 'boxe' ),
                'tab' => Controls_Manager::TAB_STYLE,
            ]
        );
        $this->add_control(
            'ban_big_title_color', [
                'label'     => __( 'Banner Big Title Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .banner_part .banner_text h1' => 'color: {{VALUE}};',
                ],
            ]
        );    
        $this->add_control(
            'ban_title_color', [
                'label'     => __( 'Banner Small Title Color', 'boxe' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .banner_part .banner_text p' => 'color: {{VALUE}};',
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
                'selector' => '{{WRAPPER}} .banner_part',
            ]
        );
        $this->end_controls_section();

	}

	protected function render() {
        $settings    = $this->get_settings();        
        $sec_heading = !empty( $settings['sec_heading'] ) ? $settings['sec_heading'] : '';
        $int_phone   = !empty( $settings['int_phone'] ) ? $settings['int_phone'] : '';
        $pickup_txt  = !empty( $settings['pickup_txt'] ) ? $settings['pickup_txt'] : '';
        $pickup_url  = !empty( $settings['pickup_url']['url'] ) ? $settings['pickup_url']['url'] : '';
    ?>

    <!-- banner part start-->
    <section class="banner_part">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6">
                    <div class="banner_text">
                        <div class="banner_text_iner">
                            <?php
                                //Banner Text ==============
                                if( $sec_heading ){
                                    echo wp_kses_post( wpautop( $sec_heading ) );
                                }

                                //International Phone shortcode ==============
                                if( $int_phone ){
                                    echo do_shortcode( $int_phone );
                                }
                            ?>
                        </div>
                    </div>
                </div>
                <div class="pick_up_text">
                    <div class="pickup_text_iner">
                        <?php
                            //Pickup Text ==============
                            if( $pickup_txt ){
                                echo wp_kses_post( wpautop( $pickup_txt ) );
                            }
                        ?>
                    </div>
                    <div class="pickup_text_arrow">
                        <a href="<?php echo esc_url( $pickup_url )?>"><?php echo get_boxe_svg_icon()?></a>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- banner part start-->
    <?php
    }
	
}


