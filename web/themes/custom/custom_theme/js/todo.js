(function ($, Drupal, once) {
  'use strict';
  Drupal.behaviors.todoTask = {
    attach: function (context, settings) {
      // --- Save the html ---
      function saveListState() {
        let listHtml = $('.to-do-list').html();
        localStorage.setItem('drupal_todo_simple_list_html', listHtml);
      }

      // --- Initialization: Load state on page load ---
      once('todo-load-state', '.to-do-list', context).forEach(function (element) {
        var savedHtml = localStorage.getItem('drupal_todo_simple_list_html');
        if (savedHtml) {
          $(element).html(savedHtml);
        }
      });
      let $button = $('.add-button', context);
      let $taskInput = $('#new-task-id', context);
      // --- On write in input enabled button otherwise disabled.
      once('monitor-input', '#new-task-id', context).forEach(function () { 
        $button.prop('disabled', true);
        
        $taskInput.on('input change propertychange paste', function() {
          if($(this).val().trim().length > 0) {
            $button.prop('disabled', false);
          }
          else {
            $button.prop('disabled', true);
          }
        });
      });
      // --- Onclick button add task in li.
      once('todoTask', '.add-button', context).forEach(function (element) {
        $(element).on('click', function () {
          let taskText = $taskInput.val().trim();

          if(taskText !== '') {
            let $taskList = $('.to-do-list', context);
            let $newItem = $('<li>').addClass('todo-item');
            let $newTask = $('<span>').addClass('task-text').html(Drupal.checkPlain(taskText));
            let $checkBox = $('<span>').addClass('checkbox').attr('title', Drupal.t('Add Checkmark')).html('<i class="fa-regular fa-square"></i>');
            let $deleteButton = $('<span>').addClass('delete-task').attr('title', Drupal.t('Delete task'))
              .html('<i class="fa-solid fa-trash-can"></i>');
            $newItem.append($checkBox, $newTask, $deleteButton);
            $taskList.append($newItem);
            $taskInput.val('');
            $button.prop('disabled', true); 
          }
          saveListState();
        })
      });
      // --- Delete task onclick of delete icon.
      once('todoDeleteDelegation', '.to-do-list', context).forEach(function (element) {
        $(element).on('click', '.delete-task', function() {
          $(this).closest('.todo-item').remove();
          Drupal.announce(Drupal.t('Task Deleted'), 'polite');
          saveListState();
        })
      });
      // --- Add mark and chnage icon on click of checkbox icon.
      once('task-check', '.to-do-list', context).forEach(function(element) {
        $(element).on('click', '.checkbox', function() {
          let $li = $(this).closest('.todo-item');
          $li.toggleClass('is-complete');
          let $icon = $(this).find('i');
          if($li.hasClass('is-complete')) {
            $icon.removeClass('fa-square').addClass('fa-square-check');
            Drupal.announce(Drupal.t('Task Mark Completed'), 'polite');
          }
          else {
            $icon.removeClass('fa-square-check').addClass('fa-square');
            Drupal.announce(Drupal.t('Task Mark incompleted'), 'polite');
          }
          saveListState();
        })
      })
    }
  };
})(jQuery, Drupal, once);
