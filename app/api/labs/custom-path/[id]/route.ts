import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import CustomPath from '@/models/customPath';
import Challenge from '@/models/challenge';
import Module from '@/models/module';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const customPath = await CustomPath.findById(id).populate({
      path: 'challengeIds',
      model: Challenge,
      populate: {
        path: 'moduleId',
        model: Module,
        select: 'title',
      },
    });

    if (!customPath) {
      return NextResponse.json({ error: 'Custom path not found' }, { status: 404 });
    }

    return NextResponse.json(customPath);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const customPath = await CustomPath.findByIdAndDelete(id);
    if (!customPath) {
      return NextResponse.json({ error: 'Custom path not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Custom path deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
