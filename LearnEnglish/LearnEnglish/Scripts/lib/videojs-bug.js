(function (f) { if (typeof exports === "object" && typeof module !== "undefined") { module.exports = f() } else if (typeof define === "function" && define.amd) { define([], f) } else { var g; if (typeof window !== "undefined") { g = window } else if (typeof global !== "undefined") { g = global } else if (typeof self !== "undefined") { g = self } else { g = this } g.videojsBug = f() } })(function () {
    var define, module, exports;
    return (function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == "function" && require;
                    if (!u && a) return a(o, !0);
                    if (i) return i(o, !0);
                    var f = new Error("Cannot find module '" + o + "'");
                    throw f.code = "MODULE_NOT_FOUND", f;
                }
                var l = n[o] = { exports: {} };
                t[o][0].call(l.exports,
                    function(e) {
                        var n = t[o][1][e];
                        return s(n ? n : e);
                    },
                    l,
                    l.exports,
                    e,
                    t,
                    n,
                    r);
            }
            return n[o].exports;
        }

        var i = typeof require == "function" && require;
        for (var o = 0; o < r.length; o++) s(r[o]);
        return s;
    })({
            1: [
                function(require, module, exports) {
                    'use strict';

                    Object.defineProperty(exports,
                        "__esModule",
                        {
                            value: true
                        });

                    var _createClass = function() {
                        function defineProperties(target, props) {
                            for (var i = 0; i < props.length; i++) {
                                var descriptor = props[i];
                                descriptor.enumerable = descriptor.enumerable || false;
                                descriptor.configurable = true;
                                if ("value" in descriptor) descriptor.writable = true;
                                Object.defineProperty(target, descriptor.key, descriptor);
                            }
                        }

                        return function(Constructor, protoProps, staticProps) {
                            if (protoProps) defineProperties(Constructor.prototype, protoProps);
                            if (staticProps) defineProperties(Constructor, staticProps);
                            return Constructor;
                        };
                    }();

                    function _classCallCheck(instance, Constructor) {
                        if (!(instance instanceof Constructor)) {
                            throw new TypeError("Cannot call a class as a function");
                        }
                    }

                    function _possibleConstructorReturn(self, call) {
                        if (!self) {
                            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                        }
                        return call && (typeof call === "object" || typeof call === "function") ? call : self;
                    }

                    function _inherits(subClass, superClass) {
                        if (typeof superClass !== "function" && superClass !== null) {
                            throw new TypeError("Super expression must either be null or a function, not " +
                                typeof superClass);
                        }
                        subClass.prototype = Object.create(superClass && superClass.prototype,
                            {
                                constructor: { value: subClass, enumerable: false, writable: true, configurable: true }
                            });
                        if (superClass)
                            Object.setPrototypeOf
                                ? Object.setPrototypeOf(subClass, superClass)
                                : subClass.__proto__ = superClass;
                    }

                    // Check for videojs before doing anything else:
                    function VideojsUndefinedException(message) {
                        this.message = message;
                    }

                    var videojs = window.videojs;

                    if (!videojs) {
                        throw new VideojsUndefinedException('video-bug: "videojs" is undefined!');
                    }
                    var VjsClickableComponent = videojs.getComponent('ClickableComponent');

                    /**
                     * Bug UI Component class
                     */

                    var BugComponent = function(_VjsClickableComponen) {
                        _inherits(BugComponent, _VjsClickableComponen);

                        function BugComponent(player, options) {
                            _classCallCheck(this, BugComponent);

                            return _possibleConstructorReturn(this,
                                (BugComponent.__proto__ || Object.getPrototypeOf(BugComponent))
                                .call(this, player, options));
                        }

                        _createClass(BugComponent,
                            [
                                {
                                    key: 'createEl',
                                    value: function createEl() {
                                        var options = this.options();
                                        // We'll add our bug content to this element:
                                        var bugElement = videojs.dom.createEl('div',
                                            {
                                                className: 'vjs-bug mark'
                                            });

                                        // Styling
                                        bugElement.style.opacity = options.opacity;
                                        bugElement.style.marginLeft = options.padding;
                                        bugElement.style.height = options.height;
                                        bugElement.style.width = options.width;
                                        bugElement.style.background = options.color;
                                        return bugElement;
                                    }
                                }
                            ]);

                        return BugComponent;
                    }(VjsClickableComponent);

                    // Cross-compatibility for Video.js 5 and 6.
                    var registerPlugin = videojs.registerPlugin || videojs.plugin;

                    var validateOptions = function validateOptions(options) {
                        if (options.opacity > 1) {
                            options.opacity = 1;
                        }
                        if (options.opacity < 0) {
                            options.opacity = 0;
                        }
                    };

                    var onPlayerReady = function onPlayerReady(player, options) {
                        validateOptions(options);
                        videojs.registerComponent('BugComponent', BugComponent);
                        // Insert bug as first item after <video>:
                        player.addChild('BugComponent', options, 1);
                    };

                    var bug = function bug(options) {
                        var _this2 = this;

                        this.ready(function() {
                            onPlayerReady(_this2, videojs.mergeOptions(options));
                        });
                    };

                    // Register the plugin with video.js.
                    registerPlugin('bug', bug);

                    // Include the version number.
                    bug.VERSION = '1.0.0-rc.2';

                    exports.default = bug;
                }, {}
            ]
        },
        {},
        [1])(1);
});