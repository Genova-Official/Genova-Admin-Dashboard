import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Button = ({
  title,
  size = 'medium',
  color = 'gray',
  isBorder = false,
  onClick = () => {},
  icon,
  iconProps = {},
}) => {
  const baseStyles = 'font-poppins rounded-lg transition-all duration-200';
  const sizeStyles = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-7 py-3 text-base',
    large: 'px-10 py-3 text-lg',
  };

  const colorStyles = {
    red: 'bg-red-light text-white hover:bg-red-600',
    green: 'bg-green-dark text-white hover:bg-green-light',
    blue: 'bg-blue-500 text-white hover:bg-blue-600',
    gray: 'bg-gray-300 text-gray-800 hover:bg-gray-400',
  };

  const borderStyles = isBorder ? 'border border-gray-300' : '';

  return (
    <button
      onClick={onClick}
      className={classNames(
        baseStyles,
        sizeStyles[size],
        colorStyles[color],
        borderStyles,
        'flex items-center gap-2'
      )}
    >
      {icon && React.createElement(icon.type, { ...iconProps })}
      {title}
    </button>
  );
};

Button.propTypes = {
  title: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.oneOf(['red', 'green', 'blue', 'gray']),
  isBorder: PropTypes.bool,
  onClick: PropTypes.func,
  icon: PropTypes.element,
  iconProps: PropTypes.object,
};

export default Button;
