Package.describe({
    name: "app"
});

Package.onUse(function(api) {
    var both = ['client', 'server'];
    var path = {
        client: 'src/client',
        server: 'src/server',
        both: 'src/both',
    };
    api.use(['underscore']);
    api.use([
        "reactive-var",
        "templating",
        "fortawesome:fontawesome",
        "momentjs:moment",
        "izzilab:material-ui",
        "izzilab:iz-flux"
    ], 'client');

    api.addFiles([
        path.both + '/collections.js'
    ], both);

    api.addFiles([
        path.server + '/publications.js'
    ], 'server');

    api.addFiles([
        path.client + '/stores/app.store.js',
        path.client + '/constants/constants.js',
        path.client + '/app.dispatcher.js',
        path.client + '/actions/app.actions.js',
        path.client + '/actions/lists_nav.actions.js',
        path.client + '/components/loading.jsx',
        path.client + '/components/lists_nav.jsx',
        path.client + '/components/add_list_form.jsx',
        path.client + '/components/add_task_form.jsx',
        path.client + '/components/add_task_floating_button.jsx',
        path.client + '/app.css',
        path.client + '/app.html',
        path.client + '/app.jsx',
    ], 'client');
});
