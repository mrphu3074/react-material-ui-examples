var {
    LeftNav,
    FlatButton,
    FontIcon
} = MUI;

ListsNav = React.createClass({
    propTypes: {
        selectedList: React.PropTypes.object,
        lists: React.PropTypes.array,
        show: React.PropTypes.bool
    },
    getDefaultProps: function() {
        return {
            selectedList: {},
            lists: [],
            show: false
        };
    },
    getInitialState: function() {
        return {

        }
    },

    componentWillMount: function() {
    },

    componentWillUpdate: function(nextProps, nextState) {
        if( nextProps.show != this.props.show ) {
            this.refs.ListsNav.toggle();
        }
    },

    render: function() {
        return (
            <LeftNav ref="ListsNav" header={ this.renderHeader() } menuItems={this.props.lists} docked={false} />    
        );
    },

    renderHeader: function() {
        var styles = {
            headerContainer: {
                backgroundColor: "#00bcd4",
                width: "100%",
                minHeight: "64px",
                overflow: "hidden",
                color: "#fff",
                boxShadow: "0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24)"
            },
            headerTitle: {
                paddingLeft: "20px"
            },
            headerActions: {
                margin: "0 auto"
            },
            addListBtn: {
                width: "100%",
                paddingTop: "5px",
                paddingBottom: "5px"
            },
            noList: {
                display: "block",
                textAlign: "center",
                color: "#ddd"
            }
        };

        var noList = null;
        if( this.props.lists.length === 0 ) {
            noList = (
                <span style={ styles.noList }>No list here!</span>
            );
        }

        return (
            <div>
                <div style={ styles.headerContainer }>
                    <h2 style={ styles.headerTitle }>Todos App</h2>
                </div>
                <div style={ styles.headerActions }>
                    <FlatButton secondary={true} style={ styles.addListBtn } onTouchTap={ AppActions.showListDialog } >
                        <FontIcon className="fa fa-plus"/> new list
                    </FlatButton>
                    {noList}
                </div>
            </div>
        );
    }
});
