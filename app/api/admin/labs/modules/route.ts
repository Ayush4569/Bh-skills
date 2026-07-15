import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Module from '@/models/module';
import Course from '@/models/course'; // Register Course model

export async function GET() {
  try {
    await connectToDatabase();
    const modules = await Module.find({})
      .populate('courseId', 'title')
      .sort({ courseId: 1, order: 1 });
    return NextResponse.json(modules);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
