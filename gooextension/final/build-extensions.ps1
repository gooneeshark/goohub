$ErrorActionPreference = "Stop"

# PowerShell script to build extensions for different browsers.
Write-Host "🦈 Building Shark Tools Extensions for Multiple Browsers..." -ForegroundColor Cyan

# Clean only generated unpacked folders; keep existing release archives intact until replaced.
$buildDir = "build"
foreach ($target in @("$buildDir/chrome", "$buildDir/firefox")) {
    if (Test-Path $target) {
        Remove-Item $target -Recurse -Force
    }
}
New-Item -ItemType Directory -Path $buildDir -Force | Out-Null

# Files to include in all builds
$commonFiles = @(
    "content.js",
    "setting.html", 
    "setting.js",
    "image"
)

Write-Host "📁 Creating build directories..." -ForegroundColor Yellow

# Create Chrome build (Manifest V3)
$chromeDir = "$buildDir/chrome"
New-Item -ItemType Directory -Path $chromeDir | Out-Null

# Copy common files to Chrome build
foreach ($file in $commonFiles) {
    if (Test-Path $file) {
        Copy-Item $file $chromeDir -Recurse -Force
        Write-Host "  ✅ Copied $file to Chrome build" -ForegroundColor Green
    }
}
Copy-Item "manifest.json" "$chromeDir/manifest.json" -Force
Copy-Item "background.js" "$chromeDir/background.js" -Force

# Create Firefox build (Manifest V2)
$firefoxDir = "$buildDir/firefox"
New-Item -ItemType Directory -Path $firefoxDir | Out-Null

# Copy common files to Firefox build
foreach ($file in $commonFiles) {
    if (Test-Path $file) {
        Copy-Item $file $firefoxDir -Recurse -Force
        Write-Host "  ✅ Copied $file to Firefox build" -ForegroundColor Green
    }
}
Copy-Item "manifest-firefox.json" "$firefoxDir/manifest.json" -Force
Copy-Item "background-firefox.js" "$firefoxDir/background.js" -Force

Write-Host "📦 Creating extension packages..." -ForegroundColor Yellow

# Create ZIP for Chrome (can be loaded as unpacked or converted to CRX)
$chromeZip = "$buildDir/shark-tools-chrome.zip"
Compress-Archive -Path "$chromeDir/*" -DestinationPath $chromeZip -Force
Write-Host "  ✅ Created Chrome ZIP: $chromeZip" -ForegroundColor Green

# Create XPI for Firefox using a temporary ZIP archive.
$firefoxXpi = "$buildDir/shark-tools-firefox.xpi"
$firefoxZip = "$buildDir/shark-tools-firefox.zip"
Compress-Archive -Path "$firefoxDir/*" -DestinationPath $firefoxZip -Force
Move-Item -Path $firefoxZip -Destination $firefoxXpi -Force
Write-Host "  ✅ Created Firefox XPI: $firefoxXpi" -ForegroundColor Green

# Create universal ZIP (for manual installation)
$universalZip = "$buildDir/shark-tools-universal.zip"
Compress-Archive -Path "$chromeDir/*" -DestinationPath $universalZip -Force
Write-Host "  ✅ Created Universal ZIP: $universalZip" -ForegroundColor Green

# Create Edge build (same as Chrome but different name)
$edgeZip = "$buildDir/shark-tools-edge.zip"
Compress-Archive -Path "$chromeDir/*" -DestinationPath $edgeZip -Force
Write-Host "  ✅ Created Edge ZIP: $edgeZip" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 Build Complete! Created packages:" -ForegroundColor Cyan
Write-Host "  📱 Chrome/Chromium: $chromeZip" -ForegroundColor White
Write-Host "  🦊 Firefox: $firefoxXpi" -ForegroundColor White  
Write-Host "  🌐 Microsoft Edge: $edgeZip" -ForegroundColor White
Write-Host "  📦 Universal: $universalZip" -ForegroundColor White
Write-Host ""
Write-Host "📋 Installation Instructions:" -ForegroundColor Yellow
Write-Host "  Chrome: Extract the ZIP, then choose Load unpacked at chrome://extensions" -ForegroundColor Gray
Write-Host "  Firefox: Go to about:debugging > This Firefox > Load Temporary Add-on (select XPI)" -ForegroundColor Gray
Write-Host "  Edge: Extract the ZIP, then choose Load unpacked at edge://extensions" -ForegroundColor Gray
Write-Host ""
Write-Host "🔧 For production deployment:" -ForegroundColor Yellow
Write-Host "  - Chrome: Submit ZIP to Chrome Web Store" -ForegroundColor Gray
Write-Host "  - Firefox: Submit XPI to Firefox Add-ons (AMO)" -ForegroundColor Gray
Write-Host "  - Edge: Submit ZIP to Microsoft Edge Add-ons" -ForegroundColor Gray