import { ReactNode } from "react";
import styles from "@/components/ui/css/layout.module.css";

interface PageLayoutProps {
  title: string;
  subtitle: ReactNode;
  children: ReactNode;
  hasHeader?: boolean;
  icon?: ReactNode; // or any
}

export function PageLayout({
  title,
  subtitle,
  children,
  hasHeader = true,
  icon,
}: PageLayoutProps) {
  return (
    <div className={styles.pageLayout}>
      <div className={styles.content}>
        {hasHeader && (
          <div className={styles.header}>
            <div className={styles.titleSection}>
              <div className={styles.titleContainer}>
                {icon}
                <h1 className={styles.title}>{title}</h1>
              </div>
              <div className={styles.subtitleContainer}>
                <span className={styles.subtitle}>{subtitle}</span>
              </div>
            </div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
