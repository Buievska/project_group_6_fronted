// app/tools/[toolId]/edit/EditToolForm.tsx
import AddEditToolForm from "@/components/AddEditToolForm/AddEditToolForm";
import styles from "./EditTool.module.css";


interface EditToolFormProps {
  toolId: string;
  initialValues: {
  name: string;
  pricePerDay: number;
  categoryId: string | number;
  terms: string;
  description: string;
  specifications: string;
  imageUrl?: string;
  };
}

export default function EditToolForm({
  
  initialValues,
}: EditToolFormProps) {
  return (
    <section className={styles.container}>
      <h1 className={styles.title}>Редагувати інструмент</h1>

      <AddEditToolForm mode="edit"
      
        initialValues={initialValues}
      />
    </section>
  );
}