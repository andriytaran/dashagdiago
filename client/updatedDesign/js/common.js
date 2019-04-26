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
});