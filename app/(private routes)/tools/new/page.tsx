import AddEditToolForm from "@/components/AddEditToolForm/AddEditToolForm";
import styles from "./CreateTool.module.css";

export default function CreateToolPage() {
  return (
    <div className={styles.pageWrapper}>
      <section className={styles.container}>
        <h1 className={styles.title}>Публікація інструменту</h1>
        <AddEditToolForm mode="create" />
      </section>
    </div>
  );
}
