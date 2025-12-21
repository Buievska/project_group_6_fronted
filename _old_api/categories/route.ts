import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("nodagrup");

    const categories = await db
      .collection("categories")
      .find({})
      .project({ title: 1 })
      .toArray();

    const formattedCategories = categories.map((c) => ({
      id: c._id.toString(),
      name: c.title,
    }));

    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json(
      { message: "Помилка завантаження категорій" },
      { status: 500 }
    );
  }
}
