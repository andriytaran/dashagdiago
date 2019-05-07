$(document).ready( () => {
    
    let 
        $sidebar = $('#sidebar'),
        $mainSection = $('#mainSection');

    $sidebar.on('click', '#sidebarToggler', () => {
        $sidebar.toggleClass('active');
    });

    $mainSection.on('click', () => {
        if($sidebar.hasClass('active')) {
            $('.sidebar__dropdown .show').removeClass('show');
            $sidebar.removeClass('active');
        }
    });

    $('select').selectric();

    
    $('.number .number_controls > div').on('click', function() {
        var input = $(this).closest('.number').find('input'); // инпут
        var value = parseInt(input.val()) || 0; // получаем value инпута или 0
        if ($(this).hasClass('nc-minus')) {
          value = value - 1; // вычитаем из value 1
        }
        if ($(this).hasClass('nc-plus')) {
          value = value + 1; // прибавляем к value 1
        }
        input.val(value).change(); // выводим полученное value в инпут; триггер .change() - на случай, если на изменение этого инпута у вас уже объявлен еще какой-то обработчик
      });

    const inputArrow = () => {
        const $inputNumberWrap = $('.form__group-input-num-wrap');
        
        $inputNumberWrap.on('click', 'span', function() {

            let 
                $inputNumber = $(this).siblings('input'),
                value = $inputNumber.val();


            if ( $(this).hasClass( 'plus' ) ){

                if( value <= 999 ) value++;

            }
            if( $(this).hasClass( 'minus' ) ){ 

                if( value > 0 ) value--;
                
            }

            $inputNumber.val(value).change();

        });

    }
    $('#schoolData').change( () => {

        let $file = $('#schoolData').val();

        var ext =  $file.split('.').pop().toLowerCase();

        if($.inArray(ext, ['csv']) == -1) {
            $('#schoolData').val('');
            $('#file-name').addClass('error').text('Sorry, You can Upload Only CSV file!');

        } else {
            $('.clear-field').addClass('active');
            $file = $file.replace(/\\/g, '/').split('/').pop();
            $('#file-name').removeClass('error').text($file);

        }

    });
    $('#playerPhoto').change( () => {

        let $file = $('#playerPhoto').val();

        var ext =  $file.split('.').pop().toLowerCase(),
            checkIcon = '<img src="img/check-icon.svg" alt="">',
            outPut = $('.form__group-upload-results');

        if($.inArray(ext, ['jpg','jpeg','gif','png']) == -1) {
            $('#playerPhoto').val('');
            outPut.addClass('error').text('Sorry, only files of type jpg, png, jpeg is allowed!');

        } else {
            $('.clear-field').addClass('active');
            $file = $file.replace(/\\/g, '/').split('/').pop();
            outPut.removeClass('error').addClass('active').text($file + ' downloaded').append(checkIcon);
        }

    });
    $('.form__group-input-file-wrap--add-photo').on('click', '.clear-field', function(){
        $('.form__group-upload-results').text('');
        $('#playerPhoto').val('');
        $(this).removeClass('active');
    })
    $('.clear-field').on('click', function(){
        $('#file-name').text('FTP folder name');
        $('#schoolData').val('');
        $(this).removeClass('active');
    })



    inputArrow();

});