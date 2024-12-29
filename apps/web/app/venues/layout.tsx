export default function VenueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="ipadMini:h-screen min-h-screen">
      <div className="relative w-full h-full min-h-0 pb-5">{children}</div>
    </section>
  );
}
