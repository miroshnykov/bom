$(function() {
    var hash;

    // Remove the anchor which is left on redirects
    if ( history.pushState ) {
        history.replaceState( {}, document.title, location.href.split('#')[0] );
    }
    else {
        hash = location.hash.replace('#', '');
        if(hash != '') {
            location.hash = '';
        }
    }
});

$("#sign-form").validate({
  rules: {
    email: {
      required: true,
      email: true
    },
    password: {
      required: true,
      minlength: 8
    }
  },
  highlight: function(element) {
    $(element).closest(".form-group").addClass("has-error");
  },
  unhighlight: function(element) {
    $(element).closest(".form-group").removeClass("has-error");
  },
  errorElement: "span",
  errorClass: "help-block",
  errorPlacement: function(error, element) {
    if(element.parent(".input-group").length) {
      error.insertAfter(element.parent());
    } else {
      error.insertAfter(element);
    }
  }
});


$("#reset-form").validate({
  rules: {
    email: {
      required: true,
      email: true
    }
  },
  highlight: function(element) {
    $(element).closest(".form-group").addClass("has-error");
  },
  unhighlight: function(element) {
    $(element).closest(".form-group").removeClass("has-error");
  },
  errorElement: "span",
  errorClass: "help-block",
  errorPlacement: function(error, element) {
    if(element.parent(".input-group").length) {
      error.insertAfter(element.parent());
    } else {
      error.insertAfter(element);
    }
  }
});
