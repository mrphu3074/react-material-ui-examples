var {Dialog} = MUI;
AddTaskForm = React.createClass({
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

        }
    },

    componentWillUpdate: function(nextProps, nextState) {
        if( nextProps.show != this.props.show ) {
            this.refs.addTaskDialog.show();
        }
    },

	_onDialogSubmit: function() {

	},
	render: function() {
		var actions = [
		  	{ text: 'Cancel' },
  			{ text: 'Submit', onTouchTap: this._onDialogSubmit, ref: 'submit' }
		];
		return (
			<Dialog
				ref="addTaskDialog"
                title="New Task"
                actions={actions}
                actionFocus="submit" >
                The actions in this window are created from the json that's passed in. 
            </Dialog>
		);
	}
});