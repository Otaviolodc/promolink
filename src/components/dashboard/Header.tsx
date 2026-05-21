export function Header() {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <p className="text-sm text-gray-500">
          Acompanhe seus resultados
        </p>
      </div>

      <button className="bg-black text-white px-5 py-2 rounded-xl">
        + Novo Link
      </button>
    </div>
  );
}