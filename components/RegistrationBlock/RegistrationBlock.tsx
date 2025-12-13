import Link from "next/link";

export const RegistrationBlock = () => {
  return (
    <section className="container">
      <h2>Приєднуйся до ToolNext</h2>
      <p>Орендуй вигідно, здавай безпечно.</p>
      <Link href="/auth/register" className="btn-primary">
        Зареєструватися
      </Link>
    </section>
  );
};
