import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Achievement from '@/models/achievement';
import UserProgress from '@/models/userProgress';

export async function GET() {
  try {
    await connectToDatabase();
    const userId = 'guest_user';
    
    const achievements = await Achievement.find({}).sort({ xpRequired: 1 });
    const progress = await UserProgress.findOne({ userId });
    
    const userXp = progress ? progress.xp : 0;
    
    const formattedAchievements = achievements.map(ach => ({
      _id: ach._id,
      title: ach.title,
      description: ach.description,
      xpRequired: ach.xpRequired,
      icon: ach.icon,
      unlocked: userXp >= ach.xpRequired,
    }));
    
    return NextResponse.json(formattedAchievements);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
