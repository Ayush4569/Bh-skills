import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import CustomPath from '@/models/customPath';
import Module from '@/models/module';
import Challenge from '@/models/challenge';

export async function GET() {
  try {
    await connectToDatabase();
    const customPaths = await CustomPath.find({})
      .populate('challengeIds')
      .sort({ createdAt: -1 });
    return NextResponse.json(customPaths);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { title, selectedTopics, problemCount, difficultyProfile } = body;

    const pathTitle = title?.trim() || 'Custom Learning Sprint';
    const targetCount = problemCount || 30;
    const profile = difficultyProfile || 'Balanced';

    // Find modules matching selectedTopics (or all modules if none selected)
    let moduleQuery: any = {};
    if (selectedTopics && Array.isArray(selectedTopics) && selectedTopics.length > 0) {
      moduleQuery = { title: { $in: selectedTopics } };
    }

    const modules = await Module.find(moduleQuery).select('_id title');
    const moduleIds = modules.map((m) => m._id);

    // Fetch challenges belonging to these modules
    let challengeQuery: any = { published: true };
    if (moduleIds.length > 0) {
      challengeQuery.moduleId = { $in: moduleIds };
    }

    let allChallenges = await Challenge.find(challengeQuery);

    // If no challenges found by module query, fallback to all published challenges
    if (allChallenges.length === 0) {
      allChallenges = await Challenge.find({ published: true });
    }

    // Categorize challenges by difficulty
    const easy = allChallenges.filter((c) => c.difficulty === 'easy');
    const medium = allChallenges.filter((c) => c.difficulty === 'medium');
    const hard = allChallenges.filter((c) => c.difficulty === 'hard' || c.difficulty === 'miniproject');

    // Difficulty distribution ratios
    let easyRatio = 0.3;
    let medRatio = 0.5;
    let hardRatio = 0.2;

    if (profile === 'Beginner') {
      easyRatio = 0.6;
      medRatio = 0.3;
      hardRatio = 0.1;
    } else if (profile === 'Challenge') {
      easyRatio = 0.1;
      medRatio = 0.4;
      hardRatio = 0.5;
    }

    const targetEasy = Math.round(targetCount * easyRatio);
    const targetMed = Math.round(targetCount * medRatio);
    const targetHard = Math.round(targetCount * hardRatio);

    const selectedEasy = easy.slice(0, targetEasy);
    const selectedMed = medium.slice(0, targetMed);
    const selectedHard = hard.slice(0, targetHard);

    let selectedChallenges = [...selectedEasy, ...selectedMed, ...selectedHard];

    // Fill remaining if needed
    if (selectedChallenges.length < targetCount) {
      const selectedIds = new Set(selectedChallenges.map((c) => c._id.toString()));
      const remaining = allChallenges.filter((c) => !selectedIds.has(c._id.toString()));
      selectedChallenges = [...selectedChallenges, ...remaining.slice(0, targetCount - selectedChallenges.length)];
    }

    const challengeIds = selectedChallenges.map((c) => c._id);

    const newCustomPath = await CustomPath.create({
      title: pathTitle,
      selectedTopics: selectedTopics || [],
      problemCount: selectedChallenges.length,
      difficultyProfile: profile,
      challengeIds,
    });

    return NextResponse.json({ success: true, customPath: newCustomPath });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
