import { createSerClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import slugify from 'slugify';

export async function GET() {
  try {
    const supabase = await createSerClient();

    // 1. Fetch all restaurants (with name and slug)
    const { data: allRestaurants, error: fetchError } = await supabase
      .from('restaurants')
      .select('id, name, slug');

    if (fetchError || !allRestaurants) {
      throw fetchError || new Error('Failed to fetch restaurants');
    }

    // 2. Prepare a set to track used slugs
    const usedSlugs = new Set<string>();
    const updates = [];

    for (const r of allRestaurants) {
      const baseSlug = slugify(r.name, { lower: true, strict: true });
      let slug = baseSlug;
      let counter = 1;

      // Generate unique slug
      while (usedSlugs.has(slug)) {
        slug = `${baseSlug}-${counter++}`;
      }

      usedSlugs.add(slug);

      // Only update if the slug is different
      if (r.slug !== slug) {
        updates.push({ id: r.id, slug });
      }
    }

    // 3. Update rows in the DB and log individual errors
    const failedUpdates: { id: number; error: any }[] = [];

    await Promise.all(
      updates.map(async (u) => {
        const { error } = await supabase
          .from('restaurants')
          .update({ slug: u.slug })
          .eq('id', u.id);

        if (error) {
          console.error(
            `Failed to update slug for restaurant ID ${u.id}:`,
            error
          );
          failedUpdates.push({ id: u.id, error });
        } else {
          console.log(`Updated restaurant ID ${u.id} → ${u.slug}`);
        }
      })
    );

    return NextResponse.json({
      success: true,
      updated: updates.length - failedUpdates.length,
      failed: failedUpdates.length,
      failedUpdates,
    });
  } catch (err: any) {
    console.error('🔥 Server Error in /api/fix-slugs:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
