import { formatClp } from "@/domain/money";
import type { QuoteSnapshot } from "@/domain/types";

export function QuoteTicket({
  quote,
  heading = "Cotización",
}: {
  quote: QuoteSnapshot;
  heading?: string;
}) {
  return (
    <section className="ticket" aria-label={heading}>
      <h2>{heading}</h2>
      <dl>
        {quote.lines.map((line) => (
          <div key={line.id}>
            <dt>{line.label}</dt>
            <dd>{formatClp(line.amount)}</dd>
          </div>
        ))}
      </dl>
      <p className="ticket-total">
        <span>Total</span>
        <strong>{formatClp(quote.total)}</strong>
      </p>
      <p className="fine">IVA incluido · tarifa {quote.ruleset}</p>
    </section>
  );
}
