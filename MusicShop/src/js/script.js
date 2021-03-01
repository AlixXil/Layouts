/* beautify ignore:start */
@@include('../../node_modules/jquery/dist/jquery.min.js')
@@include('../../node_modules/slick-carousel/slick/slick.min.js')
/* beautify ignore:end */

document.addEventListener('DOMContentLoaded', () => {
	$('.burger-btn').on('click', () => {
		$('.burger-btn').toggleClass('active');
	});
	$('#main-slider').slick({
		arrows: false,
		dots: true,
		appendDots: $('.main-slider'),
	});
	$('.item-slider').slick({
		slidesToShow: 4,
		responsive: [{
			breakpoint: 1120,
			settings: {
				arrows: false
			}
		}, {
			breakpoint: 780,
			settings: {
				slidesToShow: 3,
				arrows: false
			}
		}, {
			breakpoint: 570,
			settings: {
				slidesToShow: 2,
				arrows: false
			}
		}, {
			breakpoint: 450,
			settings: {
				slidesToShow: 1,
				arrows: false
			}
		}]
	});

	$('.actions__list').slick({
		slidesToShow: 2,
		responsive: [{
			breakpoint: 1070,
			settings: {
				arrows: false
			}
		}, {
			breakpoint: 800,
			settings: {
				slidesToShow: 1,
				arrows: false
			}
		}]
	})
	$('.productions__list').slick({
		slidesToShow: 6,
		arrows: false,
		autoplay: true,
		delay: 100,
		responsive: [{
			breakpoint: 800,
			settings: {
				slidesToShow: 5
			}
		}, {
			breakpoint: 620,
			settings: {
				slidesToShow: 4
			}
		}, {
			breakpoint: 480,
			settings: {
				slidesToShow: 3
			}
		}, {
			breakpoint: 350,
			settings: {
				slidesToShow: 2
			}
		}]
	})
})