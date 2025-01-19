import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs/promises';

const PYTHON_PATH = 'C:\\Program Files\\Python310\\python.exe';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const handFile = formData.get('hand_file') as File;
    const ringFile = formData.get('ring_file') as File;

    if (!handFile || !ringFile) {
      return NextResponse.json(
        { error: 'Hand and ring files are required' },
        { status: 400 }
      );
    }

    // Create temp directory if it doesn't exist
    const tempDir = path.join(process.cwd(), 'temp');
    await fs.mkdir(tempDir, { recursive: true });

    // Save files to temp directory
    const handPath = path.join(tempDir, 'hand.jpg');
    const ringPath = path.join(tempDir, 'ring.png');
    const outputPath = path.join(tempDir, 'output.png');

    await fs.writeFile(handPath, Buffer.from(await handFile.arrayBuffer()));
    await fs.writeFile(ringPath, Buffer.from(await ringFile.arrayBuffer()));

    // Run Python script
    const pythonScript = path.join(process.cwd(), 'scripts', 'process_ring.py');
    
    return new Promise((resolve) => {
      const pythonProcess = spawn(PYTHON_PATH, [
        pythonScript,
        handPath,
        ringPath,
        outputPath
      ]);

      let errorOutput = '';
      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
        console.error(`Python Error: ${data}`);
      });

      pythonProcess.on('close', async (code) => {
        if (code !== 0) {
          console.error('Python script error:', errorOutput);
          resolve(
            NextResponse.json(
              { error: 'Failed to process image', details: errorOutput },
              { status: 500 }
            )
          );
          return;
        }

        try {
          const outputBuffer = await fs.readFile(outputPath);
          
          // Cleanup temp files
          await Promise.all([
            fs.unlink(handPath),
            fs.unlink(ringPath),
            fs.unlink(outputPath)
          ]).catch(console.error);

          resolve(
            new NextResponse(outputBuffer, {
              headers: {
                'Content-Type': 'image/png'
              }
            })
          );
        } catch (error) {
          resolve(
            NextResponse.json(
              { error: 'Failed to read output image' },
              { status: 500 }
            )
          );
        }
      });
    });
  } catch (error) {
    console.error('Error processing ring:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 