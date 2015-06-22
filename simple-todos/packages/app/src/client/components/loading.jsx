var {CircularProgress, LinearProgress} = MUI;
Loading = React.createClass({
    propTypes: {
        overlay: React.PropTypes.bool,
        circular: React.PropTypes.bool,
        size: React.PropTypes.number
    },
    getInitialState: function() {
        return {}
    },
    getDefaultProps: function() {
        return {
            overlay: false,
            circular: false,
            size: 1.5,
        }
    },
    render: function() {
        var styles = {
            container: {
                textAlign: "center",
                height: "100%",
                paddingTop: "10% !important"
            },
            overlay: {
                position: "fixed",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                background: "rgba(255, 255, 255, 0.8) !important",
                zIndex: 9999
            }
        };

        if ( this.props.circular ) {
            var Progress = CircularProgress;
        } else {
            var Progress = LinearProgress;
        }

        var containerStyles = styles.container;
        if( this.props.overlay )
            containerStyles = _.extend(containerStyles, styles.overlay);

        return (
            <div style={containerStyles}>
                <Progress mode="indeterminate" size={this.props.size} />
            </div>
        )
    }
})
