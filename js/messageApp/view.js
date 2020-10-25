(function(){
    window.messageApp = window.messageApp || {};
    messageApp.messageView = Backbone.View.extend({
            
        render (messageData,containerElm) {
            var dom = messageApp.templates.messageTemplate(messageData.attributes,this);
            this.$el = dom;
            this.model = messageData;
            if(containerElm){
                $(containerElm).append(dom);
            }
            this.model.setView(this.cid);
            this.$el.data("viewId",this.cid);
            return this.$el;
        },
        initialize (messageData,containerElm) {
            this.el =  this.render(messageData,containerElm);
            return this.el;
        }
    });
    
}());
    