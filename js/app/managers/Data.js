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
        currentProjectUUID,
        currentTaskUUID;

    function init () {

        projects = JSON.parse(localStorage.getItem('projects')) || {};

        tasks = JSON.parse(localStorage.getItem('tasks')) || {};
    }

    function saveItem (uuid, type, title, notes, status) {

        var item,
            event;

        if (uuid !== undefined) {

            switch (type) {

                case TYPE.PROJECT :
            
                    item = getProjectByUUID(uuid);

                    break;

                case TYPE.TASK :
            
                    item = getTaskByUUID(uuid);

                    break;
            }

            event = EVENT.ITEM_UPDATED;

        } else {

            item = {};

            item.uuid = Utils.createUUID();

            item.created = Date.now();

            item.type = type;

            event = EVENT.ITEM_SAVED;
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

        Broadcast.publish(event, {uuid : item.uuid, type : item.type});
    }

    function deleteItem (item) {

        switch (item.type) {

            case TYPE.PROJECT :

                delete projects[item.uuid];

                localStorage.setItem('projects', JSON.stringify(projects));

                break;

            case TYPE.TASK :

                delete tasks[item.uuid];

                localStorage.setItem('tasks', JSON.stringify(tasks));

                break;
        }

        return true;
    }

    function getProjectByUUID (uuid) {
        return projects[uuid];
    }

    return {

        EVENTS : EVENT,
        TYPES : TYPE,

        init : init,
        saveItem : saveItem,
        deleteItem : deleteItem,
        getProjectByUUID : getProjectByUUID,

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
        },

        getTaskByUUID : function (uuid) {
            return tasks[currentProjectUUID][uuid];
        }
    };

});