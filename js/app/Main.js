// define dependent files
define(['utilities/Broadcast', 'utilities/Templates', 'utilities/Strings', 'managers/Data', 'components/Dialog', 'components/Info', 'components/List', 'components/ListItem', 'elements/TextInput', 'elements/Textarea'], 
    function(Broadcast, Templates, Strings, DataManager, UIDialog, UIInfo, UIList, UIListItem, UITextInput, UITextarea) {

    'use strict';

    var Main,
        projectsList,
        createProjectDialog,
        elNewProjectBtn,
        tasksList,
        createTaskDialog,
        elWrapper,
        elTaskInfo,
        elNewTaskBtn,
        projects,
        tasks,
        currentProjectUUID,
        currentTaskIdx;

    function init () {

        var templates = {

            LIST_ITEM : 'templates/ListItem.tpl'
        }

        DataManager.init();

        Broadcast.subscribe(Templates.EVENTS.LOAD_COMPLETE, onTemplatesLoaded);
        
        Templates.load(templates);
    }

    function onTemplatesLoaded (files) {

        var dialog_desc = UIDialog.descriptor(),
            field_desc;

        UIListItem.init(files.LIST_ITEM);

        elWrapper = document.querySelector('#wrapper');

        projectsList = UIList.create('#projects');

        elNewProjectBtn = document.querySelector('#new-project-btn');

        elNewProjectBtn.addEventListener('click', onNewProject);

        tasksList = UIList.create('#tasks');

        dialog_desc.id = 'project';
        dialog_desc.fields = {};

        field_desc = UITextInput.descriptor();
        field_desc.name = 'title';
        field_desc.placeholder = 'Project title';
        field_desc.type = UITextInput.TYPES.TEXT;
        field_desc.maxlength = 64;
        dialog_desc.fields[field_desc.name] = UITextInput.create(field_desc);

        field_desc = UITextInput.descriptor();
        field_desc.name = 'uuid';
        field_desc.type = UITextInput.TYPES.HIDDEN;
        dialog_desc.fields[field_desc.name] = UITextInput.create(field_desc);

        dialog_desc.onSubmitCallback = onDialogSubmit;

        createProjectDialog = UIDialog.create(dialog_desc);

        dialog_desc.id = 'task';
        dialog_desc.fields = {};

        field_desc = UITextInput.descriptor();
        field_desc.placeholder = 'Task title';
        field_desc.name = 'title';
        field_desc.type = UITextInput.TYPES.TEXT;
        field_desc.maxlength = 64;
        dialog_desc.fields[field_desc.name] = UITextInput.create(field_desc);

        field_desc = UITextarea.descriptor();
        field_desc.placeholder = 'Task notes';
        field_desc.name = 'notes';
        field_desc.maxlength = 256;
        dialog_desc.fields[field_desc.name] = UITextarea.create(field_desc);

        field_desc = UITextInput.descriptor();
        field_desc.name = 'uuid';
        field_desc.type = UITextInput.TYPES.HIDDEN;
        dialog_desc.fields[field_desc.name] = UITextInput.create(field_desc);

        dialog_desc.onSubmitCallback = onDialogSubmit;

        createTaskDialog = UIDialog.create(dialog_desc);

        elWrapper.appendChild(createProjectDialog.el);
        elWrapper.appendChild(createTaskDialog.el);

        elNewTaskBtn = document.querySelector('#new-task-btn');

        elNewTaskBtn.addEventListener('click', onNewTask);

        elTaskInfo = UIInfo.create();

        projects = {};

        tasks = {};

        Broadcast.subscribe(UIListItem.EVENT.SELECT, onItemSelected);
        Broadcast.subscribe(UIListItem.EVENT.EDIT, onItemEdit);
        Broadcast.subscribe(UIListItem.EVENT.DELETE, onItemDelete);
        Broadcast.subscribe(UIListItem.EVENT.CHECKED, onItemChecked);
        Broadcast.subscribe(DataManager.EVENTS.ITEM_SAVED, onItemSaved);
        Broadcast.subscribe(DataManager.EVENTS.ITEM_UPDATED, onItemUpdated);

        updateProjects();
    }

    function onDialogSubmit (data) {

        var type = data.id === 'task' ? DataManager.TYPES.TASK : DataManager.TYPES.PROJECT,
            uuid = (data.fields.uuid !== undefined && Strings.isNotEmpty(data.fields.uuid.getValue())) ? data.fields.uuid.getValue() : undefined,
            title = (data.fields.title !== undefined && Strings.isNotEmpty(data.fields.title.getValue())) ? data.fields.title.getValue() : undefined,
            notes = (data.fields.notes !== undefined && Strings.isNotEmpty(data.fields.notes.getValue())) ? data.fields.notes.getValue() : undefined;

        console.log(notes);
        
        DataManager.saveItem(uuid, type, title, notes, 0);

        createProjectDialog.hide();
        createTaskDialog.hide();
    }

    function onItemSaved (data) {

        switch (data.type) {

            case DataManager.TYPES.PROJECT:
        
                addItem(DataManager.getProjectByUUID(data.uuid), projectsList);
                break;

            case DataManager.TYPES.TASK:
        
                addItem(DataManager.getTaskByUUID(data.uuid), tasksList);
                break;

            default:
                break;
        }
    }

    function onItemUpdated (uuid) {

        updateItem(DataManager.getProjectByUUID(uuid), projectsList);
    }

    function addItem (data, list) {

        var item_data = UIListItem.data(),
            item;

        item_data.uuid = data.uuid;
        item_data.type = data.type;
        item_data.title = data.title;
        item_data.notes = data.notes;
        item_data.created = data.created;
        item_data.status = data.status;

        item = UIListItem.create(item_data);

        item.setSelected(item.uuid === DataManager.getCurrentProjectUUID() || item.uuid === DataManager.getCurrentTaskUUID());

        list.add(item);

        switch (item.type) {

            case DataManager.TYPES.PROJECT :

                projects[item.uuid] = item;

                break;

            case DataManager.TYPES.TASK :

                tasks[item.uuid] = item;

                break;
        }
    }

    function updateItem (data, list) {

        var item = projects[data.uuid],
            item_data = UIListItem.data();

        item_data.uuid = data.uuid;
        item_data.type = data.type;
        item_data.title = data.title;
        item_data.notes = data.notes;
        item_data.created = data.created;
        item_data.status = data.status;

        item.update(item_data);
    }

    function updateProjects () {

        var key,
            projects_data = DataManager.getProjects();

        projectsList.reset();

        for (key in projects_data) {

            addItem(projects_data[key], projectsList);
        }
    }

    function updateTasks (uuid) {

        var key,
            tasks_data = DataManager.getTasks(uuid);

        tasksList.reset();

        for (key in tasks_data) {

            addItem(tasks_data[key], tasksList);
        }
    }

    function onNewProject (e) {

        createProjectDialog.show();

        elTaskInfo.reset();

        e.preventDefault();
    }

    function onNewTask (e) {

        createTaskDialog.show();

        elTaskInfo.reset();

        e.preventDefault();
    }

    function onItemSelected (item) {

        elTaskInfo.reset();

        switch (item.type) {

            case DataManager.TYPES.PROJECT :

                if (item.selected) {

                    tasksList.reset();
                }

                if (DataManager.getCurrentProjectUUID() !== undefined) {
                    projects[DataManager.getCurrentProjectUUID()].setSelected(false);
                }

                elNewTaskBtn.classList.remove('remove');

                DataManager.setCurrentProjectUUID(item.uuid);

                DataManager.setCurrentTaskUUID(undefined);

                updateTasks(DataManager.getCurrentProjectUUID());

                break;

            case DataManager.TYPES.TASK :

                if (DataManager.getCurrentTaskUUID() !== undefined) {
                    tasks[DataManager.getCurrentTaskUUID()].setSelected(false);
                }

                DataManager.setCurrentTaskUUID(item.uuid);

                elTaskInfo.update(item);

                break;
        }
    }

    function onItemChecked (item) {

        item.status = item.status === 0 ? 1 : 0;

        DataManager.saveItem(item.uuid, item.type, item.title, item.notes, item.status);
    }

    function onItemEdit (item) {

        var data = {};

        switch (item.type) {

            case DataManager.TYPES.PROJECT :

                data.uuid = item.uuid;
                data.title = item.title;

                createProjectDialog.show(data);

                break;

            case DataManager.TYPES.TASK :

                data.uuid = item.uuid;
                data.title = item.title;
                data.notes = item.notes;

                createTaskDialog.show(data);

                break;
        }
    }

    function onItemDelete (item) {

        switch (item.type) {

            case DataManager.TYPES.PROJECT :

                tasksList.reset();

                if (projects[item.uuid] !== undefined) {

                    projectsList.remove(projects[item.uuid]);

                    projects[item.uuid] = undefined;

                    tasks[item.uuid] = undefined;
                }

                DataManager.setCurrentProjectUUID(undefined);

                DataManager.setCurrentTaskUUID(undefined);

                break;

            case DataManager.TYPES.TASK :

                elTaskInfo.reset();

                tasks[item.uuid] = undefined;

                DataManager.setCurrentTaskUUID(undefined);

                elTaskInfo.update(item);

                break;
        }

        DataManager.deleteItem(item);
    }

    Main = {
        init : init
    };

    return Main;
});