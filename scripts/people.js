var serverPath = "https://dev.mypbs.org";
var urlDirectory = serverPath + "/z/components/Actions/e_Directory.ashx";
var uType = "user";
var searchText = '';
var state = "";
var organization = "";
var PD = "";
var currentPageNumber = 1;

function fnGetDirectoryList(page) {
    var switchdiv = document.getElementById("togglediv").getAttribute("class");
    $.ajax({
        type: "POST",
        url: urlDirectory,
        data: { type: uType, page: page, searchText: searchText, state: state, organization: organization, PD: PD },
        success: function (data) {
            if (uType == "group") {
                if (switchdiv == "pbs-switch") {
                    $('#directoryGridResults').html(data);
                }
                else {
                    $('#directoryListResults').html(data);
                }
            }
            else {                
                if (switchdiv == "pbs-switch") {
                    $('#directoryGridResults').html(fnFormatGridDirectory(data, page));
                }
                else {
                    $('#directoryListResults').html(fnFormatListDirectory(data, page));
                }
            }
        },
        error: function (msg) {
            $('#directoryGridResults').html('An error has occured.Please try again.');
            $('#directoryListResults').html('An error has occured.Please try again.');
        }
    });
}

function fnFormatGridDirectory(response, currentPage) {
    currentPageNumber = currentPage;
    var div = '<div class="row pbs-people-tiles js-pbs-people-tiles">';
    //div += '<div class="yellowPagesPageNum">Page -' + currentPage + '</div><div class="directoryResults">';
    var responseCount = response.length;
    if (responseCount > 0) {
        if (typeof response[responseCount - 1].Pager !== "undefined") {
            responseCount = responseCount - 1;
        }
    }
    for (var i = 0; i < responseCount; i++) {
        div += '<div class="col-md-4 custom-col-md-4"> <div class="pbs-people-tile pbs-people-tile--border" data-toggle="modal" data-target="#department"> <img class="pbs-people-tile__image" src="' + serverPath
           + response[i].Avatar + '"> <h3 class="pbs-people-tile__primary-text">' + response[i].DisplayName + '</h3>';
        if (response[i].Location != '') {
            div += '<h4 class="pbs-people-tile__sub-text">' + response[i].Location + '</h4>';
        }
        else {
            div += '<h4 class="pbs-people-tile__sub-text" style="height: 17px;"> </h4>';
        }
        div += '<div class="pbs-people-tile__info">' + response[i].Title + '</div>';
        div += ' <div class="pbs-people-tile__info pbs-people-tile__info--border"> <i class="fa fa-envelope"></i> <a href="mailto:' + response[i].Email + '" class="pbs-people-tile__link">' + response[i].Email + '</a> </div>';
        div += '<div class="pbs-people-tile__info pbs-people-tile__info--border"> <i class="fa fa-phone"></i>'
            + response[i].Phone + '</div>';
        div += '<div class="pbs-people-tile__info pbs-people-tile__info--border"> <i class="fa fa-clock-o"></i>'
            + response[i].Timezone + '</div>';
        div += '</div> </div>';
    }
    div += '</div>';
    div += '<div id="paginationDiv"><div class="yellowPagesPageNum clear">Page -' + currentPage + '</div>';
    if (responseCount > 0) {
        if (typeof response[responseCount - 1].Pager !== '') {
            div += '<ul class="directoryPagination customDirectoryPagination\">' + response[i].Pager + '</ul>';
        }
    }
    div += '</div></div>';
    return div;
}

function fnFormatListDirectory(response, currentPage) {
    currentPageNumber = currentPage;
    var tbody = '';
    var responseCount = response.length;
    if (responseCount > 0) {
        if (typeof response[responseCount - 1].Pager !== "undefined") {
            responseCount = responseCount - 1;
        }
    }
    for (var i = 0; i < responseCount; i++) {
        tbody += '<tr> <td class=""> <span class="pbs-table__u-txt-highlight">' + response[i].DisplayName + '</span> </td>';
        tbody += '<td class="">' + response[i].Location + '</td>';
        tbody += '<td class="">' + response[i].Title + '</td>';
        tbody += '<td class=""> <a href="mailto:' + response[i].Email + '">' + response[i].Email + '</a> </td>';
        tbody += '<td class="">' + response[i].Phone + '</td>';
        tbody += '</td>';
    }

    var listdiv = '';
    listdiv += '<div><div class="yellowPagesPageNum clear">Page -' + currentPage + '</div>';
    if (responseCount > 0) {
        if (typeof response[responseCount - 1].Pager !== '') {
            listdiv += '<ul class="directoryPagination customDirectoryPagination\">' + response[i].Pager + '</ul>';
        }
    }

    listdiv += '</div>';
    $('#ListPagination').html(listdiv);
    document.getElementById("th-name").removeAttribute("class");
    return tbody;
}

function fnGetStateDisciplineList() {
    $.ajax({
        type: "POST",
        url: urlDirectory,
        data: { type: "statediscipline", page: 1, searchText: searchText, state: state, organization: organization, PD: PD },
        success: function (data) {
            var getResponseArray = JSON.parse(data);
            //Professional Discipline
            var disciplineSelect = document.getElementById("ddlPD");
            var disciplineOptions = getResponseArray[0];

            for (var i = 0; i < disciplineOptions.length; i++) {
                var opt = disciplineOptions[i];
                var el = document.createElement("option");
                el.textContent = opt;
                el.value = opt;
                disciplineSelect.appendChild(el);
            }
            //State
            var stateSelect = document.getElementById("ddlState");
            var stateOptions = getResponseArray[1];

            for (var i = 0; i < stateOptions.length; i++) {
                var opt = stateOptions[i];
                var el = document.createElement("option");
                el.textContent = opt[1];
                el.value = opt[0];
                stateSelect.appendChild(el);
            }
        },
        error: function (msg) {
            $('#directoryGridResults').html('An error has occured.Please try again.');
            $('#directoryListResults').html('An error has occured.Please try again.');
        }
    });
}

function fnPopulateOrganization() {
    var stateSelect = document.getElementById("ddlState");
    if (document.getElementById("ddlState").selectedIndex == 0) {
        var organizationSelect = document.getElementById("ddlOrganization");
        $('#ddlOrganization').html('');
        var el = document.createElement("option");
        el.textContent = "Select Organization";
        el.value = "Select Organization";
        organizationSelect.appendChild(el);
    }
    if (stateSelect.value != '') {
        $.ajax({
            type: "POST",
            url: serverPath + "/z/components/Actions/e_Register.ashx",
            data: { tID: parseInt(stateSelect.value), task: "get" },
            dataType: 'json',
            success: function (data) {
                var organizationSelect = document.getElementById("ddlOrganization");
                $('#ddlOrganization').html('');
                var el = document.createElement("option");
                el.textContent = "Select One";
                el.value = "Select One";

                organizationSelect.appendChild(el);
                var organizationOptions = data;
                for (var i = 0; i < organizationOptions.length; i++) {
                    var opt = organizationOptions[i];
                    var el = document.createElement("option");
                    el.textContent = opt.Title;
                    el.value = opt.ID;
                    organizationSelect.appendChild(el);
                }
            },
            error: function (msg) {
                alert('An error has occured.Please try again.');
            }
        });
    }
}

function fnDirectorySearch(page) {
    state = "";
    organization = "";
    PD = "";
    if (document.getElementById("ddlState").selectedIndex != 0) {
        state = document.getElementById("ddlState").options[document.getElementById("ddlState").selectedIndex].value;
    }
    if (document.getElementById("ddlOrganization").selectedIndex != 0) {
        organization = document.getElementById("ddlOrganization").options[document.getElementById("ddlOrganization").selectedIndex].value;
    }
    if (document.getElementById("ddlPD").selectedIndex != 0) {
        PD = document.getElementById("ddlPD").options[document.getElementById("ddlPD").selectedIndex].text;
    }
    searchText = $('#txtSearch').val();
    fnGetDirectoryList(1);
}

function checkKeycode(e) {
    var keycode;
    if (window.event) // IE
        keycode = e.keyCode;
    else if (e.which) // Netscape/Firefox/Opera
        keycode = e.which;
    if (keycode == 13)
        return fnDirectorySearch();
}

function getURLParam(name) {
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    return (results === null ? "" : results[1]);
}