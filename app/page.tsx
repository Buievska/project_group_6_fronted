import styles from "./page.module.css";

import { HeroBlock } from "@/components/HeroBlock/HeroBlock";
import FeaturedToolsBlock from "../components/FeaturedToolsBlock/FeaturedToolsBlock";
import BenefitsBlock from "@/components/BenefitsBlock/BenefitsBlock";
import { FeedbacksBlock } from "@/components/FeedbacksBlock/FeedbacksBlock";
import { RegistrationBlock } from "@/components/RegistrationBlock/RegistrationBlock";

export default function HomePage() {
  return (
    <main className={styles.main}>
      {/* 1. HeroBlock: Заголовок та пошук */}
      <HeroBlock />

      {/* 2. BenefitsBlock: Переваги */}
      <BenefitsBlock />

      {/* 3. FeaturedToolsBlock: Популярні інструменти */}
      <FeaturedToolsBlock />

      {/* 4. FeedbacksBlock: Відгуки (свайпер) */}
      <FeedbacksBlock />

      {/* 5. RegistrationBlock: Пропозиція реєстрації */}
      <RegistrationBlock />
    </main>
  );
}
