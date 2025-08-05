# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-08-05

### Added
- Initial release of Form Filler Extension extension
- Automatic form filling with random data
- Support for text, email, number, checkbox, radio, and select fields
- Custom pattern configuration system
- Random data generators for names, emails, phones, addresses, companies, and text
- Real-time toggle for enable/disable functionality
- Chrome extension popup interface
- Default patterns for common form fields
- React framework compatibility
- Chrome storage for settings persistence

### Features
- **Auto-fill Detection**: Automatically detects and fills forms when they appear
- **Smart Field Types**: Handles different input types appropriately
- **Random Placeholders**: Built-in random data generation
- **Custom Selectors**: CSS selector support for targeting specific fields
- **Pattern Management**: Add, edit, and remove custom filling patterns
- **Developer Mode**: Works with modern frameworks and dynamic content

### Technical
- Manifest V3 compliance
- Content script injection
- Chrome storage API integration
- Service worker background script
- Popup UI with pattern management

## [Unreleased]

### Planned
- Firefox support (Manifest V2 conversion)
- Additional random data types (dates, credit cards, etc.)
- Import/export functionality for patterns
- Enhanced form field detection
- URL-based conditional filling
- Pattern testing and validation tools