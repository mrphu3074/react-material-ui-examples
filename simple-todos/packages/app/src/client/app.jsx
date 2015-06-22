cx = React.addons.classSet;
var {AppCanvas, AppBar, CircularProgress, FloatingActionButton} = MUI;

var AppState = function() {
    return {
        loading: AppStore.getLoading(),
        appTitle: AppStore.getAppTitle(),
        showListsNav: AppStore.isShowListsNav(),
        lists: AppStore.searchLists(),
        tasks: AppStore.searchTasks(),
        addingList: AppStore.getAddingList(),
        addingTask: AppStore.getAddingTask(),
    }
};

var App = React.createClass({
    mixins: [ReactMeteor.Mixin],
    themeManager: new MUI.Styles.ThemeManager(),

    // IMPORTANT. SET CHILD CONTEXT
    childContextTypes: {
        muiTheme: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            muiTheme: this.themeManager
        }
    },

    getInitialState: function() {
        return AppState();
    },

    startMeteorSubscriptions: function() {
        Meteor.subscribe("Lists", function() {
            AppActions.listsReady();
            var currentList = AppStore.getCurrentList();
            if( currentList )
                Meteor.subscribe('Tasks', AppActions.tasksReady);
            else
                AppActions.tasksReady();
        });
    },

    componentDidMount: function() {
        AppStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        AppStore.removeChangeListener(this._onChange);
    },
    _onChange: function() {
        this.setState(AppState());
    },

    render: function() {
        if( this.state.loading ) {
            return (
                <Loading circular={true} size={2} overlay={true} />
            );
        }
        return (
            <AppCanvas>
                <AppBar
                    title={this.state.appTitle}
                    onLeftIconButtonTouchTap={ ListsNavActions.toggle }/>
                <ListsNav show={this.state.showListsNav} lists={ this.state.lists } />
                <AddTaskButton />
                <AddListForm show={this.state.addingList} />
                <AddTaskForm show={this.state.addingTask} />
            </AppCanvas>
        );
    }
});

// Render app when startup
Meteor.startup(() => React.render(<App/>, document.body));
