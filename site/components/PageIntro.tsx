type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  aside?: string;
};

export function PageIntro({ eyebrow, title, description, aside }: PageIntroProps) {
  return (
    <header className="page-intro shell">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-deck">{description}</p>
      </div>
      {aside ? <p className="page-aside">{aside}</p> : null}
    </header>
  );
}
