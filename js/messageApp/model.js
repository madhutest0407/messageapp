(function(){
window.messageApp = window.messageApp || {};
    messageApp.msgModel = Backbone.Model.extend({
        url: function(){
            return "http://message-list.appspot.com/messages";
        },
        defaults () {
            return {
                content:"",
                id:0
            }
        },

        setView (viewId, view) {
            var viewObj = this.get("views") || {};
            viewObj[viewId] = view;
            this.set("views", viewObj);
        },

        removeView (viewId) {
            var viewObj = this.get("views") || {};
            delete viewObj[viewId];
            if (_.isEmpty(viewObj)) {
                this.trigger("destroy", this);
            }
        }
    });

    messageApp.messageCollections = Backbone.Collection.extend({
        model: messageApp.msgModel,
        url: "http://message-list.appspot.com/messages",
        sync: function(method, model, options) {
            if(options && options.pageToken){
                this.url = "http://message-list.appspot.com/messages?+pageToken="+options.pageToken;
            }
            return Backbone.sync(method, model, options);
        },    
        addModel (messageModel){
            this.add(messageModel,{
                merge:true /** To avoid storing duplicate value */
            })
            return this._byId[messageModel.id];
        },
        loadPosts (pagination){
            const that = this;
            return new Promise(function(resolve,reject){
                var pagParam = (pagination)? {pageToken:pagination} : "";
                that.sync("loadPosts",that,pagParam).done(function(response){
                    resolve(response);
                }).fail(function(){
                    reject();
                })
            })
        },
    });
}());
