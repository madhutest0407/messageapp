messageApp.templates = (function(){    
    return {
        actionBar: function(templateData){
            var outerBar = $("<div class=actionBar></div>");
            var deleteDiv = $("<div class=del data-id="+templateData.id+">Delete</div>");
            outerBar.append(deleteDiv);
            return outerBar;
        },
        messageTemplate : function(templateData){
            var author = templateData.author;
            var outerTemp = $("<div class=outerDiv data-id="+templateData.id+"></div>");
            var innerTemp = $("<div class=innerStyle></div>");
            var spanTag = $("<span></span>");
            var wrapperTag = $("<div ></div>");
            wrapperTag.append("<img class=imageCss src=\'"+author.photoUrl+"\'/>");
            spanTag.append(wrapperTag);
            wrapperTag.append("<div class=authorName><strong>"+author.name+"</strong></div>");
            innerTemp.append(spanTag);
            innerTemp.append("<div class=timeheader><small class=timeClass>"+messageApp.utils.timeDifference(new Date(templateData.updated))+"</small></div>")
            innerTemp.append("<div class=content>"+templateData.content+"</div>")
            outerTemp.append(innerTemp);
            var actionBar = this.actionBar(templateData);
            outerTemp.prepend(actionBar)
            return outerTemp;
        }
    };
}());
    