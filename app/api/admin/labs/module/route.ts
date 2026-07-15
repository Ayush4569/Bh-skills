import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Module from '@/models/module';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { title, description, courseId, order } = body;

    if (!title || !description || !courseId) {
      return NextResponse.json({ error: 'Title, description, and courseId are required' }, { status: 400 });
    }

    const newModule = await Module.create({
      title,
      description,
      courseId,
      order: order || 0,
    });

    return NextResponse.json({ success: true, module: newModule });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
