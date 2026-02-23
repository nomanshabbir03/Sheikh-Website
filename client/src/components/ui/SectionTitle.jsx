// Section title component for consistent heading styling
export const SectionTitle = ({ children, level = 2 }) => {
  const Tag = `h${level}`;
  return <Tag className="section-title">{children}</Tag>;
};
