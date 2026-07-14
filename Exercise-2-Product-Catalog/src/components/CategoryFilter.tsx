interface CategoryFilterProps {
  categories: string[];
  selected: string; // "" means "All"
  onSelect: (category: string) => void;
}

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  // "" (All) first, then every category from the API.
  const options = ["", ...categories];

  return (
    <div className="filters">
      {options.map((category) => (
        <button
          key={category || "all"}
          className={`chip ${selected === category ? "chip--active" : ""}`}
          onClick={() => onSelect(category)}
        >
          {category === "" ? "All" : category}
        </button>
      ))}
    </div>
  );
}
