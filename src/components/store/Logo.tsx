import { Link } from "@tanstack/react-router";
import { store } from "@/config/store";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link to="/" aria-label={store.name} className="flex items-center">
      {store.logoUrl ? (
        <img src={store.logoUrl} alt={store.name} className="h-9 w-auto md:h-10" />
      ) : (
        <span className={`flex flex-col leading-none ${inverted ? "text-primary-foreground" : "text-foreground"}`}>
          <span className="font-display text-xl tracking-[0.18em] md:text-2xl">MARCOS</span>
          <span className="mt-1 text-[0.55rem] tracking-[0.42em] text-muted-foreground">JOIAS & RELÓGIOS</span>
        </span>
      )}
    </Link>
  );
}
