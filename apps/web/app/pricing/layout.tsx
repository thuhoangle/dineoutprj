export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        {children}
      </div>
    </section>
  );
}

// export default function RisingLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <section className="ipadMini:h-screen min-h-screen">
//       <div className="relative w-full h-full min-h-0 pb-5">{children}</div>
//     </section>
//   );
// }
