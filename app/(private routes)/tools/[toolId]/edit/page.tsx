"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { getToolById } from "@/lib/api/clientApi";
import styles from "./EditTool.module.css";
import EditToolForm from "./EditToolForm";
import { Tool } from "@/types/tool";

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

  const formatSpecifications = (specs: any): string => {
    if (!specs) return "";
    if (typeof specs === "string") return specs;

    return Object.entries(specs)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
  };

  const categoryIdValue =
    typeof tool.category === "object"
      ? (tool.category as any)._id
      : tool.category;

  const initialValues = {
    id: tool._id,
    name: tool.name,
    pricePerDay: tool.pricePerDay,
    categoryId: categoryIdValue,
    terms: tool.rentalTerms || "",
    description: tool.description,
    specifications: formatSpecifications(tool.specifications),
    imageUrl: tool.images,
  };

  return <EditToolForm toolId={toolId} initialValues={initialValues} />;
}
