if (Meteor.isClient) {
    Em = new EventEmitter();
    cx = React.addons.classSet;

    Session.set("currentListIndex", 0);
    Session.set("currentList", null);
    Session.set("editingTask", null);

    var App = React.createClass({
        mixins: [ReactMeteor.Mixin],
        themeManager: ThemeManager(),

        // IMPORTANT. SET CHILD CONTEXT
        childContextTypes: {
            muiTheme: React.PropTypes.object,
        },
        getChildContext: function() {
            return {
                muiTheme: this.themeManager
            }
        },

        getMeteorState: function() {
            return {
                appTitle: (Session.get("currentList") != null) ? Session.get("currentList").text : "Simple Todos"
            };
        },
        _onToggleList: function() {
            Em.emit("toggleLists");
        },
        render: function() {
            return (
                <AppCanvas>
                    <AppBar title={this.state.appTitle} onLeftIconButtonClick={this._onToggleList} />
                    <ListsNav />
                    <Tasks />
                    <AddTask />
                    <EditTaskDialog />
                    <DeleteTaskDialog />
                </AppCanvas>
            );
        }
    });

    var ListsNav = React.createClass({
        mixins: [ReactMeteor.Mixin],
        
        componentDidMount: function() {
            Em.on("hideLists", this._hideLists);
            Em.on("toggleLists", this._toggleLists);
        },
        getInitialState: function() {
            return {
                docked: false 
            };
        },
        getMeteorState: function() {
            var lists = Collection.Lists.find().map(function(r) {
                r.number = Collection.Tasks.find({listId: r._id}).count() + "";
                return r;
            });

            if( Session.get("currentList") == null && lists.length > 0)
                Session.set("currentList", lists[Session.get("currentListIndex")]);

            return {
                currentListIndex: Session.get("currentListIndex"),
                lists: lists
            };
        },
        _hideLists: function() {
            this.refs.listsNav.close()
        },
        _toggleLists: function() {
            this.refs.listsNav.toggle()
        },
        _onSelectList: function(e, selectedIndex, menuItem) {
            Session.set("currentListIndex", selectedIndex);
            Session.set("currentList", menuItem);
        },
        _onAddListDialogShow: function() {
            // on dialog show
            // if edit mode -> set list name
            // if new mode-> clear value
            // hide add task button
            Em.emit("addTaskButtonHide");
            Em.emit("hideLists");

            this.refs.listName.clearValue();
            this.refs.listName.focus();
        },
        _onAddListDialogDismiss: function() {
            Em.emit("addTaskButtonShow");
        },
        _onAddClick: function() {
            this.refs.addListDialog.show();
        },
        _onSubmitList: function() {
            var listName = this.refs.listName.getValue().trim();

            if(listName.length <= 0) {
                this.refs.listName.setErrorText("List name cannot empty.");
            } else {
                this.refs.listName.setErrorText("");
                var _id = Collection.Lists.insert({
                    text: listName
                });
                if(_id) {
                    Session.set('currentList', Collection.Lists.findOne(_id));
                    this.refs.addListDialog.dismiss();
                }
            }
        },
        render: function() {
            var addListStyle = {
                width: "100%",
                color: "#fff",
                padding: "13px 10px",
                backgroundColor: Colors.cyan500,
                boxShadow: "0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24)"
            };

            var leftNavHeader = (
                <FlatButton primary={true} style={addListStyle} onClick={this._onAddClick}>
                    <FontIcon className="fa fa-plus"/> &nbsp;
                    <span className="mui-flat-button-label" style={ {fontSize: "18px"} }>New list</span>
                </FlatButton>
            );
            var dialogActions = [
                { text: 'Cancel' },
                { text: 'Submit', onClick: this._onSubmitList, ref: 'submit' }
            ];
            return (
                <div>
                    <LeftNav
                    ref="listsNav"
                    docked={this.state.docked}
                    menuItems={this.state.lists}
                    header={leftNavHeader}
                    selectedIndex={this.state.currentListIndex}
                    onChange={this._onSelectList} />

                    <Dialog
                        ref="addListDialog"
                        title="Enter new list"
                        actions={dialogActions}
                        actionFocus="submit"
                        modal={true}
                        dismissOnClickAway={true}
                        onShow={this._onAddListDialogShow}
                        onDismiss={this._onAddListDialogDismiss}>
                        
                        <TextField
                            ref="listName"
                            hintText="Personal, Projects, ..."
                            floatingLabelText="List name"
                            style={ {width: "100%"} } />
                    </Dialog>
                </div>
            );
        }
    })

    var AddTask = React.createClass({
        mixins: [ReactMeteor.Mixin],

        componentDidMount: function () {
            var self = this;
            Em.on('addTaskButtonHide', function() {
                self.setState({out: true});
            });
            Em.on('addTaskButtonShow', function() {
                self.setState({out: false});
            });

        },

        getMeteorState: function () {
            return {
                out: false
            };
        },

        _onClickAddTask: function() {
            this.refs.addTaskDialog.show();
        },

        _onAddTaskDialogShow: function() {
            this.refs.taskContent.clearValue();
            Em.emit('addTaskButtonHide');
        },

        _onAddTaskDialogDismiss: function() {
            Em.emit('addTaskButtonShow');
        },
        _onSubmitTask: function() {
            if(Session.get("currentList") == null)
                return;

            var taskContent = this.refs.taskContent.getValue().trim();

            if(taskContent.length <= 0) {
                this.refs.taskContent.setErrorText("Content cannot empty.");
            } else {
                this.refs.taskContent.setErrorText("");
                var _id = Collection.Tasks.insert({
                    text: taskContent,
                    done: false,
                    listId: Session.get("currentList")._id,
                    trash: false,
                    createdAt: new Date()
                });
                if(_id) {
                    this.refs.addTaskDialog.dismiss();
                }
            }
        },
        render: function() {
            var styles = {
                width: "100%",
                position: "fixed",
                bottom: '10px',
                textAlign: 'center'
            };
            var className = cx({
                "add-task-btn": true,
                "out": this.state.out
            })
            var dialogActions = [
                { text: 'Cancel' },
                { text: 'Submit', onClick: this._onSubmitTask, ref: 'submit' }
            ];
            return (
                <div>
                    <div style={styles} className={className}>
                        <FloatingActionButton iconClassName="fa fa-plus" primary={true} onClick={this._onClickAddTask} />
                    </div>
                    <Dialog
                        ref="addTaskDialog"
                        title="New task"
                        actions={dialogActions}
                        actionFocus="submit"
                        modal={true}
                        dismissOnClickAway={true}
                        onShow={this._onAddTaskDialogShow}
                        onDismiss={this._onAddTaskDialogDismiss}>
                        
                        <TextField
                            ref="taskContent"
                            floatingLabelText="Type to add new task"
                            style={ {width: "100%"} } />
                    </Dialog>           
                </div>
            );
        }
    });

    var Tasks = React.createClass({
        mixins: [ReactMeteor.Mixin],
        getMeteorState: function() {
            var tasks = [];
            if( Session.get("currentList") != null ) {
                tasks = Collection.Tasks.find({listId: Session.get("currentList")._id, trash: false}, {sort: {createdAt: -1}}).fetch();
            }
            return {
                tasks: tasks
            };
        },
        renderTask: function(model) {
            return (
                <Task model={model} />
            );
        },
        render: function() {
            if(this.state.tasks.length > 0) {
                var tasksStyle = {
                    overflow: 'hidden',
                    padding: '0',
                    margin: '0',
                    paddingTop: "64px"
                };
                var content = (
                        <div style = {tasksStyle}>
                            {this.state.tasks.map(this.renderTask)}
                        </div>
                    );
            } else {
                var content = (
                    <div style={ {paddingTop: "100px", textAlign: "center"} }>
                        <h3 style={ {color: "#333"} }>No tasks here</h3>
                        <p style={ {color: "#444"}}>Click <i className="fa fa-plus"></i> buton to add new task. </p>
                    </div>
                );
            }
            return content;
        }
    });

    var Task = React.createClass({
        mixins: [ReactMeteor.Mixin],
        getInitialState: function() {
            return {
                selected: false
            }
        },
        getMeteorState: function() {
            return this.props.model ? this.props.model : {};
        },
        timeAgo: function() {
            return moment(this.state.createdAt).from();
        },
        _onCheck: function(e, checked) {
            this.setState({done: checked});
            Collection.Tasks.update({_id: this.state._id}, {$set: {done: checked}});
        },
        _onSelect: function() {
            var selected = !this.state.selected;
            this.setState({selected: selected})
        },
        _onEditTask: function() {
            Em.emit('editTask', this.state._id);
        },
        _onDeleteTask: function() {
            Em.emit('deleteTask', this.state._id);  
        },
        render: function() {
            var taskStyle = {
                width: "95%",
                margin: "15px auto",
                padding: "20px 15px",
                overflow: "hidden",
                clear: "both",
                position: "relative"
            };
            var statusStyle = {
                float: "left",
                width: "25px",
                height: "100%",
                padding: "6px 0"
            };
            var textStyle = {
                margin: "0",
                padding: "4px",
                fontWeight: "lighter",
                float: "left",
                width: "88%",
                fontSize: "1.5em"
            };
            if( this.state.done ) {
                textStyle['textDecoration'] = 'line-through';
            }

            var timeAgoStyle = {
                display: "block",
                clear: "both",
                fontSize: "13px",
                color: "#666",
                paddingLeft: "30px"
            };
            var actionsStyle = {
                position: "absolute",
                top: "0px",
                right: "-200px",
                height: "100%",
                borderLeft: "1px solid " + Colors.grey200,
                transition: "all 0.3s ease"
            };
            if(this.state.selected) {
                actionsStyle['transform'] = "translate3d(-200px, 0px, 0px)";
            }else{
                actionsStyle['transform'] = "translate3d(0px, 0px, 0px)";
            }
            return (
                <Paper style={taskStyle}>
                    <div style={statusStyle}>
                        <Checkbox checked={this.state.done} onCheck={this._onCheck} />    
                    </div>
                    <h3 onClick={this._onSelect} style={textStyle}>{this.state.text}</h3>
                    <span style={ timeAgoStyle }>{this.timeAgo()}</span>
                    <div style={actionsStyle}>
                        <FlatButton label="Edit" onClick={this._onEditTask} rippleColor={Colors.cyan500} hoverColor={Colors.cyan500} style={ {height: "100%"} } />
                        <FlatButton label="Delete" onClick={this._onDeleteTask} rippleColor={Colors.red500} hoverColor={Colors.red500} style={ {height: "100%"} } />
                    </div>
                </Paper>
            );
        }
    });

    var EditTaskDialog = React.createClass({
        mixins: [ReactMeteor.Mixin],
        componentDidMount: function () {
            var self = this;
            Em.on('editTask', function(taskId) {
                self.setState({taskId: taskId});
                self.refs.editTaskDialog.show();
            });
        },
        getInitialState: function () {
            return {
                taskId: null  
            };
        },
        getMeteorState: function () {
            var model = this.state.taskId ? Collection.Tasks.findOne(this.state.taskId) : null;
            if(model != null) {
                this.refs.taskContent.setValue(model.text);
            }
            return {
                model: model
            };
        },
        _onDialogShow: function() {
            Em.emit("addTaskButtonHide");
        },
        _onDialogDismiss: function() {
            Em.emit("addTaskButtonShow")
        },
        _onEditTask: function() {
            var taskContent = this.refs.taskContent.getValue().trim();
            if(taskContent.length > 0) {
                this.refs.taskContent.setErrorText("");
                Collection.Tasks.update({_id: this.state.taskId}, {$set: {text: taskContent} });
                this.refs.editTaskDialog.dismiss();
            } else {
                this.refs.taskContent.setErrorText("Content cannot empty!");
            }
        },
        render: function() {
            var dialogActions = [
                { text: 'Cancel' },
                { text: 'Save', onClick: this._onEditTask, ref: 'submit' }
            ];
            return (
                <Dialog
                        ref="editTaskDialog"
                        title="Edit task"
                        actions={dialogActions}
                        modal={true}
                        dismissOnClickAway={true}
                        onShow={this._onDialogShow}
                        onDismiss={this._onDialogDismiss}>
                    <TextField ref="taskContent" />
                </Dialog>
            );
        }
    });
    var DeleteTaskDialog = React.createClass({
        mixins: [ReactMeteor.Mixin],
        componentDidMount: function () {
            var self = this;
            Em.on('deleteTask', function(taskId) {
                self.setState({taskId: taskId})
                self.refs.deleteTaskDialog.show();
            })  
        },
        getInitialState: function () {
            return {
                taskId: null  
            };
        },
        _onDialogShow: function() {
            Em.emit("addTaskButtonHide");
        },
        _onDialogDismiss: function() {
            Em.emit("addTaskButtonShow")
        },
        _onDeleteTask: function() {
            Collection.Tasks.update({_id: this.state.taskId}, {$set: {trash: true}});
            this.refs.deleteTaskDialog.dismiss();
            this.refs.noty.show();
            Em.emit("addTaskButtonHide")
        },
        _undoTask: function() {
            Collection.Tasks.update({_id: this.state.taskId}, {$set: {trash: false}});
            this.refs.noty.dismiss();
            Em.emit("addTaskButtonShow")
        },
        render: function() {
            var dialogActions = [
                { text: 'Cancel' },
                { text: 'Delete', onClick: this._onDeleteTask, ref: 'submit' }
            ];
            var deleteMessage = "Are you sure you want to delete this task?";
            return (
                <div>
                    <Dialog
                        ref="deleteTaskDialog"
                        title={deleteMessage}
                        actions={dialogActions}
                        modal={true}
                        dismissOnClickAway={true}
                        onShow={this._onDialogShow}
                        onDismiss={this._onDialogDismiss}>
                    </Dialog>
                    <Snackbar
                        ref="noty"
                        message="Task deleted!"
                        action="undo"
                        onActionClick={this._undoTask} />
                </div>
            );
        }
    });

    Meteor.startup(() => React.render(<App/>, document.body));
}

