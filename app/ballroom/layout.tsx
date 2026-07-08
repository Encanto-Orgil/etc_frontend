import styles from "./ballroom-public-layout.module.css";

export default function BallroomPublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.shell}>
      <div className={styles.inner}>{children}</div>
    </div>
  );
}
