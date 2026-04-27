$source = "C:\fullstack3"
$destination = "C:\fullstack3\entrega-semana7.zip"

if (Test-Path $destination) {
    Remove-Item $destination -Force
}

Add-Type -AssemblyName System.IO.Compression.FileSystem

$excludeDirs = @("node_modules", ".git", "coverage", "dist", ".scannerwork", ".angular")

$zip = [System.IO.Compression.ZipFile]::Open($destination, 'Create')

Get-ChildItem -Path $source -Recurse -File | Where-Object {
    $path = $_.FullName
    $excluded = $false
    foreach ($dir in $excludeDirs) {
        if ($path -match [regex]::Escape("\$dir\") -or $path -match [regex]::Escape("\$dir$")) {
            $excluded = $true
            break
        }
    }
    -not $excluded -and $_.Name -ne "entrega-semana7.zip"
} | ForEach-Object {
    $relativePath = $_.FullName.Substring($source.Length + 1)
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $relativePath) | Out-Null
}

$zip.Dispose()

Write-Host "ZIP creado en: $destination"
$size = (Get-Item $destination).Length / 1MB
Write-Host ("Tamaño: {0:N2} MB" -f $size)
