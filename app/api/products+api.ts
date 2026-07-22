import { connectToDatabase } from '../../lib/db';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '4', 10);
    const skip = parseInt(url.searchParams.get('skip') || '0', 10);
    const category = url.searchParams.get('category');
    const tag = url.searchParams.get('tag');
    const search = url.searchParams.get('search');
    const offerOnly = url.searchParams.get('offerOnly') === 'true';

    const { db } = await connectToDatabase();
    const query: any = {};

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }
    if (tag) {
      query.tag = tag;
    }
    if (offerOnly) {
      query.offer = { $exists: true, $ne: null, $gt: 0 };
    }
    if (search) {
      query.$or = [
        { name: { $regex: new RegExp(search, 'i') } },
        { subtitle: { $regex: new RegExp(search, 'i') } },
        { brand: { $regex: new RegExp(search, 'i') } }
      ];
    }

    const collection = db.collection('products');
    const total = await collection.countDocuments(query);
    const docs = await collection.find(query).skip(skip).limit(limit).toArray();

    const products = docs.map((doc: any) => {
      return {
        id: doc.id || doc._id.toString(),
        slug: doc.slug,
        name: doc.name,
        subtitle: doc.subtitle,
        badges: doc.badges || [],
        rootImage: doc.rootImage && doc.rootImage.driveId
          ? `https://drive.google.com/thumbnail?id=${doc.rootImage.driveId}&sz=w400`
          : doc.rootImage,
        images: (doc.images || []).map((img: any) =>
          img && img.driveId ? `https://drive.google.com/thumbnail?id=${img.driveId}&sz=w400` : img
        ),
        category: doc.category,
        brand: doc.brand,
        rating: doc.rating,
        tag: doc.tag,
        offer: doc.offer,
        price: doc.price,
        specification: doc.specification
      };
    });

    const hasMore = skip + products.length < total;

    return Response.json({ products, hasMore, total });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
