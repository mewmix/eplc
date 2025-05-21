import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'plant-data.json');

export async function GET() {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading plant data:', error);
    return NextResponse.json({ message: 'Error reading plant data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const newData = await request.json();

    // Validate if newData is an array (or whatever structure you expect)
    if (!Array.isArray(newData)) {
      return NextResponse.json({ message: 'Invalid data format: Expected an array of products.' }, { status: 400 });
    }

    const jsonData = JSON.stringify(newData, null, 2); // Pretty print JSON
    await fs.writeFile(dataFilePath, jsonData, 'utf-8');

    return NextResponse.json({ message: 'Products updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error writing plant data:', error);
    if (error instanceof SyntaxError) { // Handle JSON parsing errors from request.json()
        return NextResponse.json({ message: 'Invalid JSON in request body' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Error writing plant data' }, { status: 500 });
  }
}
