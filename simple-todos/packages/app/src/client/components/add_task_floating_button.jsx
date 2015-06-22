var {FloatingActionButton} = MUI;
AddTaskButton = React.createClass({
    propTypes: {
        show: React.PropTypes.bool
    },
    getDefaultProps: function() {
        return {
            show: false
        };
    },
    getInitialState: function() {
        return {
            bottom: "-100px"
        }
    },

    componentDidMount: function() {
        this.show();
    },

    show: function() {
        this.setState({bottom: "10px"});
    },

    hide: function() {
        this.setState({bottom: "-100px"});
    },

	render: function() {
        var styles = {
            container: {
                position: "fixed",
                right: "20px",
                bottom: this.state.bottom,
                transition: "all 0.5s ease",
            }
        };


		return (
			<div style={styles.container}>
                <FloatingActionButton iconClassName="fa fa-plus" onTouchTap={ AppActions.showTaskDialog } />
            </div>
		);
	}
});