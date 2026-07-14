/**
 * Renders a JSON-LD script tag. Server component — safe to embed structured
 * data without hydration. Pass any schema.org object (or array).
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe; schema objects are app-controlled.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
