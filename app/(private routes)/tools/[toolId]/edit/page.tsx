"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { getToolById } from "@/lib/api/clientApi";
import styles from "./EditTool.module.css";
import EditToolForm from "./EditToolForm";
import { Tool } from "@/types/tool";

// Створюємо допоміжний інтерфейс для категорії, якщо вона приходить як об'єкт
interface CategoryObject {
  _id?: string;
  id?: string | number;
  name?: string;
}

export default function EditToolPage() {
  const params = useParams();
  const toolId = params.toolId as string;

  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!toolId) {
      setError(true);
      setLoading(false);
      return;
    }

    getToolById(toolId)
      .then((data) => {
        setTool(data);
      })
      .catch((err) => {
        console.error("Помилка завантаження інструменту:", err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [toolId]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Завантаження...</div>
      </div>
    );
  }

  if (error || !tool) {
    notFound();
  }

  // Замінюємо any на Record<string, unknown> або string
  const formatSpecifications = (
    specs: Record<string, unknown> | string | undefined | null
  ): string => {
    if (!specs) return "";
    if (typeof specs === "string") return specs;

    return Object.entries(specs)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
  };

  let categoryIdValue: string | number = "";

  if (typeof tool.category === "object" && tool.category !== null) {
    const cat = tool.category as CategoryObject;
    // Пріоритет віддаємо _id, якщо його немає — беремо id
    categoryIdValue = cat._id || cat.id || "";
  } else if (
    typeof tool.category === "string" ||
    typeof tool.category === "number"
  ) {
    categoryIdValue = tool.category;
  }

  const initialValues = {
    id: tool._id,
    name: tool.name,
    pricePerDay: tool.pricePerDay,
    categoryId: categoryIdValue, // Тепер тут буде правильне значення
    terms: tool.rentalTerms || "",
    description: tool.description,
    specifications: formatSpecifications(
      tool.specifications as Record<string, unknown>
    ),
    imageUrl: tool.images,
  };

  return <EditToolForm toolId={toolId} initialValues={initialValues} />;
}
