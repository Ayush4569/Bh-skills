import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Challenge from '@/models/challenge';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<any> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    const challenge = await Challenge.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, challenge });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<any> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const challenge = await Challenge.findByIdAndDelete(id);
    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Challenge deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
