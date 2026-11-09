# Playwright tests for Sauce Demo login page

Automated Playwright tests (TypeScript) for the login page of [Sauce Demo](https://www.saucedemo.com/), a demo online shop built for test practice.

## Scenarios tested

I designed 25 scenarios (happy path, negative cases and edge cases) and automated 6 of them in the first iteration. All expected results were verified manually on https://www.saucedemo.com/ before automation.

### Happy path

| ID | Scenario | Expected result | Automated |
|---|---|---|---|
| HP-01 | Log in as `standard_user` with `secret_sauce` by clicking Login | Redirected to `/inventory.html`, Products page loads | ✅ |
| HP-02 | Submit the login form with the Enter key | Nothing happens, the user must click Login | |
| HP-03 | Log in as `problem_user`, `performance_glitch_user`, `error_user`, `visual_user` | Each is redirected to `/inventory.html` | |
| HP-04 | Open the login page | Title contains "Swag Labs", both fields are empty, accepted usernames and password are visible | ✅ |

### Negative cases

| ID | Scenario | Expected result | Automated |
|---|---|---|---|
| NEG-01 | Empty username, empty password | "Epic sadface: Username is required", stays on login page | ✅ |
| NEG-02 | Empty username, valid password | "Epic sadface: Username is required" (same rule as NEG-01) | |
| NEG-03 | Valid username, empty password | "Epic sadface: Password is required" | |
| NEG-04 | Valid username, wrong password | "Epic sadface: Username and password do not match any user in this service", stays on login page | ✅ |
| NEG-05 | Unknown username, valid password | Same "do not match" message | |
| NEG-06 | Unknown username, wrong password | Same "do not match" message | |
| NEG-07 | Close the error message with its close button | The error disappears, stays on login page | |
| NEG-08 | `locked_out_user` with the correct password | "Epic sadface: Sorry, this user has been locked out.", stays on login page | ✅ |
| NEG-09 | Open `/inventory.html` directly without logging in | "Epic sadface: You can only access '/inventory.html' when you are logged in.", redirected to login page | ✅ |

### Edge cases

| ID | Scenario | Result |
|---|---|---|
| EDGE-01 | Username in capital letters | "Do not match" message, stays on login page |
| EDGE-02 | Password in the wrong case | "Do not match" message |
| EDGE-03 | Spaces around the username | "Do not match" message (spaces are not trimmed) |
| EDGE-04 | Password field input | Characters are masked |
| EDGE-05 | Very long username | "Do not match" error, no crash |
| EDGE-06 | Special characters and SQL-style string as username | No login, "do not match" error |
| EDGE-07 | Repeated failed logins | Same error each time, no lockout |
| EDGE-08 | Failed login, then page reload | Error is gone, fields are cleared |
| EDGE-09 | Log in, press Back, then Forward | See "Finding" below |
| EDGE-10 | Log in, log out, press Back | The Products page is not accessible without logging in again |

### Cases chosen for automation in the first iteration

| ID | Scenario | Why automated first |
|---|---|---|
| HP-01 | Log in as `standard_user` with `secret_sauce` by clicking Login | Main happy path |
| HP-04 | Open the login page | Easy check that the login page loads correctly |
| NEG-01 | Empty username, empty password | Confirms that validation works and the user can't log in without a username and password |
| NEG-04 | Valid username, wrong password | Confirms that the user can't log in with an incorrect password (security) |
| NEG-08 | `locked_out_user` with the correct password | Confirms that blocked users can't log in (security) |
| NEG-09 | Open `/inventory.html` directly without logging in | Confirms that a page requiring authentication can't be opened directly (security) |

## How I used Claude

1. I wrote a prompt describing the page I wanted to test (the login page) and its expected behavior. I asked Claude to draft test scenarios including happy path, negative and edge cases.
2. I checked every scenario manually on the real page and corrected Claude's wrong guesses:
   - **HP-02:** Claude expected the Enter key to submit the form. It doesn't, and the user must click Login. In a real project I would raise this as a potential bug or improvement.
   - **NEG-01 and NEG-02:** Claude listed them as separate cases, but they show the same error message, so I automated only one of them.
   - I also supplied the exact error messages for empty fields and the locked-out user.
3. I added **HP-04** (initial state of the login page), which Claude's list had missed.
4. After finalizing the list, I wrote the Playwright tests for 6 chosen cases myself.
5. I used Claude to review my code. The review found:
   - suggestion to set `baseURL` in `playwright.config.ts`
   - a leftover `goto` line in a test, after I had already set `baseURL` in `playwright.config.ts`
   - a weak check of the credentials box, which only tested that it was visible and not its text
   - a missing error-message check in NEG-09

   I fixed all of these.

## Finding: EDGE-09 (Back and Forward navigation)

**Steps:**
1. Log in as `standard_user`.
2. Press the browser Back button.
3. Press the browser Forward button.

**Expected:** A logged-in user who navigates back to the login page is redirected to the inventory page. (This is my expectation and it might not be intentional design.)

**Actual:** Back shows the login page. Forward returns to `/inventory.html` without a new login.

**Note:** This is possibly intentional on a demo site. In a real project I would raise it for discussion.

## How to run

Prerequisite: [Node.js](https://nodejs.org/)

1. Install dependencies and browsers:
   ```
   npm install
   npx playwright install
   ```
2. Run the tests in headless mode:
   ```
   npx playwright test
   ```
3. Run the tests in a visible browser:
   ```
   npx playwright test --headed
   ```
4. Open the HTML report:
   ```
   npx playwright show-report
   ```