$('document').ready(function(){
	$('.faq__title').on('click', function(event){
  	$(this).toggleClass('open').next().slideToggle(500);
	});

	$('.menu-button').on('click', function () {
			$('.menu-button').toggleClass("active");
			$('.nav-tab').toggleClass("active");
	});

	$('.slider').slick({
		dots: true,
		arrows: false,
		slidesToShow: 1
	})

	$('.hits__slider').slick({
		swipeToSlide:  true,
		prevArrow: '<div class="slide__arrow-prev"></div>',
		nextArrow: '<div class="slide__arrow-next"></div>',
		slidesToShow: 4,
		responsive:[
		{
			breakpoint: 1000,
			settings: {
				slidesToShow: 4
			}
		},
		{
			breakpoint: 750,
			settings: {
				slidesToShow: 3
			}
		},
		{
			breakpoint: 550,
			settings: {
				slidesToShow: 2
			}
		}
		] 
	})
});