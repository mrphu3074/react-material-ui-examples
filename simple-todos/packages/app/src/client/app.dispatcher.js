Dispatcher = new IZFlux.Dispatcher();

Dispatcher.register(function(payload){
    switch (payload.actionType) {
        case CONST.SHOW_GLOBAL_LOADING:
            AppStore.setLoading(true);
        break;
        case CONST.HIDE_GLOBAL_LOADING:
            AppStore.setLoading(false);
        break;
        case CONST.LISTS_READY:
        break;
        case CONST.TASKS_READY:
            AppStore.setLoading(false);
        break;
        case CONST.TOGGLE_LISTS_NAV:
            AppStore.toggleListsNav();
        break;
        case CONST.SHOW_LIST_DIALOG:
            AppStore.toggleAddingList();
            AppStore.closeListsNav();
        break;
        case CONST.ADD_LIST:
            AppStore.addList(payload.name, payload.callback || null);
        break;
        case CONST.ADD_TASK_DIALOG:
            AppStore.toggleAddingTask();
        break;

        default:
            return;
    }
});
