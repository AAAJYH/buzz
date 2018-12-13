(function(a) {
    a.fn.mfwSlide = function(b) {
        var c = a.extend({
            width: 216,
            height: 400,
            speed: 300,
            img_box: "",
            item: "ul>li",
            thumb_box: ".slide_tab",
            thumb_item: "li",
            prev_btn: "",
            next_btn: "",
            thumb_focus_class: "on",
            auto_play: true,
            interval: 10,
            btn_auto_hide: false,
            contain: true,
            always_play: false,
            thumb_overflow: "hidden",
            img_overflow: "hidden",
            step: function(d) {},
            mouse_over_stop: false
        }, b);
        return this.each(function() {
            var s = a(this),
                f = c.img_box == "" ? s : s.find(c.img_box),
                m = 0,
                g = 0,
                r = f.find(c.item).css("position", "absolute").width(c.width),
                j = r.length - 1,
                k = c.speed;
            f.css("position", "relative").css("overflow", c.img_overflow);
            r.each(function() {
                var i = a(this).children("img:only-child");
                if (i.size() == 1) {
                    i.width(c.width).height(c.height)
                }
            });
            if (c.btn_auto_hide == true) {
                a(c.next_btn).hide();
                a(c.prev_btn).hide();
                s.mouseenter(function() {
                    a(c.next_btn).show();
                    a(c.prev_btn).show()
                }).mouseleave(function() {
                    a(c.next_btn).hide();
                    a(c.prev_btn).hide()
                })
            }
            var h = function() {
                if (c.contain) {
                    return s.find(c.thumb_box)
                } else {
                    return a(c.thumb_box)
                }
            };
            var e = function() {
                if (c.thumb_box != "") {
                    var n = h();
                    var i = n.find(c.thumb_item);
                    i.filter("." + c.thumb_focus_class).removeClass(c.thumb_focus_class)
                }
            };
            var p = function(t) {
                if (c.thumb_box != "") {
                    var u = h();
                    var n = u.find(c.thumb_item);
                    n.eq(t).addClass(c.thumb_focus_class)
                }
                if (c.step) {
                    c.step(t)
                }
            };
            if (j > 0) {
                r.not(":first").css({
                    left: c.width + "px"
                });
                r.eq(j).css({
                    left: "-" + c.width + "px"
                });
                if (c.thumb_box != "") {
                    h().css("overflow", c.thumb_overflow);
                    p(0)
                }
                var l = function() {
                    if (!r.is(":animated") && r.data("slideStopFlag") != 1) {
                        r.eq(m).animate({
                            left: "-" + c.width + "px"
                        }, {
                            duration: k
                        });
                        e();
                        if (j == 1) {
                            r.eq(!m).css({
                                left: c.width + "px"
                            });
                            r.eq(!m).animate({
                                left: "0"
                            }, {
                                duration: k
                            });
                            m = !m;
                            p(m)
                        } else {
                            if (m >= j) {
                                r.eq(0).animate({
                                    left: "0"
                                }, {
                                    duration: k,
                                    complete: function() {
                                        r.eq(j - 1).css({
                                            left: c.width + "px"
                                        });
                                        m = 0;
                                        p(m)
                                    }
                                })
                            } else {
                                r.eq(m + 1).animate({
                                    left: "0"
                                }, {
                                    duration: k,
                                    complete: function() {
                                        if (m == 0) {
                                            r.eq(j).css({
                                                left: c.width + "px"
                                            })
                                        } else {
                                            r.eq(m - 1).css({
                                                left: c.width + "px"
                                            })
                                        }
                                        m++;
                                        p(m)
                                    }
                                })
                            }
                        }
                    }
                };
                var d = function() {
                    if (!r.is(":animated")) {
                        r.eq(m).animate({
                            left: c.width + "px"
                        }, {
                            duration: k
                        });
                        e();
                        if (j == 1) {
                            r.eq(!m).css({
                                left: "-" + c.width + "px"
                            });
                            r.eq(!m).animate({
                                left: "0"
                            }, {
                                duration: k
                            });
                            m = !m;
                            p(m)
                        } else {
                            if (m <= 0) {
                                r.eq(j).animate({
                                    left: "0"
                                }, {
                                    duration: k,
                                    complete: function() {
                                        r.eq(j - 1).css({
                                            left: "-" + c.width + "px"
                                        });
                                        m = j;
                                        p(m)
                                    }
                                })
                            } else {
                                r.eq(m - 1).animate({
                                    left: "0"
                                }, {
                                    duration: k,
                                    complete: function() {
                                        if (m == 1) {
                                            r.eq(j).css({
                                                left: "-" + c.width + "px"
                                            })
                                        } else {
                                            r.eq(m - 2).css({
                                                left: "-" + c.width + "px"
                                            })
                                        }
                                        m--;
                                        p(m)
                                    }
                                })
                            }
                        }
                    }
                };
                var q = function(n) {
                    var i = n.parent().children(),
                        t = i.index(n);
                    e();
                    n.addClass(c.thumb_focus_class);
                    if (c.step) {
                        c.step(t)
                    }
                    if (m != t) {
                        r.eq(m).animate({
                            left: "-" + c.width + "px"
                        }, {
                            duration: k
                        });
                        r.eq(t).css({
                            left: c.width + "px"
                        });
                        r.eq(t).animate({
                            left: "0"
                        }, {
                            duration: k,
                            complete: function() {
                                if (t == 0) {
                                    r.eq(j).css({
                                        left: "-" + c.width + "px"
                                    })
                                } else {
                                    r.eq(t - 1).css({
                                        left: "-" + c.width + "px"
                                    })
                                }
                                if (t == j) {
                                    r.eq(0).css({
                                        left: c.width + "px"
                                    })
                                } else {
                                    r.eq(t + 1).css({
                                        left: c.width + "px"
                                    })
                                }
                                m = t
                            }
                        })
                    }
                };
                if (c.auto_play) {
                    g = setInterval(l, c.interval * 1000)
                }
                if (c.next_btn != "") {
                    a(c.next_btn).click(function() {
                        if (c.always_play === false) {
                            clearInterval(g)
                        }
                        l()
                    })
                }
                if (c.prev_btn != "") {
                    a(c.prev_btn).click(function() {
                        if (c.always_play === false) {
                            clearInterval(g)
                        }
                        d()
                    })
                }
                if (c.thumb_box != "") {
                    var o = h();
                    o.delegate(c.thumb_item, "click", function() {
                        if (c.always_play === false) {
                            clearInterval(g)
                        }
                        q(a(this))
                    })
                }
                if (c.mouse_over_stop === true) {
                    r.hover(function() {
                        clearInterval(g)
                    }, function() {
                        if (c.auto_play) {
                            clearInterval(g);
                            g = setInterval(l, c.interval * 1000)
                        }
                    })
                }
            }
        })
    }
})(jQuery);
(function(b) {
    function d(e) {
        this.context = "body";
        this.selector = null;
        M.mix(this, e);
        if (!this.selector.length) {
            M.error("please specify the selector!")
        }
        this.init()
    }
    var a = navigator.userAgent.toLowerCase().match(/msie [\d.]+/),
        c = a ? parseFloat(a[0].substr(5)) : false;
}(window));