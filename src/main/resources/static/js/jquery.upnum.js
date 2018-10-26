(function ($) {
    $.fn.UpNum = function (num, callback, font_size,z_index) {
        return this.each(function () {
            var _p = $(this).offset();
            var _x = Math.round(_p.left) + "px";
            var _y = Math.round(_p.top) + "px";
            if (num.toString().indexOf("-") == 0) {
                var _y1 = Math.round(_p.top) + 30 + "px";
            } else {
                var _y1 = Math.round(_p.top) - 30 + "px";
            }
            var fs = "20px";
            if (font_size)fs = font_size;
            z_index = z_index || "120";
            var _m = num || $(this).attr("money");
            $("<div/>").appendTo($("body")).addClass("numeric").css({position:"absolute", top:_y, left:_x, color:(num.toString().indexOf("-") == 0) ? "#333" : "red", "fontFamily":"Georgia", "fontSize":fs, "zIndex":z_index}).html(_m)
                .animate({ top:_y1 }, {duration:1000, complete:function () {
                    $(this).remove();
                    if (callback) {
                        callback();
                    }
                }});
        });
    };

    if(window.M && typeof M.define == 'function') {
        M.define('jq-upnum', function() {
            return jQuery;
        });
    }
})(jQuery);
