$(document).ready(function () {
    $('#create-action-button').click(function (e) {
        if ($('#create-action-form').valid()) {
            $('#action-modal').modal('show');
        }
    });
    
    $('#create-campaign-button').click(function (e) {
        if ($('#create-campaign-form').valid()) {
            $('#campaign-modal').modal('show');
        }
    });
    
    $('#create-offer-button').click(function (e) {
        if ($('#create-offer-form').valid()) {
            $('#offer-modal').modal('show');
        }
    });
    
    $('#action-submit').click(function (e) {
        e.preventDefault();
        let input = $('<input>')
            .attr("type", "hidden")
            .attr('name', 'create_action');
        $('#create-action-form').append(input);
        $('#create-action-form').submit();
    });
    
    $('#campaign-submit').click(function (e) {
        e.preventDefault();
        let input = $('<input>')
            .attr("type", "hidden")
            .attr('name', 'create_campaign');
        $('#create-campaign-form').append(input);
        $('#create-campaign-form').submit();
    });
    
    $('#offer-submit').click(function (e) {
        e.preventDefault();
        let input = $('<input>')
            .attr("type", "hidden")
            .attr('name', 'create_offer');
        $('#create-offer-form').append(input);
        $('#create-offer-form').submit();
    });

    $("#create-campaign").show();
    $("#create-action").hide();
    $("#create-offer").hide();
    $("#campaigns").show();
    $("#acciones").hide();
    $("#offers").hide();
    $("#select-campaigns").addClass('selected');
    $("#select-actions").removeClass('selected');
    $("#select-offers").removeClass('selected');

    $("#select-campaigns").click(function () {
        $("#create-campaign").show();
        $("#create-action").hide();
        $("#create-offer").hide();
        $("#campaigns").show();
        $("#actions").hide();
        $("#offers").hide();
        $("#select-campaigns").addClass('selected');
        $("#select-actions").removeClass('selected');
        $("#select-offers").removeClass('selected');
    });

    $("#select-actions").click(function () {
        $("#create-campaign").hide();
        $("#create-action").show();
        $("#create-offer").hide();
        $("#campaigns").hide();
        $("#actions").show();
        $("#offers").hide();
        $("#select-campaigns").removeClass('selected');
        $("#select-actions").addClass('selected');
        $("#select-offers").removeClass('selected');
    });

    $("#select-offers").click(function () {
        $("#create-action").hide();
        $("#create-campaign").hide();
        $("#create-offer").show();
        $("#campaigns").hide();
        $("#actions").hide();
        $("#offers").show();
        $("#select-campaigns").removeClass('selected');
        $("#select-actions").removeClass('selected');
        $("#select-offers").addClass('selected');
    });
});