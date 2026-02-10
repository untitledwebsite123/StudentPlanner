import type { ReactNode } from 'react';

interface Props {
  title: string;
  count: number;
  children: ReactNode;
}

export const TaskList = ({ title, count, children }: Props) => (
  <section className="task-section">
    <header className="section-header">
      <div>
        <p className="section-kicker">Focus</p>
        <h3>
          {title} <span>· {count}</span>
        </h3>
      </div>
    </header>
    {count === 0 ? <p className="empty">Nothing scheduled here.</p> : children}
  </section>
);
