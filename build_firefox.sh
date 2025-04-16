echo "📦 Building Firefox extension..."
zip -r ../forgelock-firefox.zip . -x "*.DS_Store" -x ".git/*"
echo "✅ Firefox extension built successfully!"