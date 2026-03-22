import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <div className="bg-bg-blush py-10 md:py-14 relative">
      <div className="max-w-[1430px] mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-medium text-heading mb-3 font-[family-name:var(--font-serif)]">
          {items.length > 0 ? items[items.length - 1].label : ''}
        </h2>
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center justify-center gap-2 text-sm">
            {items.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                {index > 0 && <span className="text-body-light">/</span>}
                {item.href && index < items.length - 1 ? (
                  <Link href={item.href} className="text-body hover:text-primary transition-colors duration-300">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-primary font-medium">{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb;
