import { Card } from "./Card";

export type PlaceholderPageProps = {
  title: string;
  description: string;
};

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="container-page py-20">
      <Card className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-600">
          Coming soon
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-body">{description}</p>
      </Card>
    </div>
  );
}
