AppActions = {
	showGlobalLoading: function() {

	},
	hideGlobalLoading: function() {

	},
    listsReady: function() {
        Dispatcher.dispatch({actionType: CONST.LISTS_READY});
    },
    tasksReady: function() {
        Dispatcher.dispatch({actionType: CONST.TASKS_READY});
    },
    
    showListDialog: function() {
    	Dispatcher.dispatch({actionType: CONST.SHOW_LIST_DIALOG});
    },
    showTaskDialog: function() {
        Dispatcher.dispatch({actionType: CONST.SHOW_TASK_DIALOG});
    },    
    addList: function(name) {
    	var callback = function(err, id) {
    		if( !err ) {
    			Dispatcher.dispatch({actionType: CONST.HIDE_GLOBAL_LOADING});
    			AppStore.setCurrentList(Collection.Lists.findOne(id));
    		}
    	}
    	Dispatcher.dispatch({actionType: CONST.SHOW_GLOBAL_LOADING});
    	Dispatcher.dispatch({actionType: CONST.ADD_LIST, name: name, callback: callback});
    },
    addTask: function() {
        Dispatcher.dispatch({actionType: CONST.ADD_TASK});
    },
};
