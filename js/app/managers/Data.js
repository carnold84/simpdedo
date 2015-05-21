// define dependent files
define(['utilities/Utils', 'utilities/Broadcast'], function(Utils, Broadcast) {

    'use strict';

    var EVENT = {
            UPDATE : 'data/update',
            ITEM_SAVED : 'data/item_saved',
            ITEM_UPDATED : 'data/item_updated'
        },
        TYPE = {
            PROJECT : 'project',
            TASK : 'task'
        },
        projects,
        tasks,
        undo,
        currentProjectUUID,
        currentTaskUUID;

    function init () {

        projects = JSON.parse(localStorage.getItem('projects')) || {};

        tasks = JSON.parse(localStorage.getItem('tasks')) || {};
    }

    function saveItem (uuid, type, title, notes, status) {

        var item,
            evt;

        if (uuid !== undefined) {

            switch (type) {

                case TYPE.PROJECT :
            
                    item = getProjectByUUID(uuid);

                    break;

                case TYPE.TASK :
            
                    item = getTaskByUUID(uuid);

                    break;
            }

            evt = EVENT.ITEM_UPDATED;

        } else {

            item = {};

            item.uuid = Utils.createUUID();

            item.created = Date.now();

            item.type = type;

            evt = EVENT.ITEM_SAVED;
        }

        item.modified = Date.now();

        item.title = title;

        item.notes = notes;

        if (notes !== undefined) {

            item.notes = notes;
        }

        if (status !== undefined) {

            item.status = status;
        }

        switch (item.type) {

            case TYPE.PROJECT :

                projects[item.uuid] = item;

                localStorage.setItem('projects', JSON.stringify(projects));

                break;

            case TYPE.TASK :

                if (tasks[currentProjectUUID] === undefined) {

                    tasks[currentProjectUUID] = {};
                }

                tasks[currentProjectUUID][item.uuid] = item;

                localStorage.setItem('tasks', JSON.stringify(tasks));

                break;
        }

        Broadcast.publish(evt, {uuid : item.uuid, type : item.type});
    }

    function deleteItem (item) {

        switch (item.type) {

            case TYPE.PROJECT :

                undo = {
                    project : projects[item.uuid],
                    project_tasks : tasks[item.uuid]
                };

                delete projects[item.uuid];

                localStorage.setItem('projects', JSON.stringify(projects));

                delete tasks[item.uuid];

                localStorage.setItem('tasks', JSON.stringify(tasks));

                break;

            case TYPE.TASK :

                undo = {
                    project : projects[currentProjectUUID],
                    task : tasks[currentProjectUUID][item.uuid]
                };

                delete tasks[currentProjectUUID][item.uuid];

                localStorage.setItem('tasks', JSON.stringify(tasks));

                break;
        }

        return true;
    }

    function undo () {

        var project = undo.project,
            project_tasks = undo.project_tasks,
            task = undo.task,
            data = {};

        if (task !== undefined) {

            if (project) {

                tasks[project.uuid][task.uuid] = task;

                data.item = task;

                data.type = TYPE.TASK;

                localStorage.setItem('tasks', JSON.stringify(tasks));
            }
        } else if (project !== undefined) {

            projects[project.uuid] = project;

            localStorage.setItem('projects', JSON.stringify(projects));

            if (project_tasks !== undefined) {

                tasks[project.uuid] = project_tasks;
            }

            data.item = project;

            data.type = TYPE.PROJECT;

            localStorage.setItem('tasks', JSON.stringify(tasks));
        }

        return data;
    }

    function getProjectByUUID (uuid) {
        return projects[uuid];
    }

    function getTaskByUUID (uuid) {
        return tasks[currentProjectUUID][uuid];
    }

    return {

        EVENTS : EVENT,
        TYPES : TYPE,

        init : init,
        saveItem : saveItem,
        deleteItem : deleteItem,
        undo : undo,
        getProjectByUUID : getProjectByUUID,
        getTaskByUUID : getTaskByUUID,

        getProjects : function () {
            return projects;
        },

        getTasks : function (uuid) {
            return tasks[uuid];
        },

        getCurrentProjectUUID : function () {
            return currentProjectUUID;
        },

        setCurrentProjectUUID : function (uuid) {
            currentProjectUUID = uuid;
        },

        getCurrentTaskUUID : function () {
            return currentTaskUUID;
        },

        setCurrentTaskUUID : function (uuid) {
            currentTaskUUID = uuid;
        }
    };

});