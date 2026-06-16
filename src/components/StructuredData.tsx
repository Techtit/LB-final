import { Helmet } from "react-helmet-async";

interface StructuredDataProps {
  data: Record<string, unknown>;
}

/**
 * Renders JSON-LD structured data into the <head> via react-helmet-async.
 * Usage: <StructuredData data={localBusinessSchema} />
 */
const StructuredData = ({ data }: StructuredDataProps) => (
  <Helmet>
    <script type="application/ld+json">{JSON.stringify(data)}</script>
  </Helmet>
);

export default StructuredData;
