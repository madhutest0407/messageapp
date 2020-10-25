window.messageApp = window.messageApp || {};
messageApp.postCollections;
messageApp.fetchPosts = function(containerElm) {
    if(!messageApp.postCollections){
        messageApp.postCollections = new messageApp.messageCollections({});
    }
    var pagination = $(containerElm).data("pagination") || "",
    postModel,
    postView;
    messageApp.postCollections.loadPosts(pagination).then(function(resp){
        $(containerElm).data("pagination",resp.pageToken);
        messageApp.processRequest = false;
        for(var i=0;i<resp.messages.length;i++){
            postModel = messageApp.postCollections.addModel(resp.messages[i]);
            postView = new messageApp.messageView(postModel,containerElm);
            postModel.setView(postView.cid,postView);
        }
        $(containerElm).find(".actionBar").unbind("click").bind("click",function(e){
            var id = $(this).find(".del").data("id");
            var model = messageApp.utils.fetchModel(id);
            var cid = $(this).parents(".outerDiv").data("viewId");
            if(model){
                model.removeView(cid);
                $(this).parents(".outerDiv").remove();
            }
        });    
    },function(){
        window.console.log("Error in fetching posts");
    })
}

var bindEventsforContainer = function(containerElm){
    var touchStartX = 0,
    touchEndX = 0,
    touchStartY=0,
    touchEndY=0;
    var startTouch = function(e){
        touchStartX = e.changedTouches[0].screenX;
        touchStartY=e.changedTouches[0].screenY;
    };
    var moveTouch = function(e){
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        var el = e.srcElement;
        var parent = $(el).parents(".outerDiv"),
        actionBar = parent.find(".actionBar"),
        innerStyle = parent.find(".innerStyle");
        if(touchEndX > touchStartX && touchEndY-touchStartY === 0){
            if(actionBar.is(":hidden")){
                actionBar.show();
            }
            var actionWidth = actionBar.width()+5;
            var marginLeft = parseInt(innerStyle.css("margin-left"))+5;
            if(actionWidth>50){
                actionWidth = 50;
            }
            if(marginLeft>40){
                marginLeft = 40;
            }
            actionBar.css("width",actionWidth+"px");
            innerStyle.css("margin-left",marginLeft+"px");
            actionBar.css("height",innerStyle.height()+"px");
        } else if (touchEndX < touchStartX && touchEndY-touchStartY === 0){
            var actionWidth = actionBar.width()-5;
            var marginLeft = parseInt(innerStyle.css("margin-left"))-5;
            if(actionWidth<0){
                actionWidth = 0;
                actionBar.hide();
            }
            if(marginLeft<0){
                marginLeft = 0;
            }
            actionBar.css("width",actionWidth+"px");
            innerStyle.css("margin-left",marginLeft+"px");
        }
    };
    var endTouch = function(e){
        touchStartX = 0;
        touchEndX = 0;
    };
    containerElm.addEventListener("touchstart", startTouch, false);
    containerElm.addEventListener("touchmove", moveTouch, false);
    containerElm.addEventListener("touchend", endTouch, false);

  };

messageApp.loadPosts = function(initialFetch){
    if(initialFetch){
        $(".headerArea").width($(".Container").width()-30);
        $(".parentContainer").css("max-height", 0.95*$(window).height());
        messageApp.fetchPosts($(".Container"));
        bindEventsforContainer($(".Container")[0]);
    } else {
        var scrollEle = $(".Container")[0];
        const scrollPercent = Math.round(((scrollEle.scrollTop + scrollEle.offsetHeight) * 100) /
        scrollEle.scrollHeight);
        if(scrollPercent >= 60){ 
            if(!messageApp.processRequest){
                messageApp.processRequest=true;
                messageApp.fetchPosts($(".Container"));
            }
        }
    }
}
