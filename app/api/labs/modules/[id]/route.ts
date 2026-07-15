import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Module from '@/models/module';
import Challenge from '@/models/challenge';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<any> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const moduleData = await Module.findById(id);
    if (!moduleData) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    const challenges = await Challenge.find({ moduleId: id, published: true }).sort({ createdAt: 1 });
    
    return NextResponse.json({
      module: moduleData,
      challenges,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
