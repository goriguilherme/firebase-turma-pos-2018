const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.onTasksCreate = functions
    .database
    .ref('tasks/{taskId}')
    .onCreate((snapshot, context) => {

        const json = snapshot.val();
        const key = context.params.taskId;
        
        const newObj = Object.assign({createdAt: context.timestamp}, json);
        
        const log = {
            'registerCreated': newObj
        };

        return admin
            .database()
            .ref(`/logs/${key}`)
            .set(log);
    });

exports.onTasksUpdate = functions
    .database
    .ref('tasks/{taskId}')
    .onUpdate((snapshot, context) => {

        const json = snapshot.after.toJSON();
        const key = context.params.taskId;
        
        const newObj = Object.assign({alteredAt: context.timestamp}, json);

        const log = {
            'registerAltered': newObj
        };

        return admin
            .database()
            .ref(`/logs/${key}`)
            .update(log);
});

exports.onTasksDelete = functions
    .database
    .ref('tasks/{taskId}')
    .onDelete((snapshot, context) => {

        const json = snapshot.val();
        const key = context.params.taskId;
        
        const newObj = Object.assign({deletedAt: context.timestamp}, json);

        const log = {
            'registerDeleted': newObj
        };

        return admin
            .database()
            .ref(`/logs/${key}`)
            .set(log);
});
// exports.onTasksChanges = functions
// .database
// .ref('tasks')
// .onWrite((snapshot, context) => {
//     const log = {
//         'register': snapshot.after.toJSON(),
//         'updateAt': context.timestamp
//     };
//     return admin.database()
//         .ref('/logs')
//         .push(log);
// });