/* beautify ignore:start */
@@include('../../node_modules/jquery/dist/jquery.min.js')
@@include('../../node_modules/slick-carousel/slick/slick.min.js')
/* beautify ignore:end */

document.addEventListener('DOMContentLoaded', () => {
	$('#main-slider').slick({
		arrows: false,
		dots: true,
		appendDots: $('.main-slider'),
	});
	$('.item-slider').slick({
		slidesToShow: 4,
	});
})