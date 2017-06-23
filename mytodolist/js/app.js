var MyTodoList = (function () {
    //private 变量
    var defaults = {
        // CSS selectors and attributes that would be used by the JavaScript functions
        todoTask: "todo-task",
        todoHeader: "task-header",
        todoDate: "task-date",
        todoDescription: "task-description",
        taskId: "task-",
        formId: "todo-form",
        dataAttribute: "data",
        deleteDiv: "delete-div",
        remove: "remove",
        removeAll: "removeAll"
    },
        codes = {
            "1": "#pending", // For pending tasks
            "2": "#inProgress",
            "3": "#completed"
        },
        //数据存储对象
        data = {};
    

    //return出，即公共变量
    var MyTodoList = function () {
        var _this = this;
        $('#datepicker').datepicker();
        //初始化，将localStorage中的数据渲染到view中
        _this.data = JSON.parse(localStorage.getItem('maizi')) || {};
        for (var property in _this.data){
            if(_this.data.hasOwnProperty(property)){
                _this.generateElement({
                    id:property,
                    code: _this.data[property].code,
                    title: _this.data[property].title,
                    date: _this.data[property].date,
                    description: _this.data[property].description
                })
            }
        }


        //添加新增项目的hander
        $("#addItem").click(function () {
            //获取要新增的数据
            var title = $(this).siblings('.addTitle').val(),
                description = $(this).siblings('.addDescriptions').val(),
                date = $(this).siblings('.addDate').val(),
                id = Date.now() + '';

            //创建DOM
            _this.generateElement({
                code: "1",
                id: id,
                title: title,
                date: date,
                description: description
            });
            //重置form表单内的数据
            $(this).siblings('.addTitle').val('');
            $(this).siblings('.addDescriptions').val('');
            $(this).siblings('.addDate').val('');

            //将数据更新至data
            _this.data[id]={
                code:'1',
                title:title,
                date:date,
                description:description
            }
            //存储数据到localStorage
            _this.persistData();
        });

        //remove按钮的hander
        $('body').on('click', '.todo-task .remove', function(){
            //获取要删除的elem的id
            var id = $(this).parent().attr("id").substring(defaults.taskId.length);
            //删除Dom
            _this.removeElement({
                id: id
            });
            //删除数据
            delete _this.data[id];
            //存储至localStorage
            _this.persistData();
        });

        //三个放置区的droppable
        $.each(codes, function(index, value){
            $(value).droppable({
                drop:function(event, ui){
                    //获取要移动的elem
                    var element = ui.helper,
                        id = element.attr("id").substring(defaults.taskId.length),
                        item = _this.data[id];
                        console.log(item);
                    //此处更新数据的code，无需删除！
                    item.code = index;
                    //删除DOM
                    _this.removeElement({
                        id:id
                    });
                    //新增DOM
                    _this.generateElement({
                        id: id,
                        code: item.code,
                        title: item.title,
                        date: item.date,
                        description: item.description
                    });
                    //数据存储至localStorage
                    _this.persistData();
                }
            });
        });

        //删除区域的drappable
        $('#' + defaults.deleteDiv).droppable({
            drop: function(event, ui){
                //获取要删除的elem
                var element = ui.helper,
                    id = element.attr('id').substring(defaults.taskId.length);
                //删除DOM
                _this.removeElement({
                        id:id
                });
                //删除数据
                delete _this.data[id];
                //存储localStorage
                _this.persistData();
            }
        });

        //添加删除全部的hander
        $('#' + defaults.removeAll).click(function(){
            //重置数据
            _this.data = {};
            //存储至localStorage
            _this.persistData();
            //移除Dom
            $("."+ defaults.todoTask).remove();
        });
    };

    //MyTodoList的原型function

    //将data数据存储到localStorage
    MyTodoList.prototype.persistData = function(){
        localStorage.setItem('maizi', JSON.stringify(this.data));
    };
    //新增元素DOM及其draggable
    MyTodoList.prototype.generateElement = function (params) {
        //获取要创建数据的放置区
        var parent = $(codes[params.code]),
            wrapper;
        //不存在放置区，则忽略
        if (!parent) {
            return;
        }
        //创建wrapper
        wrapper = $("<div />", {
            "class": defaults.todoTask,
            "id": defaults.taskId + params.id,
            "data": params.id
        });
        //添加删除按钮
        $("<div />", {
            "class": defaults.remove,
            "text": 'X'
        }).appendTo(wrapper);
        //添加title
        $("<div />", {
            "class": defaults.todoHeader,
            "text": params.title
        }).appendTo(wrapper);
        //添加date
        $("<div />", {
            "class": defaults.todoDate,
            "text": params.date
        }).appendTo(wrapper);
        //添加description
        $("<div />", {
            "class": defaults.todoDescription,
            "text": params.description
        }).appendTo(wrapper);
        //wrapper添加到放置区
        wrapper.appendTo(parent);
        //给wrapper添加draggable事件
        wrapper.draggable({
            opacity: 0.5,
            //draggable开始和结束时候的hander
            start:function(){
                $("#" + defaults.deleteDiv).show('fast');
            },
            stop:function(){
                $("#" + defaults.deleteDiv).hide('fast');;
            }
        })
    };

    //删除元素dom
    MyTodoList.prototype.removeElement = function (params) {
        $("#" + defaults.taskId + params.id).remove();
    };
    // 返回的公共变量-function
    return MyTodoList;
})();
