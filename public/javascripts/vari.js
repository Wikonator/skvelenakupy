var listItem = $(".variantListItem"),
    cartColor = $("#cartColor").attr("value");

$(".variantListItem").on("click", function () {
  listItem.removeClass("variantSelected");
  $(this).addClass("variantSelected");
  var img = $(this).attr("imageData"),
      color = $(this).attr("variantData");
      console.log(color);
  $("#imageItemView").attr("src", img);
  cartColor = $("#cartColor").attr("value", color);
})
