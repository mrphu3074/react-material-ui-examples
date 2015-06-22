var {
	Dialog,
	TextField
	} = MUI;
AddListForm = React.createClass({
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
            this.refs.addListDialog.show();
        }
    },

	_onDialogSubmit: function() {
		var name = this.refs.newListName.getValue().trim();
		if( name.length <= 0 ) {
			this.refs.newListName.setErrorText("List name cannot empty!");
			return;
		}
		this.refs.newListName.setErrorText("");
		this.refs.newListName.clearValue("");
		var self = this;
		AppActions.addList(name);
		this.refs.addListDialog.dismiss();
	},
	render: function() {
		var styles = {
			textInput: {
				width: "100%"
			}
		};

		var actions = [
		  	{ text: 'Cancel' },
  			{ text: 'Submit', onTouchTap: this._onDialogSubmit, ref: 'submit' }
		];
		return (
			<Dialog
				ref="addListDialog"
                title="New List"
                actions={actions}
                actionFocus="submit" >
                <TextField
                	ref="newListName"
                	style={styles.textInput}
                	hintText="Projects, Personal,..."
                	floatingLabelText="List name" />
            </Dialog>
		);
	}
});