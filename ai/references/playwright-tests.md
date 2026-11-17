# Playwright Tests

- Put specs in `tests/e2e/`, one file per app area named after it (`checkout.spec.ts`), beside the suite's global setup and its test fixtures in `tests/e2e/fixtures.ts`; test code outside `src/` lives under `tests/`, one folder per suite.
- Give the suite an environment of its own: global setup starts the services the app needs and a dev server on a dedicated port, teardown removes them, and the `test:e2e` script runs the whole cycle. A run leaves the developer's dev data and dev server untouched.
- Locate elements by role or label (`getByRole`, `getByLabel`), and plain content by its visible text. When an element has no accessible name, add a `data-testid` to the production component and use `getByTestId`; that is the only production change a test may bring.
- Keep `test()` titles to a few words naming the main thing, not action→result sentences.
- Act and assert through the page, as a user would, and reload to prove a change was saved. Server calls, database rows, stored files and network stubs stay out of the test body.
- Arrange preconditions the UI can't create, or would make slow, with the project's data factories run against the suite's database.
- Each test stands alone: tests run serially on one worker, and a test never relies on data another test left behind.
- Commit file fixtures under `tests/e2e/files/`, apart from the test fixtures, reusing the project's existing sample or seed files where one fits.
- A failing test keeps its trace in `test-results/`; open it with `playwright show-trace <trace.zip>`.
