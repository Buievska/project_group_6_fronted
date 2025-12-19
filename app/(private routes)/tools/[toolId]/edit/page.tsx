// app/tools/[toolId]/edit/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import { getToolById } from '@/lib/api/clientApi';
import styles from './EditTool.module.css';
import EditToolForm from './EditToolForm';
import { Tool } from '@/types/tool';

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
        console.error('Помилка завантаження інструменту:', err);
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
  
  // Підготовка initialValues для форми
  const initialValues = {
    name: tool.name,
    pricePerDay: tool.pricePerDay,
    categoryId: tool.category.id,
    terms: tool.terms || tool.rentalTerms || '',
    description: tool.description,
    specifications: tool.specifications
      ? typeof tool.specifications === 'string'
        ? tool.specifications
        : JSON.stringify(tool.specifications)
      : '',
    imageUrl: tool.images,
  };

  return (
    <EditToolForm
      toolId={toolId}
      initialValues={initialValues}
    />
  );
}