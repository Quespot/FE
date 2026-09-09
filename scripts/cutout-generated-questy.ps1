param(
  [string]$SourceDirectory = (Join-Path $PSScriptRoot "..\src\assets\customize\generated-full"),
  [string]$OutputDirectory = (Join-Path $PSScriptRoot "..\src\assets\customize\combinations"),
  [string]$BaseImage = (Join-Path $PSScriptRoot "..\src\assets\customize\layered\questy-base.png"),
  [switch]$Force
)

$ErrorActionPreference = "Stop"

$references = @(
  (Join-Path $PSHOME "System.Drawing.Common.dll"),
  (Join-Path $PSHOME "System.Drawing.Primitives.dll"),
  (Join-Path $PSHOME "System.Runtime.dll"),
  (Join-Path $PSHOME "System.Private.Windows.GdiPlus.dll"),
  (Join-Path $PSHOME "System.Private.Windows.Core.dll"),
  (Join-Path $PSHOME "System.Private.CoreLib.dll")
)

if (-not ("QuestyBackgroundRemover" -as [type])) {
  Add-Type -ReferencedAssemblies $references -TypeDefinition @'
using System;
using System.Drawing;
using System.Drawing.Imaging;

public static class QuestyBackgroundRemover
{
    private static bool IsLowChroma(Color color)
    {
        int maximum = Math.Max(color.R, Math.Max(color.G, color.B));
        int minimum = Math.Min(color.R, Math.Min(color.G, color.B));
        return maximum - minimum < 18;
    }

    private static bool IsLocallySimilar(Color current, Color next)
    {
        return Math.Abs(current.R - next.R) <= 5
            && Math.Abs(current.G - next.G) <= 5
            && Math.Abs(current.B - next.B) <= 5;
    }

    public static void CutOut(string sourcePath, string outputPath)
    {
        using (var source = new Bitmap(sourcePath))
        {
            int width = source.Width;
            int height = source.Height;
            bool[] background = new bool[width * height];
            int[] queue = new int[width * height];
            int head = 0;
            int tail = 0;

            Action<int, int> seed = (x, y) =>
            {
                int index = y * width + x;
                if (!background[index] && IsLowChroma(source.GetPixel(x, y)))
                {
                    background[index] = true;
                    queue[tail++] = index;
                }
            };

            for (int x = 0; x < width; x++)
            {
                seed(x, 0);
                seed(x, height - 1);
            }
            for (int y = 0; y < height; y++)
            {
                seed(0, y);
                seed(width - 1, y);
            }

            int[] offsetX = { 1, -1, 0, 0 };
            int[] offsetY = { 0, 0, 1, -1 };
            while (head < tail)
            {
                int index = queue[head++];
                int x = index % width;
                int y = index / width;
                Color current = source.GetPixel(x, y);
                for (int direction = 0; direction < 4; direction++)
                {
                    int nextX = x + offsetX[direction];
                    int nextY = y + offsetY[direction];
                    if (nextX < 0 || nextY < 0 || nextX >= width || nextY >= height) continue;

                    int nextIndex = nextY * width + nextX;
                    Color next = source.GetPixel(nextX, nextY);
                    if (!background[nextIndex] && IsLowChroma(next) && IsLocallySimilar(current, next))
                    {
                        background[nextIndex] = true;
                        queue[tail++] = nextIndex;
                    }
                }
            }

            using (var output = new Bitmap(width, height, PixelFormat.Format32bppArgb))
            {
                for (int y = 0; y < height; y++)
                {
                    for (int x = 0; x < width; x++)
                    {
                        int index = y * width + x;
                        output.SetPixel(x, y, background[index] ? Color.Transparent : source.GetPixel(x, y));
                    }
                }
                output.Save(outputPath, ImageFormat.Png);
            }
        }
    }
}
'@
}

New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null

$files = Get-ChildItem -File (Join-Path $SourceDirectory "*.png")
foreach ($file in $files) {
  $outputPath = Join-Path $OutputDirectory $file.Name
  if (-not $Force -and (Test-Path -LiteralPath $outputPath) -and (Get-Item -LiteralPath $outputPath).LastWriteTimeUtc -ge $file.LastWriteTimeUtc) {
    Write-Output "Already prepared $($file.Name)"
    continue
  }
  [QuestyBackgroundRemover]::CutOut($file.FullName, $outputPath)
  Write-Output "Cut out $($file.Name)"
}

Copy-Item -Force $BaseImage (Join-Path $OutputDirectory "base.png")
Write-Output "Prepared $($files.Count + 1) full-character combinations."
