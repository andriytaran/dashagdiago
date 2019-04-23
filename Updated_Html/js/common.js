$(document).ready( () => {
    
    let 
        $sidebar = $('#sidebar'),
        $mainSection = $('#mainSection');

    $sidebar.on('click', '#sidebarToggler', () => {
        $sidebar.toggleClass('active');
    });

    $mainSection.on('click', () => {
        if($sidebar.hasClass('active')) {
            $sidebar.removeClass('active');
        }
    });
});