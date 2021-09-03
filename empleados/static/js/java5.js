'use strict';
(function($) {
  /**
   * @param {?} options
   * @return {?}
   */
  $.fn.bxSlider = function(options) {
    /**
     * @return {undefined}
     */
    function setup() {
      render(options.startingSlide);
      if (options.mode == "horizontal") {
        self.wrap('<div class="' + options.wrapperClass + '" style="width:' + th_field + 'px; position:relative;"></div>').wrap('<div class="bx-window" style="position:relative; overflow:hidden; width:' + th_field + 'px;"></div>').css({
          width : "999999px",
          position : "relative",
          left : "-" + (options.infiniteLoop ? value : 0) + "px"
        });
        self.children(options.childSelector).css({
          width : neededWidth,
          "float" : "left",
          listStyle : "none"
        });
        filter = self.parent().parent();
        that.addClass("bx-child");
      } else {
        if (options.mode == "vertical") {
          self.wrap('<div class="' + options.wrapperClass + '" style="width:' + v + 'px; position:relative;"></div>').wrap('<div class="bx-window" style="width:' + v + "px; height:" + errorListOutput + 'px; position:relative; overflow:hidden;"></div>').css({
            height : "999999px",
            position : "relative",
            top : "-" + height + "px"
          });
          self.children(options.childSelector).css({
            listStyle : "none",
            height : scaleY
          });
          filter = self.parent().parent();
          that.addClass("bx-child");
        } else {
          if (options.mode == "fade") {
            self.wrap('<div class="' + options.wrapperClass + '" style="width:' + v + 'px; position:relative;"></div>').wrap('<div class="bx-window" style="height:' + scaleY + "px; width:" + v + 'px; position:relative; overflow:hidden;"></div>');
            self.children(options.childSelector).css({
              listStyle : "none",
              position : "absolute",
              top : 0,
              left : 0,
              zIndex : 98
            });
            filter = self.parent().parent();
            that.not(":eq(" + index + ")").fadeTo(0, 0);
            that.eq(index).css("zIndex", 99);
          }
        }
      }
      if (options.captions && options.captionsSelector == null) {
        filter.append('<div class="bx-captions"></div>');
      }
    }
    /**
     * @return {undefined}
     */
    function render() {
      if ((options.mode == "horizontal" || options.mode == "vertical") && options.infiniteLoop) {
        var metadata = load(that, 0, options.moveSlideQty, "backward");
        $.each(metadata, function(b) {
          self.prepend($(this));
        });
        /** @type {number} */
        var line1StartX = that.length + options.moveSlideQty - 1;
        /** @type {number} */
        var newLineStartX = that.length - options.displaySlideQty;
        /** @type {number} */
        var b = line1StartX - newLineStartX;
        var ret = load(that, 0, b, "forward");
        if (options.infiniteLoop) {
          $.each(ret, function(b) {
            self.append($(this));
          });
        }
      }
    }
    /**
     * @return {undefined}
     */
    function updateContent() {
      if (options.nextImage != "") {
        nextContent = options.nextImage;
        /** @type {string} */
        nextType = "image";
      } else {
        nextContent = options.nextText;
        /** @type {string} */
        nextType = "text";
      }
      if (options.prevImage != "") {
        prevContent = options.prevImage;
        /** @type {string} */
        prevType = "image";
      } else {
        prevContent = options.prevText;
        /** @type {string} */
        prevType = "text";
      }
      append(nextType, nextContent, prevType, prevContent);
    }
    /**
     * @return {undefined}
     */
    function start() {
      if (options.auto) {
        clearInterval(initializeCheckTimer);
        if (!options.infiniteLoop) {
          if (options.autoDirection == "next") {
            /** @type {number} */
            initializeCheckTimer = setInterval(function() {
              index = index + options.moveSlideQty;
              if (index > length) {
                /** @type {number} */
                index = index % that.length;
              }
              el.goToSlide(index, false);
            }, options.pause);
          } else {
            if (options.autoDirection == "prev") {
              /** @type {number} */
              initializeCheckTimer = setInterval(function() {
                /** @type {number} */
                index = index - options.moveSlideQty;
                if (index < 0) {
                  /** @type {number} */
                  negativeOffset = index % that.length;
                  if (negativeOffset == 0) {
                    /** @type {number} */
                    index = 0;
                  } else {
                    index = that.length + negativeOffset;
                  }
                }
                el.goToSlide(index, false);
              }, options.pause);
            }
          }
        } else {
          if (options.autoDirection == "next") {
            /** @type {number} */
            initializeCheckTimer = setInterval(function() {
              el.goToNextSlide(false);
            }, options.pause);
          } else {
            if (options.autoDirection == "prev") {
              /** @type {number} */
              initializeCheckTimer = setInterval(function() {
                el.goToPreviousSlide(false);
              }, options.pause);
            }
          }
        }
      } else {
        if (options.ticker) {
          options.tickerSpeed *= 10;
          $(".bx-child", filter).each(function(b) {
            count = count + $(this).width();
            top = top + $(this).height();
          });
          if (options.tickerDirection == "prev" && options.mode == "horizontal") {
            self.css("left", "-" + (count + value) + "px");
          } else {
            if (options.tickerDirection == "prev" && options.mode == "vertical") {
              self.css("top", "-" + (top + height) + "px");
            }
          }
          if (options.mode == "horizontal") {
            /** @type {number} */
            D = parseInt(self.css("left"));
            callback(D, count, options.tickerSpeed);
          } else {
            if (options.mode == "vertical") {
              /** @type {number} */
              primValue = parseInt(self.css("top"));
              callback(primValue, top, options.tickerSpeed);
            }
          }
          if (options.tickerHover) {
            initAuto();
          }
        }
      }
    }
    /**
     * @param {number} value
     * @param {string} o
     * @param {number} properties
     * @return {undefined}
     */
    function callback(value, o, properties) {
      if (options.mode == "horizontal") {
        if (options.tickerDirection == "next") {
          self.animate({
            left : "-=" + o + "px"
          }, properties, "linear", function() {
            self.css("left", value);
            callback(value, count, options.tickerSpeed);
          });
        } else {
          if (options.tickerDirection == "prev") {
            self.animate({
              left : "+=" + o + "px"
            }, properties, "linear", function() {
              self.css("left", value);
              callback(value, count, options.tickerSpeed);
            });
          }
        }
      } else {
        if (options.mode == "vertical") {
          if (options.tickerDirection == "next") {
            self.animate({
              top : "-=" + o + "px"
            }, properties, "linear", function() {
              self.css("top", value);
              callback(value, top, options.tickerSpeed);
            });
          } else {
            if (options.tickerDirection == "prev") {
              self.animate({
                top : "+=" + o + "px"
              }, properties, "linear", function() {
                self.css("top", value);
                callback(value, top, options.tickerSpeed);
              });
            }
          }
        }
      }
    }
    /**
     * @return {undefined}
     */
    function update() {
      if (options.startImage != "") {
        startContent = options.startImage;
        /** @type {string} */
        startType = "image";
      } else {
        startContent = options.startText;
        /** @type {string} */
        startType = "text";
      }
      if (options.stopImage != "") {
        stopContent = options.stopImage;
        /** @type {string} */
        stopType = "image";
      } else {
        stopContent = options.stopText;
        /** @type {string} */
        stopType = "text";
      }
      run(startType, startContent, stopType, stopContent);
    }
    /**
     * @return {undefined}
     */
    function initTicker() {
      filter.children(".bx-window").hover(function() {
        if (t) {
          el.suspendShow(false);
        }
      }, function() {
        if (t) {
          el.restartShow(false);
        }
      });
    }
    /**
     * @return {undefined}
     */
    function initAuto() {
      self.hover(function() {
        if (t) {
          el.stopTicker(false);
        }
      }, function() {
        if (t) {
          el.startTicker(false);
        }
      });
    }
    /**
     * @return {undefined}
     */
    function hide() {
      that.not(":eq(" + index + ")").fadeTo(options.speed, 0).css("zIndex", 98);
      that.eq(index).css("zIndex", 99).fadeTo(options.speed, 1, function() {
        /** @type {boolean} */
        E = false;
        if (jQuery.browser.msie) {
          that.eq(index).get(0).style.removeAttribute("filter");
        }
        options.onAfterSlide(index, that.length, that.eq(index));
      });
    }
    /**
     * @param {number} i
     * @return {undefined}
     */
    function go(i) {
      if (options.pagerType == "full" && options.pager) {
        $("a", $container).removeClass(options.pagerActiveClass);
        $("a", $container).eq(i).addClass(options.pagerActiveClass);
      } else {
        if (options.pagerType == "short" && options.pager) {
          $(".bx-pager-current", $container).html(index + 1);
        }
      }
    }
    /**
     * @param {string} type
     * @param {string} callback
     * @param {string} a
     * @param {string} b
     * @return {undefined}
     */
    function append(type, callback, a, b) {
      var helper = $('<a href="" class="bx-next"></a>');
      var all = $('<a href="" class="bx-prev"></a>');
      if (type == "text") {
        helper.html(callback);
      } else {
        helper.html('<img src="' + callback + '" />');
      }
      if (a == "text") {
        all.html(b);
      } else {
        all.html('<img src="' + b + '" />');
      }
      if (options.prevSelector) {
        $(options.prevSelector).append(all);
      } else {
        filter.append(all);
      }
      if (options.nextSelector) {
        $(options.nextSelector).append(helper);
      } else {
        filter.append(helper);
      }
      helper.click(function() {
        el.goToNextSlide();
        return false;
      });
      all.click(function() {
        el.goToPreviousSlide();
        return false;
      });
    }
    /**
     * @param {string} type
     * @return {undefined}
     */
    function init(type) {
      var e = that.length;
      if (options.moveSlideQty > 1) {
        if (that.length % options.moveSlideQty != 0) {
          /** @type {number} */
          e = Math.ceil(that.length / options.moveSlideQty);
        } else {
          /** @type {number} */
          e = that.length / options.moveSlideQty;
        }
      }
      /** @type {string} */
      var message = "";
      if (options.buildPager) {
        /** @type {number} */
        var i = 0;
        for (; i < e; i++) {
          /** @type {string} */
          message = message + options.buildPager(i, that.eq(i * options.moveSlideQty));
        }
      } else {
        if (type == "full") {
          /** @type {number} */
          i = 1;
          for (; i <= e; i++) {
            /** @type {string} */
            message = message + ('<a href="" class="pager-link pager-' + i + '">' + i + "</a>");
          }
        } else {
          if (type == "short") {
            /** @type {string} */
            message = '<span class="bx-pager-current">' + (options.startingSlide + 1) + "</span> " + options.pagerShortSeparator + ' <span class="bx-pager-total">' + that.length + "</span>";
          }
        }
      }
      if (options.pagerSelector) {
        $(options.pagerSelector).append(message);
        $container = $(options.pagerSelector);
      } else {
        var helper = $('<div class="bx-pager"></div>');
        helper.append(message);
        if (options.pagerLocation == "top") {
          filter.prepend(helper);
        } else {
          if (options.pagerLocation == "bottom") {
            filter.append(helper);
          }
        }
        $container = filter.children(".bx-pager");
      }
      $container.children().click(function() {
        if (options.pagerType == "full") {
          var i = $container.children().index(this);
          if (options.moveSlideQty > 1) {
            /** @type {number} */
            i = i * options.moveSlideQty;
          }
          el.goToSlide(i);
        }
        return false;
      });
    }
    /**
     * @return {undefined}
     */
    function close() {
      var c = $("img", that.eq(index)).attr("title");
      if (c != "") {
        if (options.captionsSelector) {
          $(options.captionsSelector).html(c);
        } else {
          filter.children(".bx-captions").html(c);
        }
      } else {
        if (options.captionsSelector) {
          $(options.captionsSelector).html(" ");
        } else {
          filter.children(".bx-captions").html(" ");
        }
      }
    }
    /**
     * @param {string} data
     * @param {string} root
     * @param {string} action
     * @param {string} variant
     * @return {undefined}
     */
    function run(data, root, action, variant) {
      p = $('<a href="" class="bx-start"></a>');
      if (data == "text") {
        /** @type {string} */
        c = root;
      } else {
        /** @type {string} */
        c = '<img src="' + root + '" />';
      }
      if (action == "text") {
        /** @type {string} */
        s = variant;
      } else {
        /** @type {string} */
        s = '<img src="' + variant + '" />';
      }
      if (options.autoControlsSelector) {
        $(options.autoControlsSelector).append(p);
      } else {
        filter.append('<div class="bx-auto"></div>');
        filter.children(".bx-auto").html(p);
      }
      p.click(function() {
        if (options.ticker) {
          if ($(this).hasClass("stop")) {
            el.stopTicker();
          } else {
            if ($(this).hasClass("start")) {
              el.startTicker();
            }
          }
        } else {
          if ($(this).hasClass("stop")) {
            el.stopShow(true);
          } else {
            if ($(this).hasClass("start")) {
              el.startShow(true);
            }
          }
        }
        return false;
      });
    }
    /**
     * @return {undefined}
     */
    function scroll() {
      if (!options.infiniteLoop && options.hideControlOnEnd) {
        if (index == i) {
          filter.children(".bx-prev").hide();
        } else {
          filter.children(".bx-prev").show();
        }
        /** @type {number} */
        var kShowNewMax = Math.floor(length / options.displaySlideQty) * options.displaySlideQty;
        if (index >= kShowNewMax) {
          filter.children(".bx-next").hide();
        } else {
          filter.children(".bx-next").show();
        }
      }
    }
    /**
     * @param {?} obj
     * @param {string} side
     * @return {?}
     */
    function animate(obj, side) {
      var costs = self.find(" > .bx-child").eq(obj).position();
      return side == "left" ? costs.left : costs.top;
    }
    /**
     * @return {?}
     */
    function isOnScreen() {
      /** @type {number} */
      var visible = next.outerWidth() * options.displaySlideQty;
      return visible;
    }
    /**
     * @return {?}
     */
    function resizeWindow() {
      /** @type {number} */
      var source = next.outerHeight() * options.displaySlideQty;
      return source;
    }
    /**
     * @param {!Object} value
     * @param {number} _
     * @param {number} type
     * @param {string} index
     * @return {?}
     */
    function load(value, _, type, index) {
      /** @type {!Array} */
      var r = [];
      /** @type {number} */
      var graphTypeBaseName = type;
      /** @type {boolean} */
      var h = false;
      if (index == "backward") {
        value = $.makeArray(value);
        value.reverse();
      }
      for (; graphTypeBaseName > 0;) {
        $.each(value, function(_sign, canCreateDiscussions) {
          if (graphTypeBaseName > 0) {
            if (!h) {
              if (_sign == _) {
                /** @type {boolean} */
                h = true;
                r.push($(this).clone());
                graphTypeBaseName--;
              }
            } else {
              r.push($(this).clone());
              graphTypeBaseName--;
            }
          } else {
            return false;
          }
        });
      }
      return r;
    }
    var defaults = {
      mode : "horizontal",
      childSelector : "",
      infiniteLoop : true,
      hideControlOnEnd : false,
      controls : true,
      speed : 500,
      easing : "swing",
      pager : false,
      pagerSelector : null,
      pagerType : "full",
      pagerLocation : "bottom",
      pagerShortSeparator : "/",
      pagerActiveClass : "pager-active",
      nextText : "next",
      nextImage : "",
      nextSelector : null,
      prevText : "prev",
      prevImage : "",
      prevSelector : null,
      captions : false,
      captionsSelector : null,
      auto : false,
      autoDirection : "next",
      autoControls : false,
      autoControlsSelector : null,
      autoStart : true,
      autoHover : false,
      autoDelay : 0,
      pause : 3E3,
      startText : "start",
      startImage : "",
      stopText : "stop",
      stopImage : "",
      ticker : false,
      tickerSpeed : 5E3,
      tickerDirection : "next",
      tickerHover : false,
      wrapperClass : "bx-wrapper",
      startingSlide : 0,
      displaySlideQty : 1,
      moveSlideQty : 1,
      randomStart : false,
      onBeforeSlide : function() {
      },
      onAfterSlide : function() {
      },
      onLastSlide : function() {
      },
      onFirstSlide : function() {
      },
      onNextSlide : function() {
      },
      onPrevSlide : function() {
      },
      buildPager : null
    };
    options = $.extend(defaults, options);
    var el = this;
    /** @type {string} */
    var self = "";
    /** @type {string} */
    var pix_color = "";
    /** @type {string} */
    var that = "";
    /** @type {string} */
    var filter = "";
    /** @type {string} */
    var next = "";
    /** @type {string} */
    var neededWidth = "";
    /** @type {string} */
    var scale = "";
    /** @type {string} */
    var th_field = "";
    /** @type {string} */
    var errorListOutput = "";
    /** @type {string} */
    var $container = "";
    /** @type {string} */
    var initializeCheckTimer = "";
    /** @type {string} */
    var p = "";
    /** @type {string} */
    var current_tag_name = "";
    /** @type {string} */
    var c = "";
    /** @type {string} */
    var s = "";
    /** @type {boolean} */
    var t = true;
    /** @type {boolean} */
    var u = false;
    /** @type {number} */
    var v = 0;
    /** @type {number} */
    var scaleY = 0;
    /** @type {number} */
    var index = 0;
    /** @type {number} */
    var value = 0;
    /** @type {number} */
    var height = 0;
    /** @type {number} */
    var count = 0;
    /** @type {number} */
    var top = 0;
    /** @type {number} */
    var D = 0;
    /** @type {number} */
    var primValue = 0;
    /** @type {boolean} */
    var E = false;
    /** @type {number} */
    var i = 0;
    /** @type {number} */
    var length = that.length - 1;
    /**
     * @param {number} n
     * @param {boolean} a
     * @return {undefined}
     */
    this.goToSlide = function(n, a) {
      if (!E) {
        /** @type {boolean} */
        E = true;
        /** @type {number} */
        index = n;
        options.onBeforeSlide(index, that.length, that.eq(index));
        if (typeof a == "undefined") {
          /** @type {boolean} */
          a = true;
        }
        if (a) {
          if (options.auto) {
            el.stopShow(true);
          }
        }
        /** @type {number} */
        slide = n;
        if (slide == i) {
          options.onFirstSlide(index, that.length, that.eq(index));
        }
        if (slide == length) {
          options.onLastSlide(index, that.length, that.eq(index));
        }
        if (options.mode == "horizontal") {
          self.animate({
            left : "-" + animate(slide, "left") + "px"
          }, options.speed, options.easing, function() {
            /** @type {boolean} */
            E = false;
            options.onAfterSlide(index, that.length, that.eq(index));
          });
        } else {
          if (options.mode == "vertical") {
            self.animate({
              top : "-" + animate(slide, "top") + "px"
            }, options.speed, options.easing, function() {
              /** @type {boolean} */
              E = false;
              options.onAfterSlide(index, that.length, that.eq(index));
            });
          } else {
            if (options.mode == "fade") {
              hide();
            }
          }
        }
        scroll();
        if (options.moveSlideQty > 1) {
          /** @type {number} */
          n = Math.floor(n / options.moveSlideQty);
        }
        go(n);
        close();
      }
    };
    /**
     * @param {boolean} withoutAnimation
     * @return {undefined}
     */
    this.goToNextSlide = function(withoutAnimation) {
      if (typeof withoutAnimation == "undefined") {
        /** @type {boolean} */
        withoutAnimation = true;
      }
      if (withoutAnimation) {
        if (options.auto) {
          el.stopShow(true);
        }
      }
      if (!options.infiniteLoop) {
        if (!E) {
          /** @type {boolean} */
          var c = false;
          index = index + options.moveSlideQty;
          if (index <= length) {
            scroll();
            options.onNextSlide(index, that.length, that.eq(index));
            el.goToSlide(index);
          } else {
            /** @type {number} */
            index = index - options.moveSlideQty;
          }
        }
      } else {
        if (!E) {
          /** @type {boolean} */
          E = true;
          /** @type {boolean} */
          c = false;
          index = index + options.moveSlideQty;
          if (index > length) {
            /** @type {number} */
            index = index % that.length;
            /** @type {boolean} */
            c = true;
          }
          options.onNextSlide(index, that.length, that.eq(index));
          options.onBeforeSlide(index, that.length, that.eq(index));
          if (options.mode == "horizontal") {
            /** @type {number} */
            var offSet = options.moveSlideQty * scale;
            self.animate({
              left : "-=" + offSet + "px"
            }, options.speed, options.easing, function() {
              /** @type {boolean} */
              E = false;
              if (c) {
                self.css("left", "-" + animate(index, "left") + "px");
              }
              options.onAfterSlide(index, that.length, that.eq(index));
            });
          } else {
            if (options.mode == "vertical") {
              /** @type {number} */
              var d = options.moveSlideQty * scaleY;
              self.animate({
                top : "-=" + d + "px"
              }, options.speed, options.easing, function() {
                /** @type {boolean} */
                E = false;
                if (c) {
                  self.css("top", "-" + animate(index, "top") + "px");
                }
                options.onAfterSlide(index, that.length, that.eq(index));
              });
            } else {
              if (options.mode == "fade") {
                hide();
              }
            }
          }
          if (options.moveSlideQty > 1) {
            go(Math.ceil(index / options.moveSlideQty));
          } else {
            go(index);
          }
          close();
        }
      }
    };
    /**
     * @param {boolean} withoutAnimation
     * @return {undefined}
     */
    this.goToPreviousSlide = function(withoutAnimation) {
      if (typeof withoutAnimation == "undefined") {
        /** @type {boolean} */
        withoutAnimation = true;
      }
      if (withoutAnimation) {
        if (options.auto) {
          el.stopShow(true);
        }
      }
      if (!options.infiniteLoop) {
        if (!E) {
          /** @type {boolean} */
          var c = false;
          /** @type {number} */
          index = index - options.moveSlideQty;
          if (index < 0) {
            /** @type {number} */
            index = 0;
            if (options.hideControlOnEnd) {
              filter.children(".bx-prev").hide();
            }
          }
          scroll();
          options.onPrevSlide(index, that.length, that.eq(index));
          el.goToSlide(index);
        }
      } else {
        if (!E) {
          /** @type {boolean} */
          E = true;
          /** @type {boolean} */
          c = false;
          /** @type {number} */
          index = index - options.moveSlideQty;
          if (index < 0) {
            /** @type {number} */
            negativeOffset = index % that.length;
            if (negativeOffset == 0) {
              /** @type {number} */
              index = 0;
            } else {
              index = that.length + negativeOffset;
            }
            /** @type {boolean} */
            c = true;
          }
          options.onPrevSlide(index, that.length, that.eq(index));
          options.onBeforeSlide(index, that.length, that.eq(index));
          if (options.mode == "horizontal") {
            /** @type {number} */
            var offSet = options.moveSlideQty * scale;
            self.animate({
              left : "+=" + offSet + "px"
            }, options.speed, options.easing, function() {
              /** @type {boolean} */
              E = false;
              if (c) {
                self.css("left", "-" + animate(index, "left") + "px");
              }
              options.onAfterSlide(index, that.length, that.eq(index));
            });
          } else {
            if (options.mode == "vertical") {
              /** @type {number} */
              var d = options.moveSlideQty * scaleY;
              self.animate({
                top : "+=" + d + "px"
              }, options.speed, options.easing, function() {
                /** @type {boolean} */
                E = false;
                if (c) {
                  self.css("top", "-" + animate(index, "top") + "px");
                }
                options.onAfterSlide(index, that.length, that.eq(index));
              });
            } else {
              if (options.mode == "fade") {
                hide();
              }
            }
          }
          if (options.moveSlideQty > 1) {
            go(Math.ceil(index / options.moveSlideQty));
          } else {
            go(index);
          }
          close();
        }
      }
    };
    /**
     * @param {boolean} a
     * @return {undefined}
     */
    this.goToFirstSlide = function(a) {
      if (typeof a == "undefined") {
        /** @type {boolean} */
        a = true;
      }
      el.goToSlide(i, a);
    };
    /**
     * @return {undefined}
     */
    this.goToLastSlide = function() {
      if (typeof a == "undefined") {
        /** @type {boolean} */
        var a = true;
      }
      el.goToSlide(length, a);
    };
    /**
     * @return {?}
     */
    this.getCurrentSlide = function() {
      return index;
    };
    /**
     * @return {?}
     */
    this.getSlideCount = function() {
      return that.length;
    };
    /**
     * @param {boolean} method
     * @return {undefined}
     */
    this.suspendShow = function(method) {
      clearInterval(initializeCheckTimer);
      if (typeof method == "undefined") {
        /** @type {boolean} */
        method = true;
      }
      if (method && options.autoControls) {
        p.html(c).removeClass("stop").addClass("start");
      }
    };
    /**
     * @param {boolean} elem
     * @return {undefined}
     */
    this.restartShow = function(elem) {
      if (typeof elem == "undefined") {
        /** @type {boolean} */
        elem = true;
      }
      if (t) {
        start();
      }
      if (elem && options.autoControls) {
        p.html(s).removeClass("start").addClass("stop");
      }
    };
    /**
     * @param {boolean} add
     * @return {undefined}
     */
    this.stopShow = function(add) {
      /** @type {boolean} */
      t = false;
      this.suspendShow(add);
    };
    /**
     * @param {boolean} app
     * @return {undefined}
     */
    this.startShow = function(app) {
      /** @type {boolean} */
      t = true;
      this.restartShow(app);
    };
    /**
     * @param {string} el
     * @return {undefined}
     */
    this.stopTicker = function(el) {
      self.stop();
      if (typeof el == "undefined") {
        /** @type {boolean} */
        el = true;
      }
      if (el && options.ticker) {
        p.html(c).removeClass("stop").addClass("start");
        /** @type {boolean} */
        t = false;
      }
    };
    /**
     * @param {string} el
     * @return {undefined}
     */
    this.startTicker = function(el) {
      if (options.mode == "horizontal") {
        if (options.tickerDirection == "next") {
          /** @type {number} */
          var row = parseInt(self.css("left"));
          var i = count + row + that.eq(0).width();
        } else {
          if (options.tickerDirection == "prev") {
            /** @type {number} */
            row = -parseInt(self.css("left"));
            /** @type {number} */
            i = row - that.eq(0).width();
          }
        }
        /** @type {number} */
        var step = i * options.tickerSpeed / count;
        callback(D, i, step);
      } else {
        if (options.mode == "vertical") {
          if (options.tickerDirection == "next") {
            /** @type {number} */
            var y = parseInt(self.css("top"));
            i = top + y + that.eq(0).height();
          } else {
            if (options.tickerDirection == "prev") {
              /** @type {number} */
              y = -parseInt(self.css("top"));
              /** @type {number} */
              i = y - that.eq(0).height();
            }
          }
          /** @type {number} */
          step = i * options.tickerSpeed / top;
          callback(primValue, i, step);
          if (typeof el == "undefined") {
            /** @type {boolean} */
            el = true;
          }
          if (el && options.ticker) {
            p.html(s).removeClass("start").addClass("stop");
            /** @type {boolean} */
            t = true;
          }
        }
      }
    };
    /**
     * @return {undefined}
     */
    this.initShow = function() {
      self = $(this);
      pix_color = self.clone();
      that = self.children(options.childSelector);
      /** @type {string} */
      filter = "";
      next = self.children(options.childSelector + ":first");
      neededWidth = next.width();
      /** @type {number} */
      v = 0;
      scale = next.outerWidth();
      /** @type {number} */
      scaleY = 0;
      th_field = isOnScreen();
      errorListOutput = resizeWindow();
      /** @type {boolean} */
      E = false;
      /** @type {string} */
      $container = "";
      /** @type {number} */
      index = 0;
      /** @type {number} */
      value = 0;
      /** @type {number} */
      height = 0;
      /** @type {string} */
      initializeCheckTimer = "";
      /** @type {string} */
      p = "";
      /** @type {string} */
      current_tag_name = "";
      /** @type {string} */
      c = "";
      /** @type {string} */
      s = "";
      /** @type {boolean} */
      t = true;
      /** @type {boolean} */
      u = false;
      /** @type {number} */
      count = 0;
      /** @type {number} */
      top = 0;
      /** @type {number} */
      D = 0;
      /** @type {number} */
      primValue = 0;
      /** @type {number} */
      i = 0;
      /** @type {number} */
      length = that.length - 1;
      that.each(function(b) {
        if ($(this).outerHeight() > scaleY) {
          scaleY = $(this).outerHeight();
        }
        if ($(this).outerWidth() > v) {
          v = $(this).outerWidth();
        }
      });
      if (options.randomStart) {
        /** @type {number} */
        var i = Math.floor(Math.random() * that.length);
        /** @type {number} */
        index = i;
        /** @type {number} */
        value = scale * (options.moveSlideQty + i);
        /** @type {number} */
        height = scaleY * (options.moveSlideQty + i);
      } else {
        index = options.startingSlide;
        /** @type {number} */
        value = scale * (options.moveSlideQty + options.startingSlide);
        /** @type {number} */
        height = scaleY * (options.moveSlideQty + options.startingSlide);
      }
      setup();
      if (options.pager && !options.ticker) {
        if (options.pagerType == "full") {
          init("full");
        } else {
          if (options.pagerType == "short") {
            init("short");
          }
        }
      }
      if (options.controls && !options.ticker && that.length > 1) {
        updateContent();
      }
      if (options.auto || options.ticker) {
        if (options.autoControls) {
          update();
        }
        if (options.autoStart) {
          /** @type {boolean} */
          t = false;
          setTimeout(function() {
            el.startShow(true);
          }, options.autoDelay);
        } else {
          el.stopShow(true);
        }
        if (options.autoHover && !options.ticker) {
          initTicker();
        }
      }
      if (options.moveSlideQty > 1) {
        go(Math.ceil(index / options.moveSlideQty));
      } else {
        go(index);
      }
      scroll();
      if (options.captions) {
        close();
      }
      options.onAfterSlide(index, that.length, that.eq(index));
    };
    /**
     * @return {undefined}
     */
    this.destroyShow = function() {
      clearInterval(initializeCheckTimer);
      filter.children(".bx-next, .bx-prev, .bx-pager, .bx-auto").remove();
      self.unwrap().unwrap().removeAttr("style");
      self.children(options.childSelector).removeAttr("style").not(".bx-child").remove();
      that.removeClass("bx-child");
    };
    /**
     * @return {undefined}
     */
    this.reloadShow = function() {
      el.destroyShow();
      el.initShow();
    };
    this.each(function() {
      if ($(this).children().length > 0) {
        el.initShow();
      }
    });
    return this;
  };
  /**
   * @return {?}
   */
  jQuery.fx.prototype.cur = function() {
    if (this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null)) {
      return this.elem[this.prop];
    }
    /** @type {number} */
    var steal = parseFloat(jQuery.css(this.elem, this.prop));
    return steal;
  };
})(jQuery);
