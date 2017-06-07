 (function($){
	$.fn.styleddropdown = function(){
		return this.each(function(){
			var obj = $(this)
			obj.find(".field").click(function() {
			obj.find(".list").fadeIn(400);

			$(document).keyup(function(event) {
				if(event.keyCode == 27) { //press escape
				obj.find(".list").fadeOut(400);
				}
			});

			obj.find(".list").hover(function(){ },
				function(){
					$(this).fadeOut(400);
				});
			});

			obj.find(".list li").click(function() {
				console.log("I clickd");
			obj.find(".list").fadeOut(400);
			});
		});
	};
})(jQuery);

$(function(){
	$(".size").styleddropdown();
});

$(function(){
    if ($("#navbarSupportedContent").attr("aria-expanded")=="true")
        {
            console.log("I flipped the bar");
            $("#greyNavbar").toggleClass("hidden-md-down");
        }
});
