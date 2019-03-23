$(function () {
    "use strict";

    /*=========================================================================
        Initializing stellar.js Plugin
    =========================================================================*/
    $('.section').stellar({
        horizontalScrolling: false
    });


    $(window).on('load', function () {

        $('body').addClass('loaded');


        /*=========================================================================
            Portfolio Grid
        =========================================================================*/
        var grid = $('#portfolio-grid');
        grid.shuffle({
            itemSelector: '.item'
        });

        $('#portfolio-filters > ul > li > a').on('click', function (e) {
            e.preventDefault();
            var groupName = $(this).attr('data-group');
            $('#portfolio-filters > ul > li > a').removeClass('active');
            $(this).addClass('active');
            grid.shuffle('shuffle', groupName);
        });

        $('a.image-link').magnificPopup({
            type: 'image',
            removalDelay: 300,
            mainClass: 'mfp-fade',
            gallery: {
                enabled: true
            }
        });

    });



    /*=========================================================================
        Links Navigation System
    =========================================================================*/
    $('.front-person-links > ul > li > a[data-section]').on('click', function (e) {
        e.preventDefault();
        var section = $('#' + $(this).data('section'));

        if (section.size() != 0) {

            $('body').addClass('section-show');

            section.addClass('active');

        }

    });
    $('.close-btn').on('click', function () {
        $('body').removeClass('section-show');
        $('section.active').removeClass('active');
    });



    /*=========================================================================
        Testimonials Slider
    =========================================================================*/
    $('.testimonials-slider').owlCarousel({
        singleItem: true
    });



    /*=========================================================================
        Skill Bar's Percent Initialization from attribute data-percent
    =========================================================================*/
    $('.skill-bar').each(function () {
        var $this = $(this),
            percent = parseInt($this.data('percent'), 10);

        $this.find('.bar').css('width', percent + '%');
    });




    /*=========================================================================
        Contact Form
    =========================================================================*/
    function isJSON(val) {
        var str = val.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, '');
        return (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(str);
    }
    $('#contact-form').validator().on('submit', function (e) {

        if (!e.isDefaultPrevented()) {
            // If there is no any error in validation then send the message

            e.preventDefault();
            var $this = $(this),

                //You can edit alerts here
                alerts = {

                    success: "<div class='form-group' >\
                        <div class='alert alert-success alert-dismissible' role='alert'> \
                            <button type='button' class='close' data-dismiss='alert' aria-label='Close' > \
                                <i class='ion-ios-close-empty' ></i> \
                            </button> \
                            <strong>Message Sent!</strong> We'll be in touch as soon as possible\
                        </div>\
                    </div>",


                    error: "<div class='form-group' >\
                        <div class='alert alert-danger alert-dismissible' role='alert'> \
                            <button type='button' class='close' data-dismiss='alert' aria-label='Close' > \
                                <i class='ion-ios-close-empty' ></i> \
                            </button> \
                            <strong>Error!</strong> Sorry, an error occurred. Try again.\
                        </div>\
                    </div>"

                };

            $.ajax({

                url: 'mail.php',
                type: 'post',
                data: $this.serialize(),
                success: function (data) {

                    if (isJSON(data)) {

                        data = $.parseJSON(data);

                        if (data['error'] == false) {

                            $('#contact-form-result').html(alerts.success);

                            $('#contact-form').trigger('reset');

                        } else {

                            $('#contact-form-result').html(
                                "<div class='form-group' >\
                                <div class='alert alert-danger alert-dismissible' role='alert'> \
                                    <button type='button' class='close' data-dismiss='alert' aria-label='Close' > \
                                        <i class='ion-ios-close-empty' ></i> \
                                    </button> \
                                    " + data['error'] + "\
                                </div>\
                            </div>"
                            );

                        }


                    } else {
                        $('#contact-form-result').html(alerts.error);
                    }

                },
                error: function () {
                    $('#contact-form-result').html(alerts.error);
                }
            });
        }
    });


    (function () {

        function init(item) {
            var items = item.querySelectorAll('li'),
                current = 0,
                autoUpdate = true,
                timeTrans = 4000;

            //create nav
            var nav = document.createElement('nav');
            nav.className = 'nav_arrows';

            //create button prev
            var prevbtn = document.createElement('button');
            prevbtn.className = 'prev';
            prevbtn.setAttribute('aria-label', 'Prev');

            //create button next
            var nextbtn = document.createElement('button');
            nextbtn.className = 'next';
            nextbtn.setAttribute('aria-label', 'Next');

            //create counter
            var counter = document.createElement('div');
            counter.className = 'counter';
            counter.innerHTML = "<span>1</span><span>" + items.length + "</span>";

            if (items.length > 1) {
                nav.appendChild(prevbtn);
                nav.appendChild(counter);
                nav.appendChild(nextbtn);
                item.appendChild(nav);
            }

            items[current].className = "current";
            if (items.length > 1) items[items.length - 1].className = "prev_slide";

            var navigate = function (dir) {
                items[current].className = "";

                if (dir === 'right') {
                    current = current < items.length - 1 ? current + 1 : 0;
                } else {
                    current = current > 0 ? current - 1 : items.length - 1;
                }

                var nextCurrent = current < items.length - 1 ? current + 1 : 0,
                    prevCurrent = current > 0 ? current - 1 : items.length - 1;

                items[current].className = "current";
                items[prevCurrent].className = "prev_slide";
                items[nextCurrent].className = "";

                //update counter
                counter.firstChild.textContent = current + 1;
            }

            item.addEventListener('mouseenter', function () {
                autoUpdate = false;
            });

            item.addEventListener('mouseleave', function () {
                autoUpdate = true;
            });


            prevbtn.addEventListener('click', function () {
                navigate('left');
            });

            nextbtn.addEventListener('click', function () {
                navigate('right');
            });

            //keyboard navigation
            document.addEventListener('keydown', function (ev) {
                var keyCode = ev.keyCode || ev.which;
                switch (keyCode) {
                    case 37:
                        navigate('left');
                        break;
                    case 39:
                        navigate('right');
                        break;
                }
            });

            // swipe navigation
            // from http://stackoverflow.com/a/23230280
            item.addEventListener('touchstart', handleTouchStart, false);
            item.addEventListener('touchmove', handleTouchMove, false);
            var xDown = null;
            var yDown = null;

            function handleTouchStart(evt) {
                xDown = evt.touches[0].clientX;
                yDown = evt.touches[0].clientY;
            }

            function handleTouchMove(evt) {
                if (!xDown || !yDown) {
                    return;
                }

                var xUp = evt.touches[0].clientX;
                var yUp = evt.touches[0].clientY;

                var xDiff = xDown - xUp;
                var yDiff = yDown - yUp;

                if (Math.abs(xDiff) > Math.abs(yDiff)) { /*most significant*/
                    if (xDiff > 0) {
                        /* left swipe */
                        navigate('right');
                    } else {
                        navigate('left');
                    }
                }
                /* reset values */
                xDown = null;
                yDown = null;
            }

        }

    [].slice.call(document.querySelectorAll('.cd-slider')).forEach(function (item) {
            init(item);
        });

    })();

});
