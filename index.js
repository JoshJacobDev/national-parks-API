'use strict';

const apiKey = 'AYQgew9sLh3fkDIumpoQzagPgc5N6XDOevHMb4ic';
const endPointURL = 'https://developer.nps.gov/api/v1/parks'

function formatQuery(params) {
    const queryParams = Object.keys(params).map(key => `
    ${encodeURIComponent(key)}=${encodeURIComponent(params[key])}
    `)
    return queryParams.join('&');
}

function finalResults(responseJson) {
    let stringResponse = responseJson.data.length;
    if(stringResponse == 0) {
        $('#results').html(`
        <h2 class="resultDisplay"><u>${stringResponse} Related Results</u></h2>
        <p>Please try searching again!</p>
        `);
    } else if(stringResponse == 1) {
        $('#results').html(`
        <h2 class="resultDisplay"><u>${stringResponse} Related Result</u></h2>
        `);
    } else {
        $('#results').html(`
        <h2 class="resultDisplay"><u>${stringResponse} Related Results</u></h2>
        `);
    }
}

function displayResults(responseJson) {
    $('#park-results').removeClass('hidden');
    $('park-list').empty();
    finalResults(responseJson);

    for(let i = 0; i < responseJson.data.length; i++) {
        let parkName = responseJson.data[i].fullName;
        let parkURL = responseJson.data[i].url;
        let parkDescription = responseJson.data[i].description;
        let parkState = "Not Available";
        if(responseJson.data[i].addresses.length > 0) {
            parkState = responseJson.data[i].addresses[0].stateCode;
        }

        $('#park-list').append(`
        <section id="park-list">
            <h3>${i+1}. <a href="${parkURL}" target="_blank">${parkName}</a></h3>
            <p class="largeText">Location: ${parkState}</p>
            <p>${parkDescription}</p>
            <p class="largeText"><a href="${parkURL}" target="_blank"><u>Visit their website here</u></a>!<p>
        </section>
        `)
    };
};

function fetchParks(stateCode, limit) {
    const params = {
        stateCode: stateCode,
        limit: limit,
        api_key: apiKey
    };
    const querySearch = formatQuery(params);
    const url = endPointURL + "?" + querySearch;

    const options = {
        headers: new Headers({
            "X-Api-Key": apiKey
        })
    };
    
    fetch(url, options)
        .then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(error => {
            $('#js-error-message').text(`Error: ${error.message}`);
        });
};

function watchForm() {
    $('#js-form').submit(event => {
        event.preventDefault();
        const stateCode = $('#state-submission').val();
        const limit = $('#max-results').val();
        fetchParks(stateCode, limit);
    })
}

$(watchForm);