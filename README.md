# Random Form Filler

A Chrome extension that automatically fills web forms with random data. Perfect for testing, development, and demo purposes.

![Extension Preview](./docs/extension.png)

## Features

- 🔄 **Auto-fill forms** with random data when they appear
- 🎯 **Custom patterns** - Define specific selectors and values
- 📝 **Smart field detection** - Supports text, email, number, checkbox, radio, and select fields
- 🎲 **Random data generation** - Names, emails, phones, addresses, companies, and text
- ⚡ **Real-time toggle** - Enable/disable auto-fill on the fly
- 🛠️ **Developer-friendly** - Works with React and other modern frameworks

## Installation

### Option 1: Download from Releases (Recommended)

1. Go to the [Releases page](../../releases)
2. Download the latest `random-form-filler-v*.zip` file
3. Extract the ZIP file to a folder
4. Open Chrome and go to `chrome://extensions/`
5. Enable "Developer mode" (toggle in top right)
6. Click "Load unpacked" and select the extracted folder
7. The extension icon should appear in your toolbar

### Option 2: Install from Source

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/random-form-filler.git
   cd random-form-filler
   ```

2. Open Chrome and go to `chrome://extensions/`

3. Enable "Developer mode" (toggle in top right)

4. Click "Load unpacked" and select the `extension` folder

5. The extension icon should appear in your toolbar

## Usage

### Basic Usage

1. **Toggle Auto-Fill**: Click the extension icon and use the "Auto-Fill ON/OFF" button
   
2. **Automatic Filling**: When enabled, forms will be automatically filled when they appear on the page

![Form Filling Example](./docs/form.png)

### Custom Patterns

You can create custom patterns to target specific form fields:

1. Click the extension icon
2. Click "Add Pattern" 
3. Configure your pattern:
   - **Selector**: CSS selector (e.g., `input[name='firstName']`)  
   - **Field Type**: Choose from text, number, email, checkbox, radio, select
   - **Fill Value**: Static value or use random placeholders

#### Available Random Placeholders

- `RANDOM_NAME` - Generates random first names
- `RANDOM_EMAIL` - Generates random email addresses  
- `RANDOM_PHONE` - Generates random phone numbers
- `RANDOM_ADDRESS` - Generates random street addresses
- `RANDOM_COMPANY` - Generates random company names
- `RANDOM_TEXT` - Generates random text snippets

#### Example Patterns

| Field Type | Selector Example | Value Example |
|------------|------------------|---------------|
| Text | `input[name='firstName']` | `RANDOM_NAME` |
| Email | `input[type='email']` | `RANDOM_EMAIL` |
| Number | `input[name='age']` | `25` |
| Checkbox | `input[name='subscribe']` | `true` |
| Select | `select[name='country']` | `United States` |

### Default Patterns

The extension comes with these pre-configured patterns:

- `input[name='firstName']` → Random name
- `input[name='lastName']` → Random name  
- `input[name='password']` → `Qwerty@123`
- `input[name='confirmPassword']` → `Qwerty@123`

## Supported Field Types

| Field Type | Description | Example Values |
|------------|-------------|----------------|
| **Text** | Text inputs and textareas | Names, addresses, text |
| **Email** | Email input fields | john123@gmail.com |
| **Number** | Numeric input fields | 25, 1000, 3.14 |
| **Checkbox** | Checkbox inputs | Checked if value is "true" or "1" |
| **Radio** | Radio button inputs | Selects matching value |
| **Select** | Dropdown selects | Matches option value or text |

## Development

### Project Structure

```
random-form-filler/
├── extension/           # Extension source code
│   ├── manifest.json   # Extension manifest
│   ├── content.js      # Content script (form filling logic)
│   ├── popup.js        # Popup script (UI logic)
│   ├── popup.html      # Popup HTML  
│   ├── popup.css       # Popup styles
│   ├── service_worker.js # Background script
│   └── icon.png        # Extension icon
├── docs/               # Documentation images
├── .github/workflows/  # GitHub Actions
└── README.md          # This file
```

### Making Changes

1. Edit files in the `extension/` folder
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test your changes

### Creating a Release

#### Method 1: GitHub Actions (Automated)

1. Go to the "Actions" tab in your GitHub repository
2. Click "Release Extension" workflow
3. Click "Run workflow"  
4. Enter the version number (e.g., `1.0.1`)
5. Click "Run workflow"

The workflow will:
- Update the manifest.json version
- Create a ZIP package
- Create a GitHub release
- Attach the ZIP file for download

#### Method 2: Manual Release

1. Update version in `extension/manifest.json`
2. Create a git tag:
   ```bash
   git tag v1.0.1
   git push origin v1.0.1
   ```
3. The workflow will automatically create the release

## Browser Compatibility

- ✅ **Chrome** (Manifest V3)
- ✅ **Edge** (Chromium-based)
- ⚠️ **Firefox** - Requires manifest conversion
- ❌ **Safari** - Not supported

## Privacy

This extension:
- ✅ Only runs on pages you visit
- ✅ Does not collect or transmit any data
- ✅ Stores settings locally in your browser
- ✅ Works completely offline
- ✅ No external API calls or tracking

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

### v1.0.0
- Initial release
- Basic form filling functionality
- Custom pattern support
- Random data generation
- Chrome extension popup UI

## Support

If you encounter any issues or have questions:

1. Check the [Issues page](../../issues) for known problems
2. Create a new issue with details about your problem
3. Include your Chrome version and extension version

## Roadmap

- [ ] Firefox support (Manifest V2)
- [ ] More random data types (dates, credit cards, etc.)
- [ ] Import/export pattern configurations
- [ ] Form field auto-detection improvements
- [ ] Conditional filling based on page URL patterns