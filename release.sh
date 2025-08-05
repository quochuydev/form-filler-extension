#!/bin/bash

# Release script for Random Form Filler extension
# Usage: ./release.sh [version]
# Example: ./release.sh 1.0.1

set -e

VERSION="$1"

if [ -z "$VERSION" ]; then
    echo "Usage: $0 <version>"
    echo "Example: $0 1.0.1"
    exit 1
fi

echo "🚀 Creating release for version $VERSION"

# Validate version format
if ! [[ $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "❌ Invalid version format. Use semantic versioning (e.g., 1.0.1)"
    exit 1
fi

# Update package.json version
echo "📝 Updating package.json version..."
sed -i '' "s/\"version\": \"[^\"]*\"/\"version\": \"$VERSION\"/" package.json

# Update manifest.json version  
echo "📝 Updating manifest.json version..."
sed -i '' "s/\"version\": \"[^\"]*\"/\"version\": \"$VERSION\"/" extension/manifest.json

# Verify updates
echo "✅ Updated versions:"
echo "   package.json: $(grep '"version":' package.json)"
echo "   manifest.json: $(grep '"version":' extension/manifest.json)"

# Create ZIP package
echo "📦 Creating extension package..."
cd extension
zip -r "../random-form-filler-v$VERSION.zip" . -x "*.DS_Store"
cd ..

echo "✅ Created: random-form-filler-v$VERSION.zip"

# Commit changes
echo "💾 Committing version bump..."
git add package.json extension/manifest.json
git commit -m "Bump version to v$VERSION" || echo "No changes to commit"

# Create and push tag
echo "🏷️  Creating git tag..."
git tag "v$VERSION"

echo "📤 Pushing changes and tags..."
git push origin main
git push origin "v$VERSION"

echo ""
echo "🎉 Release v$VERSION created successfully!"
echo ""
echo "Next steps:"
echo "1. Go to: https://github.com/yourusername/random-form-filler/releases"
echo "2. Edit the auto-created release"
echo "3. Upload the ZIP file: random-form-filler-v$VERSION.zip"
echo "4. Publish the release"
echo ""
echo "Or use GitHub Actions:"
echo "1. Go to the Actions tab"  
echo "2. Run 'Release Extension' workflow"
echo "3. Enter version: $VERSION"