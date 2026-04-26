import './Breadcrumbs.css';

/*
  items — массив объектов:
    { label: string, onClick?: () => void }

  Последний элемент считается текущей страницей (не кликабельный).
*/
export default function Breadcrumbs({ items = [] }) {
  if (items.length === 0) return null;

  return (
    <nav className="breadcrumbs" aria-label="Навигация">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="breadcrumbs__item">
            {item.onClick && !isLast ? (
              <button className="breadcrumbs__link" onClick={item.onClick}>
                {item.label}
              </button>
            ) : (
              <span className="breadcrumbs__current">{item.label}</span>
            )}
            {!isLast && <span className="breadcrumbs__sep">/</span>}
          </span>
        );
      })}
    </nav>
  );
}
