import Link from "next/link";

export default function Button({ href, children }) {
  const baseStyles =
    "inline-block px-6 py-3 rounded-lg bg-green-600 text-white font-semibold shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition";

  if (href) {
    return (
      <Link href={href} className={baseStyles}>
        {children}
      </Link>
    );
  }

  // fallback: if no href, just a button element (optional)
  return (
    <button type="button" className={baseStyles}>
      {children}
    </button>
  );
}
