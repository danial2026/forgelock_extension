echo "📦 Building Chrome extension..."
zip -r ../forgelock-chrome.zip . -x "*.DS_Store" -x ".git/*"
echo "✅ Chrome extension built successfully!"