/**
 * Function to hide loans based on the list stored in Chrome sync storage.
 */
function hideLoans() {
  chrome.storage.sync.get('ignoredLoans', function(ignoredLoans) {
    var loansToIgnore = [];
    if ($.isEmptyObject(ignoredLoans)) {
      return;
    }
    else {
      loansToIgnore = ignoredLoans.ignoredLoans;
    }

    $('.loan-details').each(function(i, loanDetails) {
      var $loanDetails = $(loanDetails),
      loanId = $loanDetails.find('p.company-info').text().
          replace(/\r?\n|\r/g, '');
      if ($.inArray(loanId, loansToIgnore) > -1) {
        $loanDetails.parent().hide();
      }
    });
  });
}


/**
 * Place an ignore button on each loan
 */
function renderIgnoreButtons() {
  $('.loan-parts .loan-details').each(function(i, loanDetails) {
    var $loanDetails = $(loanDetails),
      loanId = $loanDetails.find('p.company-info').text().
        replace(/\r?\n|\r/g, '');
    $loanDetails.append('<button class="ignoreBtn" id="' + loanId +
      '">Ignore</button>');
  });
}


/**
 * This function will interface with local storage to store the loan id to be
 * ignored.
 * @param {event} event The click event data that has the loan id stored in it.
 */
function ignoreLoan(event) {
  var loanId = event.data.loanId;

  // First get the currently stored ignored loans from storage. Then in the
  // callback function, update the array and write it back to sync storage.
  chrome.storage.sync.get('ignoredLoans', function(ignoredLoans) {
    var updatedIgnoredLoans = [];
    if ($.isEmptyObject(ignoredLoans)) {
      updatedIgnoredLoans = [loanId];
    }
    else {
      updatedIgnoredLoans = ignoredLoans.ignoredLoans;
      updatedIgnoredLoans.push(loanId);
    }
    chrome.storage.sync.set({ 'ignoredLoans': updatedIgnoredLoans },
      function() {
        // Run the hide loans function again, so this latest loan is hidden too.
        hideLoans();
    });
  });
}


/**
 * For each ignore button, add a click event listener to handle when a user
 * clicks on a ignore button.
 */
function addClickBtnListeners() {
  $('.ignoreBtn').each(function(i, btnDetails) {
    var $btnDetails = $(btnDetails);
    var loanId = $btnDetails.attr('id');
    $btnDetails.click({ loanId: loanId }, ignoreLoan);
  });
}


/**
 * Once the page has loaded, render the ignore buttons, add a click event
 * handler to each one, then hide any loans that need hiding on the page.
 */
$(document).ready(function() {
  renderIgnoreButtons();
  addClickBtnListeners();
  hideLoans();
});
