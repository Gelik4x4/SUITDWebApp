function Icon({ 
  name, 
  size = 24, 
  color = "currentColor", 
  strokeWidth = 2, 
  className = "",
  ...props
}) {
  return (
    <svg 
      {...props}
      width={size} 
      height={size} 
      // style={{ color, ...props.style }}
      stroke = {color}
      fill="none"
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <use href={`/sprite.svg#${name}`} />
    </svg>
  );
};

export default Icon;
