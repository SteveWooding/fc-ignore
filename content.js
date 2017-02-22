/**
 * Place an ignore button on each loan
 */
$('.loan-parts .loan-details').each(function(i, loanDetails) {
  var $loanDetails = $(loanDetails),
    loanId = $loanDetails.find('p.company-info').text().
      replace(/\r?\n|\r/g, '');
  $loanDetails.append('<button class="ignoreBtn" id="' + loanId +
    '">Ignore</button>');
});


/**
 * This function will interface with local storage to store the loan id to be
 * ignored.
 * @param {event} event The click event data that has the loan id stored in it.
 */
function ignoreLoan(event) {
  console.log('Inside ignoreLoan function. loanId = ' + event.data.loanId);
}


/**
 * Once the page has loaded, add a click event handler to each ignore button.
 */
$(document).ready(function() {
  $('.ignoreBtn').each(function(i, btnDetails) {
    var $btnDetails = $(btnDetails);
    var loanId = $btnDetails.attr('id');
    $btnDetails.click({ loanId: loanId }, ignoreLoan);
  });
});
