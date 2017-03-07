/**
 * @fileoverview This Chrome extension allows the user to hide loans that they
 * are not interested in buying in the secondary market. Loan ids to be ignored
 * are stored in Chrome's sync storage system. This means the data is backed up
 * to Google and would be available to other installations of Chrome the user
 * may have.
 *
 * At the end of this file, the extension waits for the secondary market page to
 * finish loading. It then renders the ignore buttons, adds listeners to them
 * and then hides the loans currently in the extension's Chrome sync storage.
 *
 * @author steve@stevenwooding.com (Steven Wooding)
 * @license MIT
 */

// Define the maxium number of loans to store in each Chrome sync storage item
// and the maximum number of storage items. Times these two numbers together to
// get the total number of loans that can be stored.
var loansPerItem = 1000;
var totalNumItems = 100;


/**
 * Extracts the loan id from the loan details jQuery object extracted from the
 * web page.
 * @param {jQuery} loanDetails
 */
function extractLoanId($loanDetails) {
  return $loanDetails.find('p.company-info').text().replace(/\r?\n|\r/g, '');
}


/**
 * Function to hide loans based on the list stored in Chrome sync storage.
 */
function hideLoans() {
  var itemNames = [];
  for (i = 0; i < totalNumItems; i++) {
    itemNames.push('ignoredLoans' + i);
  }

  chrome.storage.sync.get(itemNames, function(result) {
    var loansToIgnore = [];
    if ($.isEmptyObject(result)) {
      return;
    } else {
      for (var loanItem in result) {
        if (result.hasOwnProperty(loanItem)) {
          loansToIgnore = loansToIgnore.concat(result[loanItem]);
        }
      }
    }

    $('.loan-details').each(function(i, loanDetails) {
      var $loanDetails = $(loanDetails),
        loanId = extractLoanId($loanDetails);
      if ($.inArray(parseInt(loanId), loansToIgnore) > -1) {
        $loanDetails.parent().hide();
      }
    });
  });
}


/**
 * Place an ignore button on each loan.
 */
function renderIgnoreButtons() {
  $('.loan-parts .loan-details').each(function(i, loanDetails) {
    var $loanDetails = $(loanDetails),
      loanId = extractLoanId($loanDetails);
    $loanDetails.append('<button class="ignore-btn" id="' + loanId +
      '">Ignore</button>');
  });
}


/**
 * This function will interface with local storage to store the loan id to be
 * ignored.
 * @param {int} loanId The ID of the loan to be set to ignore.
 * @param {int} itemNum The number of the storage item where the loan id will
 *     be stored.
 */
function ignoreLoan(loanId, itemNum) {
  // First get the currently stored ignored loans from storage. Then in the
  // callback function, update the array and write it back to sync storage.
  chrome.storage.sync.get('ignoredLoans' + itemNum, function(result) {
    var updatedIgnoredLoans = [];

    if ($.isEmptyObject(result)) {
      updatedIgnoredLoans = [parseInt(loanId)];
    } else if (result['ignoredLoans' + itemNum].length >= loansPerItem) {
      itemNum++;
      if (itemNum > (totalNumItems - 1)) {
        alert('Loan failed to be ignored. Maximum ignored number of loans ' +
          'reached!');
        return;
      }
      chrome.storage.sync.set({ 'currentItemNum': itemNum });
      updatedIgnoredLoans = [parseInt(loanId)];
    } else {
      updatedIgnoredLoans = result['ignoredLoans' + itemNum];
      updatedIgnoredLoans.push(parseInt(loanId));
    }

    var itemName = 'ignoredLoans' + itemNum;
    chrome.storage.sync.set({ [itemName]: updatedIgnoredLoans },
      function() {
        // Run the hide loans function again, so this latest loan is hidden too.
        hideLoans();
    });
  });
}


/**
 * Before calling the main ignore function, extract the loan id from the click
 * event and find out the current ignore loan item in Chrome sync storage.
 * @param {event} event The click event object.
 */
function ignoreLoanInit(event) {
  var loanId = event.data.loanId;

  // Get the current storage item number. If it doesn't exist, set it to zero.
  chrome.storage.sync.get('currentItemNum', function(result) {
    if ($.isEmptyObject(result)) {
      ignoreLoan(loanId, 0);
      chrome.storage.sync.set({ 'currentItemNum': 0 });
    } else {
      ignoreLoan(loanId, result.currentItemNum);
    }
  });
}


/**
 * For each ignore button, add a click event listener to handle when a user
 * clicks on a ignore button.
 */
function addClickBtnListeners() {
  $('.ignore-btn').each(function(i, btnDetails) {
    var $btnDetails = $(btnDetails);
    var loanId = $btnDetails.attr('id');
    $btnDetails.click({ loanId: loanId }, ignoreLoanInit);
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
