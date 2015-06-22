AppStore = IZFlux.createStore({
    name: "Todos App",
    _loading: new ReactiveVar(true),
    _appTitle: new ReactiveVar("Todos App"),
    _toggleListsNav: new ReactiveVar(false),
    _addingList: new ReactiveVar(false),
    _addingTask: new ReactiveVar(false),
    _currentList: new ReactiveVar(null),

    // Loading store
    setLoading: function(s) {
        this._loading.set(s);
        this.emitChange();
    },
    getLoading: function() {
        return this._loading.get();
    },    

    // Loading store
    setAppTitle: function(title) {
        this._appTitle.set(title);
        this.emitChange();
    },
    resetAppTitle: function() {
        this._appTitle.set(this.name);
        this.emitChange();        
    },
    getAppTitle: function() {
        return this._appTitle.get();
    },

    // Lists nav
    toggleListsNav: function() {
        var _curState = this._toggleListsNav.get();
        this._toggleListsNav.set(!_curState);
        this.emitChange();
    },
    closeListsNav: function() {
        this._toggleListsNav.set(false);
        this.emitChange();
    },
    isShowListsNav: function() {
        return this._toggleListsNav.get();
    },
    // adding list
    toggleAddingList: function() {
        var _curState = this._addingList.get();
        this._addingList.set(!_curState);
        this.emitChange();
    },
    getAddingList: function() {
        return this._addingList.get();
    },

    // adding task
    toggleAddingTask: function() {
        var _curState = this._addingTask.get();
        this._addingTask.set(!_curState);
        this.emitChange();
    },
    getAddingTask: function() {
        return this._addingTask.get();
    },

    // lists methods
    searchLists: function() {
        return Collection.Lists.find().fetch()
    },

    setCurrentList: function(list) {
        this._currentList.set(list);
        this.setAppTitle(list.text);
    },
    getCurrentList: function() {

        return currentList;
    },

    // tasks methods
    searchTasks: function() {
        return [
        ]
    },

    addList: function(name, callback) {
        Collection.Lists.insert({
            text: name,
            createdAt: new Date()
        }, callback);
    }
});
