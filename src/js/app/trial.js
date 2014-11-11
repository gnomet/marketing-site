define(
  [ "chosen"
  , "text!../../templates/trial.html"
  , "text!../../templates/localization.html"
  , "text!../../templates/name.html"
  , "text!../../templates/password.html"
  , "text!../../templates/marketplace.html"
  ],
  function (Chosen, trialHtml, localizationHtml, nameHtml, passwordHtml, marketplaceHtml) {

    var trial = {

      initializeTrialForm: function($trial) {
        $trial.append(trialHtml);
        $base = $trial.find('.swiper-container');

        trial.trialSwiper = $base.swiper(
          {
            mode:'horizontal'
          , loop: false
          //, cssWidthAndHeight: true
          , simulateTouch: false
          , onSlideChangeEnd: trial.onSlideChangeEnd.bind(trial)
          }
        );

        trial.addListeners($base);

      }
      , initializeSelection: function($element, width, no_results_text) {
        $element.chosen({
          'width': width
          , 'inherit_select_classes': true
          //, 'disable_search_threshold': 4
          , 'no_results_text': no_results_text
        });
      }

      // Focus on the first input element
      , onSlideChangeEnd: function() {
        $(this.trialSwiper.activeSlide()).find('input:first').focus();
      }

      , addListeners: function($element) {
        //key events
        $element.on( 'keyup', function(e) {
          var keyCode = e.keyCode || e.which;
          // enter
          if( keyCode === 13 ) {

            e.preventDefault();
            var $question = ($(e.target).hasClass('question')) ? $(e.target) : $(e.target).parents('.question');
            var $field = $question.parent('.trial-field');
            var isLastQuestion = $question.get(0) == $field.find('.next-button').prev().get(0);

            // Slide to next question
            // If enter key is pressed once on input element -> slide to next fieldset ( $question.prop("tagName") === 'INPUT') )
            if( isLastQuestion && ($question.hasClass('question-checked') || $question.prop("tagName") === 'INPUT')) {
              var active = $element.find('.chosen-container-active');
              this.nextSlide($field);

            } else if(!isLastQuestion && ($question.hasClass('question-checked') || $question.prop("tagName") === 'INPUT')) {
              // activate next field

              var lastQuestion = $field.find('.next-button').prev();
              if(lastQuestion.hasClass('chosen-container')) {
                lastQuestion.prev().trigger('chosen:open');
              } else {
                lastQuestion.get(0).focus();
              }
            } else {
              $question.addClass('question-checked');
            }

          }
        }.bind(trial));

        // next-button clicks
        $element.find('.next-button').on('click', this.onNextClick.bind(trial));
      }
      , onNextClick: function(e) {
        var $nextButton = $(e.currentTarget);
        var $field = $nextButton.parents('.trial-field');
        e.preventDefault();
        this.nextSlide($field)
      }

      , nextSlide: function($field) {
        if($field.hasClass('email-field')) {
          this.emailQuestion($field);
        } else if($field.hasClass('name-field')) {
          this.nameQuestions($field);
        } else if($field.hasClass('localization-field')) {
          this.localizationQuestions($field);
        } else if($field.hasClass('marketplace-field')) {
          this.marketplaceQuestions($field);
        } else if($field.hasClass('password-field')) {
          this.passwordQuestions($field);
        } else {
          alert('Not implemented');
        }
      }

      , emailQuestion: function($field) {
        if(this.validateEmail($field)) {

          var request = $.ajax(
            {
              type: "GET"
            , url: 'http://catch.sharetri.be/int_api/check_email_availability'
            , data: {email: $field.find('input').val()}
            , dataType: 'json'
          });

          request.done(function( response ) {
            //var response = {email: 'blaa@blaa.fi', available: true}
            //alert("We got response" + JSON.stringify(response.available));
            var emailAvailable = response.available;

            if(emailAvailable) {
              trial["validated_email"] = $field.find('input').val();
              var $container = $field.parents('.swiper-container');
              // country & language
              this.trialSwiper.createSlide(localizationHtml).append();
              // webkit fix / override
              var width = 'none';

              this.initializeSelection($container.find('.country.chosen-select'), width, "No results match" );
              this.initializeSelection($container.find('.language.chosen-select'), width, "Didn't find your language? Easily translate your marketplace yourself!")
              $container.find('.localization-field .next-button').on('click', this.onNextClick.bind(this));
              // first & last name
              this.trialSwiper.createSlide(nameHtml).append();
              $container.find('.name-field .next-button').on('click', this.onNextClick.bind(this));
              // password & confirm
              this.trialSwiper.createSlide(passwordHtml).append();
              $container.find('.password-field .next-button').on('click', this.onNextClick.bind(this));
              //marketplace type & name
              this.trialSwiper.createSlide(marketplaceHtml).append();
              this.initializeSelection($container.find('.marketplace-type.chosen-select'), width, "No results match" );
              $container.find('.marketplace-field .next-button').on('click', this.onNextClick.bind(this));

              this.trialSwiper.swipeNext();
              $field.parents('.trial').find('.trial-info').removeClass('warning').text("Didn't find your language? Easily translate your marketplace yourself! Contact us to learn more.");

            } else {
              var newSlide = this.trialSwiper.createSlide('<p class="trial-text">It seems you already have a Sharetribe account.</p><p class="trial-text">If you want to create a new marketplace with this account, <a class="trial-link" href="contact.html" alt="contact us">contact us</a>.</p>');
              newSlide.append();
              this.trialSwiper.swipeNext();
            }
          }.bind(this));

          request.fail(function( jqXHR, textStatus ) {
            alert( "Check for email availability failed: " + textStatus + "Please contact us.");
          }.bind(this));
        } else {
          $field.parents('.trial').find('.trial-info').addClass('warning').text( "Sorry, we need a valid email address.")
        }

      }

      , localizationQuestions: function($field) {
        if(this.validateLocalization($field)) {
          this.trialSwiper.swipeNext();
        }
      }

      , nameQuestions: function($field) {
        if(this.validateName($field)) {
          this.trialSwiper.swipeNext();
          //TODO what requirements we have for password?
          $field.parents('.trial').find('.trial-info').removeClass('warning').text("Your password needs to be at least 8 characters long.");
        }
      }

      , passwordQuestions: function($field) {
        if(this.validatePassword($field)) {
          this.trialSwiper.swipeNext();
          // TODO links to terms of service and privacy policy
          $field.parents('.trial').find('.trial-info').removeClass('warning').html("Didn't find a suitable type for your marketplace idea? Contact us.<br />By creating your marketplace, you agree to Sharetribe's Terms of Service and Privacy policy.");
        } else {
          $field.parents('.trial').find('.trial-info').addClass('warning').text("Sorry, your password didn't match or it was too short. Password needs to be at least 8 characters long.");
        }
      }

      , marketplaceQuestions: function($field) {
        if(this.validateMarketplace($field)){
          var $container = $field.parents('.swiper-container');
          if(this.validatePassword($container.find('.password-field')) &&
            this.validateName($container.find('.name-field')) &&
            this.validateLocalization($container.find('.localization-field')) &&
            this.validateEmail($container.find('.email-field'))) {

            var data_hash = {
              'admin_email': trial["validated_email"]
              , 'marketplace_country': $container.find('.country').val()
              , 'marketplace_language': $container.find('.language').val()
              , 'admin_first_name': $container.find('.firstname').val()
              , 'admin_last_name': $container.find('.lastname').val()
              , 'admin_password': $container.find('.password').val()
              , 'marketplace_type': $container.find('.marketplace-type').val()
              , 'marketplace_name': $container.find('.marketplace-name').val()
            };

            //alert('AJAX call with data: ' + JSON.stringify(data_hash));

            var request = $.ajax(
              {
                type: "POST"
              , url: 'http://catch.sharetri.be/int_api/create_trial_marketplace'
              , data: data_hash
              , dataType: 'json'
            });

            request.done(function( response ) {
              //alert("New marketplace created: " + response.marketplace_url + "\n Redirecting there next.");
              window.location.href = response.marketplace_url
            }.bind(this));

            request.fail(function( jqXHR, textStatus ) {
              //TODO better error message somehow
              alert( "Request failed: " + textStatus );
            }.bind(this));
          }
        }
      }


      , validateEmail: function($field) {
        var emailFilter = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailFilter.test($field.find('input').val());
      }
      , validateLocalization: function($field) {
        return $field.find('.country').val() !== 'default' && $field.find('.language').val() !== 'default';
      }
      , validateName: function($field) {
        return $field.find('.firstname').val().length > 2 && $field.find('.lastname').val().length > 1;
      }
      , validatePassword: function($field) {
        return $field.find('.password').val().length >= 8 && $field.find('.password').val() === $field.find('.confirm').val();
      }
      , validateMarketplace: function($field) {
        return $field.find('.marketplace-type').val() !== 'default' && $field.find('.marketplace-name').val().length > 1;
      }
    };

    return {initializeTrialForm: trial.initializeTrialForm};
  }
);
