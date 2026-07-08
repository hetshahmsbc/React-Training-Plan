// FilterSortBar.tsx — the category filter and the sort dropdown.

import type { Category } from "../types";

interface FilterSortBarProps {
  categories: Category[];
  category: string;
  onCategoryChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
}

export default function FilterSortBar({
  categories,
  category,
  onCategoryChange,
  sort,
  onSortChange,
}: FilterSortBarProps) {
  return (
    <div className="controls">
      <div className="control">
        <label className="control-label" htmlFor="category">
          Category
        </label>
        <select
          id="category"
          className="select"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="control">
        <label className="control-label" htmlFor="sort">
          Sort by
        </label>
        <select
          id="sort"
          className="select"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating-desc">Rating: High to Low</option>
          <option value="title-asc">Name: A to Z</option>
          <option value="title-desc">Name: Z to A</option>
        </select>
      </div>
    </div>
  );
}
