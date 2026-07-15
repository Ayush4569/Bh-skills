import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Course from '@/models/course';

export async function GET() {
  try {
    await connectToDatabase();
    const courses = await Course.find({ published: true }).sort({ order: 1 });
    return NextResponse.json(courses);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
