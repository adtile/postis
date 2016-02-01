# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [2.2.0] - 2016-02-01
### Added
- Adds destroy method to Postis channel

## [2.1.1] - 2016-01-28
### Fixed
- Check that targetWindow has postMessage property on send

## [2.1.0] - 2016-01-20
### Added
- Support for windowForEventListening which can be used with sourceless iframes.

## [2.0.1] - 2016-01-20
### Fixed
- Add `try catch` block around JSON.parse to handle non JSON payloads.

## [2.0.0] - 2015-11-18
### Changed
- `params` are now passed as-is, not converted into function arguments.

## [1.1.0] - 2015-10-20
### Added
- Initial Open Source release.
