// Reusable Button component
export const Button = ({ children, onClick, variant = 'primary', ...props }) => {
  return (
    <button onClick={onClick} className={`btn btn-${variant}`} {...props}>
      {children}
    </button>
  );
};
