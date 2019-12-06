$(() => {
  let todoTasks = [];
  let todoTasksBuffer = [];
  let todoTasksClean = [];
  let counterNotDone = [];
  let counterDone = [];
  let currentPage = 1;
  let todoTasksCompleted = [];
  let todoTasksNotCompleted = [];

  const PAGE_SIZE = 5;
  const ENTER_KEY = 13;
  const CASE_DONE = 1;
  const CASE_NOT_DONE = 2;
  const CASE_ALL = 3;
  const $todoInput = $('.todo-input');
  const $todoList = $('.todo-list');
  const $checkAll = $(`.check-all`);
  const $doneCount = $(`#done-count`);
  const $onlyDone = $(`.only-done`);
  const $onlyActive = $(`.only-active`);
  const $showAll = $(`.show-all`);
  const active = 'active';

  let skip = 0;

  let totalPage = 0;

  let currentTab = CASE_ALL;


  $doneCount.html(`Done: ${counterDone}. Not done: ${
    counterNotDone}. Total: ${todoTasks.length}`);


  const linkPage = function() {
    let pageNumber = 1;
    let pages = '';


    do {
      pages += `<button class=" pages btn btn-outline-primary" 
      id="${pageNumber}" >${pageNumber}</button>`;
      $('.navigation-button').html(pages);
      pageNumber++;
    }
    while (pageNumber <= totalPage);
  };

  const render = () => {
    let stringLine = '';


    todoTasks.forEach(task => {
      stringLine += `<li class="todo-item" id="${task.id}">
<input type="checkbox" class="check-todo" ${task.checked ? 'checked' : ''}/>

                <span class="todo-text">${task.text}</span>
        <button class="button delete-todo">X</button>
      </li>`;
    });
    $todoList.html(stringLine);
  };

  const pagination = function() {
    const { length: totalCount } = todoTasks;

    totalPage = Math.ceil(totalCount / PAGE_SIZE);
    const division = todoTasks.slice(skip, skip + PAGE_SIZE);

    todoTasks = division;
    linkPage();
    render();
    todoTasks = todoTasksBuffer;
    $(`#${currentPage}`).addClass(active);
  };

  const showFirstPage = function() {
    currentPage = 1;
    skip = 0;
    pagination();
  };


  const showPreviousPage = function() {
    if (currentPage > 1) currentPage--;
    skip = PAGE_SIZE * (currentPage - 1);
    pagination();
  };

  const currentState = function() {
    currentPage = [currentPage];
    pagination();
  };

  const showLastPage = function() {
    currentPage = totalPage;
    skip = PAGE_SIZE * (currentPage - 1);
    pagination();
  };

  const pageClick = function(pageNumber) {
    switch (currentTab) {
      case CASE_DONE:
        todoTasks = todoTasksCompleted;
        break;
      case CASE_NOT_DONE:
        todoTasks = todoTasksNotCompleted;
        break;
      case CASE_ALL:
      default:
        todoTasks = todoTasksBuffer;
        break;
    }
    currentPage = pageNumber;
    skip = PAGE_SIZE * (currentPage - 1);
    pagination();
    $(`#${pageNumber}`).addClass(active);
  };


  const addTodo = function(text) {
    const task = {
      checked: false,
      id: Date.now(),
      text,
    };


    todoTasks.push(task);
    pagination();
  };

  const proofChecked = function() {
    let checkedValue = 0;


    todoTasks.forEach(item => {
      if (item.checked === true) {
        checkedValue++;
      }
      if (todoTasks.length === checkedValue) {
        $checkAll.prop(`checked`, true);
      } else {
        $checkAll.prop(`checked`, false);
      }
      pagination();
    });
  };


  const shielding = function(input) {
    const newInput = input.replace(/\u0026/gu, '&amp;')
      .replace(/\u003C/gu, '&lt;')
      .replace(/\u003E/gu, '&gt;')
      .replace(/\u0022/gu, '&quot;')
      .replace(/\u0027/gu, '&#x27;')
      .replace(/\u002F/gu, '&#x2F;');


    return newInput;
  };


  const filtration = function() {
    todoTasksBuffer = todoTasks;
    todoTasksClean = todoTasks;
    todoTasksNotCompleted = todoTasksClean
      .filter(task => task.checked === false);
    const { length: lengthActive } = todoTasksNotCompleted;

    counterNotDone = lengthActive;

    todoTasksCompleted = todoTasksClean.filter(task => task.checked === true);
    const { length: lengthCompleted } = todoTasksCompleted;


    counterDone = lengthCompleted;
  };

  const countTasks = function() {
    $doneCount.html(`Done: ${counterDone}. Not done: ${
      counterNotDone}. Total: ${todoTasksBuffer.length}`);
  };

  const onlyDone = function() {
    filtration();
    todoTasks = todoTasksCompleted;
    showFirstPage();
    countTasks();
    todoTasks = todoTasksBuffer;
    $onlyDone.addClass(active);
    currentTab = CASE_DONE;
    $showAll.removeClass(active);
    $onlyActive.removeClass(active);
    filtration();
  };

  const notDone = function() {
    filtration();
    todoTasks = todoTasksNotCompleted;
    countTasks();
    showFirstPage();
    todoTasks = todoTasksBuffer;
    $onlyActive.addClass(active);
    currentTab = CASE_NOT_DONE;
    $showAll.removeClass(active);
    $onlyDone.removeClass(active);
    filtration();
  };

  const showAll = function() {
    todoTasks = todoTasksBuffer;
    countTasks();
    todoTasks = todoTasksBuffer;
    showFirstPage();
    $showAll.addClass(active);
    currentTab = CASE_ALL;
    $onlyDone.removeClass(active);
    $onlyActive.removeClass(active);
  };


  const switchMain = function() {
    switch (currentTab) {
      case CASE_DONE:
        onlyDone();
        break;
      case CASE_NOT_DONE:
        notDone();
        break;
      case CASE_ALL:
      default:
        showAll();
        break;
    }
  };

  const checkAdding = function() {
    let text = $todoInput.val()
      .trim();


    $todoInput.val('');

    currentState();
    if (text !== '') {
      text = shielding(text);
      addTodo(text);
      $todoInput.val();
      $todoInput.focus();

      currentTab = CASE_ALL;
    }
  };

  const onlyDoneCurrent = function() {
    filtration();
    todoTasks = todoTasksCompleted;
    currentState();
    todoTasks = todoTasksBuffer;
    $onlyDone.addClass(active);
    currentTab = CASE_DONE;
    $showAll.removeClass(active);
    $onlyActive.removeClass(active);
    filtration();
  };

  const notDoneCurrent = function() {
    filtration();
    todoTasks = todoTasksNotCompleted;
    currentState();
    todoTasks = todoTasksBuffer;
    $onlyActive.addClass(active);
    currentTab = CASE_NOT_DONE;
    $showAll.removeClass(active);
    $onlyDone.removeClass(active);
    filtration();
  };

  const showAllCurrent = function() {
    todoTasks = todoTasksBuffer;
    countTasks();
    todoTasks = todoTasksBuffer;
    currentState();
    $showAll.addClass(active);
    currentTab = CASE_ALL;
    $onlyDone.removeClass(active);
    $onlyActive.removeClass(active);
  };

  const switchForAdding = function() {
    const checkingLast = Math.ceil(todoTasksNotCompleted.length / PAGE_SIZE);
    const checkingLastTab = Math.ceil(todoTasksCompleted.length / PAGE_SIZE);

    if (checkingLast < currentPage || checkingLastTab < currentPage) {
      switch (currentTab) {
        case CASE_DONE:
          onlyDone();
          showLastPage();
          onlyDoneCurrent();
          break;
        case CASE_NOT_DONE:
          notDone();
          showLastPage();
          notDoneCurrent();
          break;
        case CASE_ALL:
          showAll();
          showLastPage();
          showAllCurrent();
          break;
        default:
          showAll();
      }
    } else {
      switch (currentTab) {
        case CASE_DONE:
          onlyDoneCurrent();
          break;
        case CASE_NOT_DONE:
          notDoneCurrent();
          break;
        case CASE_ALL:
          showAllCurrent();
          break;
        default:
          pageClick();
      }
    }
  };

  $(`.add-button`).on(`click`, () => {
    checkAdding();
    filtration();
    countTasks();
    switchMain();
    showLastPage();
    proofChecked();
  });

  $(document).on(`click`, `.pages`, function() {
    const id = $(this).attr(`id`);


    pageClick(id);
  });

  $todoInput.on(`keypress`, event => {
    if (event.which === ENTER_KEY) {
      checkAdding();
      filtration();
      proofChecked();
      switchMain();
      showLastPage();
    }
  });


  $(document).on(`change`, `.check-todo`, function() {
    const arrID = $(this).parent()
      .attr('id');

    const statusChange = todoTasks.find(item => item.id === Number(arrID));

    statusChange.checked = statusChange.checked === false;
    filtration();
    countTasks();
    pagination();
    proofChecked();
    switchForAdding();
  });

  $(document).on(`click`, `.delete-todo`, function() {
    const arrId = $(this).parent()
      .attr('id');

    todoTasks.forEach((item, index) => {
      if (item.id === Number(arrId)) {
        todoTasks.splice(index, 1);
      }
    });
    filtration();
    proofChecked();
    countTasks();
    pagination();
    if (currentPage > totalPage) {
      showPreviousPage();
    } else {
      currentState();
    }
    switchForAdding();
  });


  $checkAll.on(`change`, function() {
    const checkAll = $(this).prop(`checked`);

    todoTasks.forEach(item => {
      item.checked = checkAll;
    });
    filtration();
    countTasks();

    pagination();
    switchForAdding();
  });

  $(document).on(`dblclick`, `.todo-text`, function() {
    const taskId = $(this).parent()
      .attr('id');

    let inputValue;


    todoTasks.forEach(item => {
      if (item.id === Number(taskId)) {
        const { text } = item;

        inputValue = text;
      }
    });


    $(this).replaceWith(`<input class="edit-task" type='text'
value="${inputValue}">`);
    $(`.edit-task`).focus();
  });

  $(document).on(`blur`, `.edit-task`, () => {
    pagination();
  });

  $(document).on(`click`, `.delete-all`, () => {
    todoTasks = todoTasks.filter(task => task.checked === false);
    filtration();
    currentPage = 1;
    $checkAll.prop(`checked`, false);
    countTasks();
    pagination();
    switchMain();
    showLastPage();
    proofChecked();
  });

  $(document).on(`keypress`, `.edit-task`, function(enter) {
    if (enter.which === ENTER_KEY) {
      const arrId = $(this).parent()
        .attr('id');

      let editTodotext = $(`.edit-task`).val()
        .trim();


      todoTasks.forEach(item => {
        if (item.id === Number(arrId)) {
          if (editTodotext !== '') {
            editTodotext = shielding(editTodotext);
            item.text = editTodotext;
            todoTasksBuffer = todoTasks;

            render();
            pagination();
          }
          if (currentPage === todoTasks.length) {
            showLastPage();
          }
        }
      });
    }
  });


  $(document).on(`click`, `.only-done`, () => {
    onlyDone();
  });

  $(document).on(`click`, `.only-active`, () => {
    notDone();
  });


  $(document).on(`click`, `.show-all`, () => {
    showAll();
  });
});
