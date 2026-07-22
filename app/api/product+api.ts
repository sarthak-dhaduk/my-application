import { connectToDatabase } from '../../lib/db';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'Missing product ID' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const collection = db.collection('products');

    let query: any = { id: id };
    let doc = await collection.findOne(query);

    if (!doc) {
      try {
        const { ObjectId } = require('mongodb');
        doc = await collection.findOne({ _id: new ObjectId(id) });
      } catch (e) {}
    }

    if (!doc) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = {
      id: doc.id || doc._id.toString(),
      slug: doc.slug,
      name: doc.name,
      subtitle: doc.subtitle,
      badges: doc.badges || [],
      rootImage: doc.rootImage && doc.rootImage.driveId
        ? `https://drive.google.com/thumbnail?id=${doc.rootImage.driveId}&sz=w1000`
        : doc.rootImage,
      images: (doc.images || []).map((img: any) =>
        img && img.driveId ? `https://drive.google.com/thumbnail?id=${img.driveId}&sz=w1000` : img
      ),
      category: doc.category,
      brand: doc.brand,
      rating: doc.rating,
      tag: doc.tag,
      offer: doc.offer,
      price: doc.price,
      specification: doc.specification
    };

    return Response.json(product);
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
