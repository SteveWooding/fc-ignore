# Funding Circle Loan Ignore Chrome Extension

## Purpose
This Chrome extension is for the [Funding Circle](https://www.fundingcircle.com)
website and the secondary market for loans on the site.

Sometimes when you are browsing the secondary loan market, you judge that a loan
is not right for you and would like it not to be shown again. This is the
problem that this extension for Chrome solves.

## How it works
Each loan gets an ignore button placed next to it. When a user clicks this
button, the loan ID is stored in the user's Chrome Sync Storage and the loan is
removed from the list of loans.

The list of loans to ignore is synced by Google and is available to other
computers running Chrome that the user logs in to. It is recommended that the
user encrypts there Chrome Sync Storage, as a matter of course. However, a list
of loan IDs to ignore should probably regarded as a low security risk. This is
the only data that this extension stores.

## Installation
Clone or download this repository to a location on your computer. In Chrome,
click the three dot menu button, then `More tools -> Extensions`. Click the
`Developer mode` check box. Then click the `Load unpacked extension...` button.
The browse to the location that you downloaded the extension to and open it. The
extension has now been installed. Log in to your Funding Circle account and
navigate to the secondary market. You should see the ignore buttons next to each
loan. If so, you have successfully installed the extension.

At a later date, this Chrome Extension will be submitted to the Chrome App Store
and will be installable in the normal way.

## Files
The `manifest.json` file is the key file for a Chrome extension. It restricts
what URLs the extension can run on and the permissions it can use. Please review
this file to ensure you are happy with the permissions and the code used in this
extension. The jQuery library is used extensively by this extension.

All of the JavaScript functions for the extension are in the `content.js` file.
Please see the documentation there for more detail on how the extension works.

Note that the default settings at the top of the `content.js` file allow for the
ignoring of 100,000 loans. This should be more than adequate as it is far above
the current total number of loans on the Funding Circle platform. However, you
may customise these settings if you wish.

## Contributions
I will welcome any proposed contributions via the normal mechanism of pull
requests which improves this Chrome extension. Be careful though of adding new
features that are too far from the stated purpose above. Google has a rule that
each Chrome extension should have only one main purpose.

## Issues
If you find any issues with this Chrome Extension, please file a new issue here
on GitHub and I will look into it.

## Disclaimer
This extension is not supported nor endorsed by Funding Circle. This extension
adds a 3rd party feature to the Funding Circle website and may stop working at
any time due to changes to the Funding Circle website.

## License
This code is covered under the MIT license, a copy of which can be found in the
file `LICENSE.md`.
