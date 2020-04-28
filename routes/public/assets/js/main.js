$(document).ready(function () {

    function sendNote(element) {
      let note = {};
      note.articleId = $(element).attr('data-id'),
      note.title = $('#noteTitleEntry').val().trim();
      note.body = $('#noteBodyEntry').val().trim();
      if (note.title && note.body){
        $.ajax({
          url: '/notes/createNote',
          type: 'POST',
          data: note,
          success: function (response){
            showNote(response, note.articleId);
            $('#noteBodyEntry, #noteTitleEntry').val('');
          },
          error: function (error) {
            showErrorModal(error);
          }
        });
      }
    }
  
  
    function showErrorModal(error) {
      $('#error').modal('show');
    }
  
  
    function showNote(element, articleId){
      let $title = $('<p>')
        .text(element.title)
        .addClass('noteTitle');
      let $deleteButton = $('<button>')
        .text('X')
        .addClass('deleteNote');
      let $note = $('<div>')
        .append($deleteButton, $title)
        .attr('data-note-id', element._id)
        .attr('data-article-id', articleId)
        .addClass('note')
        .appendTo('#noteArea');
    }
  
    $('#alertModal').on('hide.bs.modal', function (e) {
      window.location.href = '/';
    });
  
    $('#scrape').on('click', function (e){
      $('#loader').css({ 'display': 'block' });
      e.preventDefault();
      $.ajax({
        url: '/scrape/newArticles',
        type: 'GET',
        success: function (response) {
          $('#numArticles').text(response.count);
        },
        error: function (error) {
          showErrorModal(error);
        },
        complete: function (result){
          $('#loader').css({ 'display': 'none' });
          $('#alertModal').modal('show');
        }
      });
    });
  
    $(document).on('click', '#saveArticle', function (e) {
      let articleId = $(this).data('id');
      $.ajax({
        url: '/articles/save/'+articleId,
        type: 'GET',
        success: function (response) {
          window.location.href = '/';
        },
        error: function (error) {
          showErrorModal(error);
        }
      });
    });
  
    $('.addNote').on('click', function (e){
      $('#noteArea').empty();
      $('#noteTitleEntry, #noteBodyEntry').val('');
      let id = $(this).data('id');
      $('#submitNote, #noteBodyEntry').attr('data-id', id);
      $.ajax({
        url: '/notes/getNotes/'+id,
        type: 'GET',
        success: function (data){
          $.each(data.notes, function (i, item){
            showNote(item, id);
          });
          $('#noteModal').modal('show');
        },
        error: function (error) {
          showErrorModal(error);
        }
      });
    });
  
    $('#submitNote').on('click', function (e) {
      e.preventDefault();
      sendNote($(this));
    });
  
    $('#noteBodyEntry').on('keypress', function (e) {
      if(e.keyCode === 13){
        sendNote($(this));
      }
    });
  
    $('.deleteArticle').on('click', function (e){
      e.preventDefault();
      let id = $(this).data('id');
      $.ajax({
        url: '/articles/deleteArticle/'+id,
        type: 'DELETE',
        success: function (response) {
          window.location.href = '/articles/viewSaved';
        },
        error: function (error) {
          showErrorModal(error);
        }
      });
    });
  
    $(document).on('click', '.deleteNote', function (e){
      e.stopPropagation();
      let thisItem = $(this);
      let ids= {
        noteId: $(this).parent().data('note-id'),
        articleId: $(this).parent().data('article-id')
      };
  
      $.ajax({
        url: '/notes/deleteNote',
        type: 'POST',
        data: ids,
        success: function (response) {
          thisItem.parent().remove();
        },
        error: function (error) {
          showErrorModal(error);
        }
      });
    });
  
    $(document).on('click', '.note', function (e){
      e.stopPropagation();
      let id = $(this).data('note-id');
      $.ajax({
        url: '/notes/getSingleNote/'+id,
        type: 'GET',
        success: function (note) {
          $('#noteTitleEntry').val(note.title);
          $('#noteBodyEntry').val(note.body);
        },
        error: function (error) {
          console.log(error);
          showErrorModal(error);
        }
      });
    }); 
  
  });