/**
 * Created by chendelin on 2017/2/10.
 *
 * 图片懒加载组件
 */

(function($,window){
    var $window=$(window);

    $.fn.lazyImg=function(options){
        var elements=this,
            $container,
            settings={
                threshold:0,
                container:window,
                effect:'fadeIn',
                event:'scroll',
                attribute:'original',
                placeholder:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC',
                appear:null
            };
        $.extend(settings,options);

        function setUpdata(){
            elements.each(function () {
                var that=$(this);
                if(window_top(that,settings) || window_left(that,settings)){

                }else if(!window_bottom(that,settings) && !window_right(that,settings)){
                    that.trigger('appear');
                }
            });
        }
        //滚动事件出发
        $container=(settings.container === undefined || settings.container === window) ? $window :$(settings.container);
        if(settings.event.indexOf('scroll') ===0){
            $container.bind(settings.event,function () {
                return setUpdata();
            })
        }

        this.each(function () {
            var self=this,
                $self=$(self);
            self.loaded=false;

            //判断图片src是否图片
            if($self.attr('src') === undefined || $self.attr('src') === ''){
                $self.attr('src',settings.placeholder);
            }

            $self.one('appear',function () {
                if(!$self.loaded){
                    $('<img/>').bind('load',function () {

                        var placeImg=$self.attr('src');
                        $self.hide();
                        if($self.is('img')){
                            $self.attr('src',placeImg);
                        }else {
                            $self.css('background-image', 'url("' + placeImg + '")')
                        }
                        $self[settings.effect](settings.effectSpeed);

                        self.loaded =true;

                        var temp=$.grep(elements,function (item) {
                            return !item.loaded;
                        });

                        elements = $(temp);

                    }).attr('src',$self.attr('data-'+settings.attribute));
                }
            });

            if(settings.event.indexOf('scroll') !==0){
                $self.bind(settings.event,function () {
                    if(!self.loaded){
                        $self.trigger('appear');
                    }
                })
            }
        });

        /* 检测目标是否在屏幕内 */

        //top
        function window_top(self,settings){
            var fold;
            if(settings.container ===undefined || settings.container ===window){
                fold=$window.scrollTop();
            }else{
                fold=$(settings.container).offset().top;
            }
            console.log(fold >= $(self).offset().top +settings.threshold + $(self).height())
            return fold >= $(self).offset().top +settings.threshold + $(self).height();
        }

        //left
        function window_left(self,settings){
            var fold;
            if(settings.container ===undefined || settings.container === window){
                fold=$window.scrollLeft();
            }else{
                fold=$(settings.container).offset().left;
            }
            console.log(fold >=$(self).offset().left + settings.threshold +$(self).width())
            return fold >=$(self).offset().left + settings.threshold +$(self).width();
        }
        //bottom
        function window_bottom(self, settings) {
            var fold;
            if(settings.container === undefined || settings.container === window){
                fold=(window.innerHeight? window.innerHeight:$window.height())+$window.scrollTop();
            }else{
                fold=$(settings.container).offset().top+$(settings.container).height();
            }
            return fold <= $(self).offset().top - settings.threshold;
        }

        //right
        function window_right(self,settings){
            var fold;
            if(settings.container ===undefined || settings.container === window){
                fold=(window.innerWidth?window.innerWidth:$(window).height())+$window.scrollLeft();
            }else{
                fold=$(settings.container).offset().left + $(settings.container).width();
            }
            return fold <=$(self).offset().left - settings.threshold;
        }

        $window.ready(function () {
            setUpdata();
        });
        $window.resize(function () {
            setUpdata();
        })
    }
})(jQuery,window);